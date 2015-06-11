var check = require('../libs/check.js');
var common = require('../libs/common.js');
var code = require('../libs/code.js');
var async = require('async');
var conn = require('../libs/mysql.js');
var datas = require('../libs/datas.js');
//var tokenName = 1;
var like = {

    name:"点赞处理页"
};

like.post = function(req,res){
    console.log(req.body);
    conn.query(
        {
            sql:'insert into secret_post_like (userId,postId,date) value ("'+req.session.userId+'","'+req.body.id+'","'+common.time() +'")'
        },function(e1,r1){
            if(e1){
                console.log(e1);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            res.end(common.format(200,'yes',{
                id:r1.insertId
            }));
            //console.log('select * from secret_post where id='+req.body.id);return;
            conn.query(
                {
                    sql:'select * from secret_post where id='+req.body.id
                },function (e2, r2) {
                    //console.log(r2.length);return;
                    if(e2||!r2.length){
                        console.log(e2);
                        console.log('没有这个帖子');
                        return;
                    }conn.query(
                        {
                            sql:'insert into `secret_notice` (`userId`,`parentCommentId`,`date`,`status`,`pattern`,`nickname`,`content`,`originContent`,`postId`,`authorId`,`commentId`)' +
                                'values '+
                                '("'+req.session.userId+'","0","' + common.time() + '","1","1","'+req.session.nickname+'","","'+r2[0].content.substr(0,128)+'","'+req.body.id+'","'+req.session.userId+'","0")'
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
                    }conn.query(
                        {
                            sql:'insert into `secret_notice` (`userId`,`parentCommentId`,`date`,`status`,`pattern`,`nickname`,`content`,`originContent`,`postId`,`authorId`,`commentId`)' +
                                'values '+
                                '("'+req.session.userId+'","'+r2[0].parentId+'","' + common.time() + '","1","3","'+req.session.nickname+'","","'+r2[0].content.substr(0,128)+'","'+r2[0].postId+'","'+req.session.userId+'","'+req.body.id+'")'
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