var check = require('../libs/check.js');
var libs = require('../libs/libs.js');
var common = require('../libs/common.js');
var code = require('../libs/code.js');
var async = require('async');
var conn = require('../libs/mysql.js');
var datas = require('../libs/datas.js');
var comment = {

    name:"评论处理页"
};
comment.commentPost = function (req, res) {

//console.log(req.body);
    if(!req.body.postId){
        res.end(JSON.stringify(code.lackParamsPostId));
        return;
    }

    if(!req.body.content){
        res.end(JSON.stringify(code.lackParamsContent));
        return;
    }

    if(!req.body.parentId){
        req.body.parentId = 0;
    }


                conn.query(
                    {
                        sql: 'insert into `secret_comment` (`postId`,`parentId`,`secret`,`content`,`date`,`userId`,`nickname`,`avatar`,`gender`) values("' + ':postId' + '","' + ':parentId' + '","' + 0 + ',' + ":content" + ',' + common.time() + '","'+req.session.userId+'","'+req.session.nickname+'","'+req.session.avatar+'","'+req.session.gender+'")',
                        params:{
                            postId:parseInt(req.body.postId),
                            parentId:parseInt(req.body.parentId),
                            content:req.body.content
                        }

                    }, function (err, rows) {
                        if (err) {
                            console.log(err);
                            res.end(JSON.stringify(code.mysqlError));
                            return;
                        } else {
                            conn.query(
                                {
                                    sql: 'select count("postId") from `secret_comment` where postId = ' + ":postId" + '',
                                    params:{
                                        postId:parseInt(req.body.postId)
                                    }
                                }, function (e1, r1) {
                                    if (e1) {
                                        console.log(e1);
                                        callback(code.mysqlError);
                                        return;
                                    }
                                    //console.log(r1);

                                    //console.log(rows.insertId);
                                    //console.log(req.body);
                                    res.end(common.format(200, "success", {id: rows.insertId,commentCount:r1[0]['count("postId")'],avatar:req.session.avatar,nickname:req.session.nickname}));
                                    if(req.body.parentId){
                                        var pattern = 4;
                                        var sql = 'select * from secret_comment where id='+":parentId"
                                    }else{
                                        var pattern = 2;
                                        var sql = 'select * from secret_post where id='+":postId"
                                    }
                                    //console.log(sql);
                                    conn.query(
                                        {
                                            sql:sql,
                                            params:{
                                                postId:parseInt(req.body.postId),
                                                parentId:parseInt(req.body.parentId)
                                            }
                                        }, function (e2, r2) {
                                            if(e2||!r2.length){
                                                console.log(e2);
                                                console.log('没有此评论/帖子');
                                                return;
                                            }
                                            //console.log(r2);return;
                                            conn.query(
                                                {
                                                    sql:'insert into `secret_notice` (`userId`,`parentCommentId`,`date`,`status`,`pattern`,`nickname`,`content`,`originContent`,`postId`,`authorId`,`commentId`)' +
                                                        'values '+
                                                        '("'+req.session.userId+'","'+':parentId'+'","' + common.time() + '","1","'+pattern+'","'+req.session.nickname+'","'+req.body.content.substr(0,128)+'","'+r2[0].content.substr(0,128)+'","'+':postId'+'","'+r2[0].userId+'","'+rows.insertId+'")',
                                                    params:{
                                                        postId:parseInt(req.body.postId),
                                                        parentId:parseInt(req.body.parentId)
                                                    }
                                                }, function (e2, r2) {
                                                    if(e2){
                                                        console.log(e2);
                                                        //console.log('未能成功建立通知');
                                                        return;
                                                    }
                                                }
                                            )
                                        }
                                    )
                                });

                        }
                    }
                );

};
comment.commentView = function (req, res) {
    //console.log('success in api');
    //console.log(req.query);

    if (!req.query.pageSize) {
        req.query.pageSize = 15
    }
    var sql;
    if (!req.query.fromId) {

        sql='SELECT * FROM secret_comment where postId = '+":postId"+' limit 0,' + ":pageSize"
    }else{
        sql='SELECT * FROM secret_comment where id>' + ":fromId" + ' and postId = '+":postId"+' limit 0,' + ":pageSize";
    }

    conn.query(
        {
            sql:sql,
            params:{
                fromId:parseInt(req.query.fromId),
                postId:parseInt(req.query.postId),
                pageSize:parseInt(req.query.pageSize)
            }
        }, function (err, rows) {
            var data = [];

            if (err) {
                console.log(err);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            //console.log('select userId from secret_post where id='+req.query.postId);return;
            //console.log(rows);return;
            async.each(rows, function (item, callback) {
                    //
                    var items = {};
                    //console.log(item);



                        conn.query(
                            {
                                sql: 'select userId from `secret_comment_like` where commentId = ' + item.id
                            }, function (e1, r1) {
                                //console.log('select count ("postId") from `secret_comment` where "postId" = "' + item.id + '"')

                                if (e1) {
                                    console.log(e1);
                                    callback(code.mysqlError);
                                    return;
                                }

                                items.id = item.id;
                                items.parentId = item.parentId;
                                items.gender = item.gender;
                                items.secret = item.secret;
                                items.avatar = item.avatar;
                                items.nickname = item.nickname;
                                //console.log(item.userId);return;
                                items.level = req.session.level;
                                if (item.userId == req.session.userId) {
                                    items.author = 1;
                                    items.userId=item.userId;
                                } else {
                                    items.author = 0;
                                    items.userId=item.userId;
                                }

                                items.content = item.content;

                                var like=0;


                                if(r1.length>0 && req.session.userId ){


                                    for(var i=0;i<r1.length;i++){
                                        if(r1[i].userId==req.session.userId){
                                            like=1;
                                        }
                                    }

                                }

                                items.like=like;
                                items.likeCount=r1.length;
                                //console.log(r1);
                                items.date = item.date;
                                //console.log(items);
                                data.push(items);
                                //console.log(data);
                                callback(null);



                            }
                        );




                }, function (err) {
                    if (err) {
                        res.end(JSON.stringify(err));
                        return;
                    }
                    function compare(value1,value2){
                        if(value1.id > value2.id){
                            return 1;
                        }else if (value1.id <value2.id){
                            return -1;
                        }else{
                            return 0;
                        }
                    }
                    data.sort(compare);
                    res.end(common.format(200, "success", data));
                }
            );
        });
};
comment.commentDel = function (req, res) {
    //console.log('success in api');
    //console.log(req.param('id'));
    //console.log(req.param('token'))
    //console.log(req.body.id);
    if(req.body.id){
        conn.query(
            {
                sql:'select userId from secret_comment where id='+":id",
                params:{
                    id:parseInt(req.body.id)
                }
            },function(e,r){
                if(e){
                    console.log(e);
                    res.end(JSON.stringify(code.mysqlError));
                    return;
                }
                if(r.length>0&&r[0].userId==req.session.userId){
                    conn.query({
                        sql: 'DELETE FROM `secret_comment` WHERE id = ' + ":id",
                        params:{
                            id:parseInt(req.body.id)
                        }
                    }, function (err, rows) {

                        if (err) {
                            console.log(err);
                            res.end(JSON.stringify(code.mysqlError));
                            return;
                        }
                        res.end(common.format(200, "success", {}));
                    })
                }else if(req.session.level = 1){
                    conn.query({
                        sql: 'DELETE FROM `secret_comment` WHERE id = ' + ":id",
                        params:{
                            id:parseInt(req.body.id)
                        }
                    }, function (err, rows) {

                        if (err) {
                            console.log(err);
                            res.end(JSON.stringify(code.mysqlError));
                            return;
                        }
                        res.end(common.format(200, "success", {}));
                    })
                }else{
                    console.log('小样,你还想删别人的帖子?');
                    res.end(JSON.stringify(code.loginError));
                    return;
                }
            }
        )
    }else{
        console.log('ID都没有,删个鬼');
        res.end(JSON.stringify(code.paramError));
        return;
    }
};

//todo 删除的时候通知的处理?
comment.change = function(req,res){

    conn.query(
        {
            sql:'select * from secret_comment where id = '+":id",
            params:{
                id:parseInt(req.body.id)
            }
        },function(e1,r1){
            if(e1){
                console.log(e1);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            conn.query(
                {
                    sql:'select * from secret_user where id = '+r1[0].userId
                },function(e2,r2){
                    if(e2){
                        console.log(e2);
                        res.end(JSON.stringify(code.mysqlError));
                        return;
                    }conn.query(
                        {
                            sql:'UPDATE secret_comment SET secret =1 ,nickname="'+r2[0].nickname+'",avatar="'+r2[0].avatar +'"WHERE postId='+r1[0].postId+' and userId='+r1[0].userId
                        },function(e4,r4){
                            if(r4){
                                console.log(e4);
                                res.end(JSON.stringify(code.mysqlError));
                                return;
                            }else{
                                res.end(common.format(200, "success", {}));
                            }
                        }
                    )
                }
            )
        }
    )

};
module.exports = comment;