var check = require('../libs/check.js');
var common = require('../libs/common.js');
var code = require('../libs/code.js');
var conn = require('../libs/mysql.js');
var datas = require('../libs/datas.js');
var config = require('../config.js');
//var tokenName = 1;
var like = {

    name:"点赞处理页"
};

like.post = function(req,res){
    console.log(req.body);

    conn.query(
        {
            sql: 'select userId from `secret_post_like` where postId = ' + req.body.id + ' and userId='+req.session.userId
        }, function (e3, r3) {
            if (e3) {
                console.log(e3);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }


  if(r3.length==0) {

      conn.query(
          {
              sql: 'insert into secret_post_like (userId,postId,date) value ("' + req.session.userId + '","' + req.body.id + '","' + common.time() + '")'
          }, function (e1, r1) {
              if (e1) {
                  console.log(e1);
                  res.end(JSON.stringify(code.mysqlError));
                  return;
              }
              res.end(common.format(200, 'yes', {
                  id: r1.insertId
              }));
              //console.log('select * from secret_post where id='+req.body.id);return;
              /**
               * 加入通知系统
               */

                  //todo 写成封装好的队列接口,只添加一个id，由消费者去处理
              conn.query(
                  {
                      sql: 'select * from secret_post where id=' + req.body.id
                  }, function (e2, r2) {
                      //console.log(r2.length);return;
                      if (e2 || !r2.length) {
                          console.log(e2);
                          console.log('没有这个帖子');
                          return;
                      }
                      conn.query(
                          {
                              sql: 'insert into `secret_notice` (`userId`,`parentCommentId`,`date`,`status`,`pattern`,`nickname`,`content`,`originContent`,`postId`,`authorId`,`commentId`)' +
                              'values ' +
                              '("' + req.session.userId + '","0","' + common.time() + '","1","1","' + req.session.nickname + '","","' + r2[0].content.substr(0, 128) + '","' + req.body.id + '","' + r2[0].userId + '","0")'
                          }, function (e2, r2) {
                              if (e2) {
                                  console.log(e2);
                                  console.log('未能成功建立通知');
                                  return;
                              }
                          }
                      )
                  }
              );


              /**
               * 判断是否添加到微博发布的列表，期待封装
               */
              conn.query(
                  {
                      sql: 'select count("postId") from `secret_post_like` where postId = ' + req.body.id
                  }, function (e6, r6) {
                      if (e6) {
                          console.log(e6);
                          res.end(JSON.stringify(code.mysqlError));
                          return;
                      }
                      console.log(r6);
                      console.log(config);
                      console.log(config.postWeibo);
              if (r6[0]['count("postId")'] >= config.postWeibo.count) {

                  conn.query(
                      {
                          sql: "select id from `secret_weibo_query` where postId=" + req.body.id
                      }, function (e5, r5) {
                          if (e5) {
                              console.log(e5);
                              return;
                          }
                          if (r5.length == 0) {

                              console.log('加入微博发布队列');
                              console.log("insert into secret_weibo_query (postId,createAt) values (" + parseInt(req.body.id) + "," + common.time() + ")");
                              conn.query(
                                  {
                                      sql: "insert into secret_weibo_query (postId,createAt) values (" + parseInt(req.body.id) + "," + common.time() + ")"
                                  }, function (e4, r4) {
                                      console.log(e4, r4);
                                  }
                              )

                          }
                      }
                  )


              }

                  });



          }
      )
  }else{

      res.end(JSON.stringify(code.userHasLike));

return;
  }
        });

};

like.comment = function(req,res){
    conn.query(
        {
            sql:'insert into secret_comment_like (userId,commentId,date) value ("'+req.session.userId+'","'+req.body.id+'","'+common.time() +'")'
        },function(e1,r1){
            if(e1){
                console.log(e1);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            res.end(common.format(200,'yes',{
                id:r1.insertId
            }));
            conn.query(
                {
                    sql:'select * from secret_comment where id='+req.body.id
                },function (e2, r2) {
                    //console.log(r2.length);return;
                    if(e2||!r2.length){
                        console.log(e2);
                        console.log('没有这个评论');
                        return;
                    }

                    conn.query(
                        {
                            sql:'insert into `secret_notice` (`userId`,`parentCommentId`,`date`,`status`,`pattern`,`nickname`,`content`,`originContent`,`postId`,`authorId`,`commentId`)' +
                                'values '+
                                '("'+req.session.userId+'","'+r2[0].parentId+'","' + common.time() + '","1","3","'+req.session.nickname+'","","'+r2[0].content.substr(0,128)+'","'+r2[0].postId+'","'+r2[0].userId+'","'+req.body.id+'")'
                        }, function (e2, r2) {
                            if(e2){
                                console.log(e2);
                                console.log('未能成功建立通知');
                                return;
                            }
                        }
                    )
                }
            )
        }
    )
};

like.postsDel = function(req,res){
    //console.log(req.body);

   //console.log('DELETE FROM `secret_post_like` WHERE postId = '+req.body.id);
    conn.query(
        {
            sql:'DELETE FROM `secret_post_like` where userId = '+req.session.userId+' and postId = ' + req.body.id
        },function(e1,r1){
            if(e1){
                console.log(e1);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            res.end(common.format(200,'yes',{
                id:r1.insertId
            }))
        }
    )
};

like.commentDel = function(req,res){
    conn.query(
        {
            sql:'DELETE FROM `secret_comment_like` where userId = '+req.session.userId+' and id = ' + req.body.id
        },function(e1,r1){
            if(e1){
                console.log(e1);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            res.end(common.format(200,'yes',{
                id:r1.insertId
            }))
        }
    )
};


module.exports = like;