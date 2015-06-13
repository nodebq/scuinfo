var check = require('../libs/check.js');
var common = require('../libs/common.js');
var code = require('../libs/code.js');
var async = require('async');
var conn = require('../libs/mysql.js');
var datas = require('../libs/datas.js');

var request = require('request');
//var tokenName = 1;
var post = {

    name:"帖子处理页"
};


post.createWechat = function(req,res){
console.log(req.body);
    conn.query(
        {
            sql: 'select unionId,userId from secret_open where openId = "' + req.body.openId + '"'
        },
        function (e1, r1) {
            if (e1) {
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            //console.log(r1);return;
            if (r1.length > 0) {

                conn.query(
                    {
                        sql: "select * from secret_user_extend where userId = " + r1[0].userId
                    }, function (e2, r2) {
                        if (e2) {
                            res.end(JSON.stringify(code.mysqlError));
                            console.log(e2);
                            return;
                        }
                        //console.log(r2);return;
                        if (r2.length > 0) {
                            post.createArticle(
                                req, res, {
                                    content:req.body.content,
                                    secret:req.body.secret,
                                        avatar:r2[0].avatar,
                                        nickname:r2[0].nickname,
                                        userId:r2[0].userId,
                                        gender:r2[0].gender,
                                    date:common.time()


                                }
                            )
                            return;
                        } else {
                            res.end(JSON.stringify(code.noUserInfo));
                            return;
                        }

                    }
                );


                //toto后台去更新用户资料
            } else {


                request('https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + datas.wechat.accessToken + '&openid=' +req.body.openId + '&lang=zh_CN', function (e7, r7) {

                    if (e7) {
                        res.end(JSON.stringify(code.requestError));
                        console.log(e7);
                        return;
                    }
                    try {
                        var user = JSON.parse(r7.body);
                    } catch (e) {
                        var user = {
                            errcode: 20000
                        }
                    }


                    console.log('下面一条输出是userinfo');
                    console.log(user);
                    if (user.errcode) {
                        //没有拿到用户资料

                        res.end(JSON.stringify(code.notSubscribe));
                        return;

                    } else {

                        if (!user.subscribe) {

                            //没有拿到用户资料
                            res.end(JSON.stringify(code.notSubscribe));

                            return;
                        } else {


                            conn.query(
                                {
                                    sql: 'select userId from secret_open where unionId = "' + user.unionid + '"'
                                },
                                function (e5, r5) {
                                    if (e5) {
                                        res.end(JSON.stringify(code.mysqlError));
                                        return;
                                    }
                                    //console.log(r1);
                                    if (r5.length > 0) {


                                        conn.query(
                                            {
                                                sql: "insert into secret_open (userId,openId,unionId,source) values (" + r5[0].userId + ",'" + user.openid + "','" + user.unionid + "','wechat')"
                                            }, function (e6) {

                                                if (e6) {
                                                    res.end(JSON.stringify(code.mysqlError));
                                                    console.log(e6);
                                                    return;
                                                }
                                                conn.query(
                                                    {
                                                        sql: "select * from secret_user_extend where userId = " + r5[0].userId
                                                    }, function (e8, r8) {
                                                        if (e8) {
                                                            res.end(JSON.stringify(code.mysqlError));
                                                            console.log(e8);
                                                            return;
                                                        }
                                                        if (r8.length > 0) {

                                                            post.createArticle(
                                                                req, res, {


                                                                    content:req.body.content,
                                                                    secret:req.body.secret,
                                                                    avatar:r8[0].avatar,
                                                                    nickname:r8[0].nickname,
                                                                    userId:r8[0].userId,
                                                                    gender:r8[0].gender,
                                                                    date:common.time()



                                                                }
                                                            )
                                                        } else {
                                                            res.end(JSON.stringify(code.noUserInfo));
                                                            return;
                                                        }
                                                    });
                                            });

                                    } else {

                                        check.register({
                                            avatar: user.headimgurl,
                                            openId: user.openid,
                                            unionId: user.unionid,
                                            nickname: user.nickname,
                                            gender: user.sex,
                                            source:'wechatChat'
                                        },function(e9,r9){
                                            if(e9){
                                                res.end(JSON.stringify(e9));
                                                return;
                                            }
                                            conn.query(
                                                {
                                                    sql:"insert into secret_user (id,tel) values (null,'"+ r9.tel+"')"
                                                },function(ee1,rr1){
                                                    if(ee1){
                                                        console.log(ee1);
                                                        res.end(JSON.stringify(code.mysqlError));
                                                        return;
                                                    }
                                                    conn.query(
                                                        {
                                                            sql:"insert into secret_user_extend (userId,gender,nickname,avatar,date) values ("+rr1.insertId+","+r9.gender+",'"+ r9.nickname+"','"+ r9.avatar+"',"+ r9.date+")"
                                                        },function(eee){
                                                            if(eee){
                                                                console.log(eee);
                                                                res.end(JSON.stringify(code.mysqlError));
                                                                return;
                                                            }
                                                            //console.log("insert into secret_open (userId,openId,unionId,source) values ("+rr.insertId+",'"+ r.openId+"','"+ r.unionId+"','"+r.source+"')");
                                                            conn.query(
                                                                {
                                                                    sql:"insert into secret_open (userId,openId,unionId,source) values ("+rr1.insertId+",'"+ r9.openId+"','"+ r9.unionId+"','"+r9.source+"')"
                                                                },function(eeee,rrrr){
                                                                    if(eeee){
                                                                        console.log(eeee);
                                                                        res.end(JSON.stringify(code.mysqlError));
                                                                        return;
                                                                    }

                                                                    post.createArticle(
                                                                        req, res, {


                                                                            content:req.body.content,
                                                                            secret:req.body.secret,
                                                                            avatar:r9.avatar,
                                                                            nickname:r9.nickname,
                                                                            userId:r9.userId,
                                                                            gender:r9.gender,
                                                                            date:common.time()



                                                                        }
                                                                    );
                                                                }
                                                            );

                                                        }
                                                    )
                                                }
                                            )

                                        });



                                    }
                                });
                        }
                    }
                });

            }

        });

};


post.createArticle = function(req,res,data){
    check.postCreate({
        content:data.content,
        secret:data.secret,
        session:{
            avatar:data.avatar,
            nickname:data.nickname,
            userId:data.userId,
            userStatus:'login',
            gender:data.gender
        }
    },function(e,r) {

        if (e) {
            res.end(JSON.stringify(e));
            return;
        }

        conn.query(
            {
                sql: "insert into secret_post (title,content,secret,more,avatar,nickname,gender,userId,date) " +
                "values " +
                "(:title,:content,:secret,:more,:avatar,:nickname,:gender,:userId,:date)",
                params: {
                    title: r.title,
                    content: r.content,
                    secret: r.secret,
                    more: r.more,
                    avatar: r.avatar,
                    nickname: r.nickname,
                    gender: r.gender,
                    userId: r.userId,
                    date: r.date
                }
            }, function (ee, rr) {
                if (ee) {
                    console.log(ee);
                    res.end(JSON.stringify(code.mysqlError));
                    return;
                }
console.log('1');
                console.log(datas.tag);
                
                console.log('2');
                
                if (r.tags.length > 0) {
                    console.log(r.tags);
                    var newTags = [];
                    for (var i = 0; i < r.tags.length; i++) {
                        console.log(r[i]);
                        
                        console.log('3');
                        console.log(datas.tag);
                        if (!datas.tag[r.tags[i]]) {
                            newTags.push(r.tags[i]);
                        }
                    }
                    //console.log(newTags);

                    if (newTags.length > 0) {

                        var tagSql = 'insert into secret_tag (date,name,userId) VALUE ';
                        var tagValues = [];
                        for (var i = 0; i < newTags.length; i++) {
                            tagValues[i]= '(' + common.time() + ',"' + newTags[i] + '",' + r.userId + ')';
                        }
                        //console.log(tagSql,tagValues.join(','));
                        conn.query(
                            {
                                sql: tagSql + tagValues.join(',')
                            }, function (err) {
                                if (err) {
                                    console.log(err, tagSql);
                                    res.end(JSON.stringify(code.mysqlError));
                                    return;
                                }
                                datas.updateTag(function (eeeeeee) {
                                    if (eeeeeee) {
                                        res.end(JSON.stringify(eeeeeee));
                                        return;
                                    }
                                    var tagRelationValues = [];
                                    for (var i = 0; i < r.tags.length; i++) {
                                        tagRelationValues[i] = '(' + common.time() + ',' + datas.tag[r.tags[i]] + ',' + rr.insertId + ')';
                                    }
                                    conn.query(
                                        {
                                            sql: "insert into secret_tag_relation (date,tagId,postId) values " + tagRelationValues.join(',')
                                        }, function (eeee) {
                                            if (eeee) {
                                                res.end(JSON.stringify(code.mysqlError));
                                                console.log(eeee);
                                                return;
                                            }
                                            res.end(common.format(200, 'success', {
                                                insertId: rr.insertId
                                            }));
                                            return;
                                        });


                                });
                            });
                    } else {
                        var tagRelationValues = [];
                        for (var i = 0; i < r.tags.length; i++) {
                            tagRelationValues[i] = '(' + common.time() + ',"' + datas.tag[r.tags[i]] + '",' + rr.insertId + ')';
                        }
                        conn.query(
                            {
                                sql: "insert into secret_tag_relation (date,tagId,postId) values " + tagRelationValues.join(',')
                            }, function (eeee) {
                                if (eeee) {
                                    res.end(JSON.stringify(code.mysqlError));
                                    console.log(eeee);
                                    return;
                                }
                                res.end(common.format(200, 'success', {
                                    insertId: rr.insertId
                                }));
                                return;
                            });


                    }

                } else {

                    res.end(common.format(200, 'success', {
                        insertId: rr.insertId
                    }));
                    return;

                }


            });
    });



};
post.createMove = function(req,res){
//console.log(req.body);
    check.postCreate({
        content:req.body.content,
        secret:req.body.secret,
        session:{
            avatar:req.body.avatar,
            nickname:req.body.nickname,
            userId:req.body.userId,
            userStatus:'login',
            gender:req.body.gender
        }
    },function(e,r) {

        if (e) {
            res.end(JSON.stringify(e));
            return;
        }
        conn.query(
            {
                sql: "insert into secret_post (title,content,secret,more,avatar,nickname,gender,userId,date) " +
                "values " +
                "(:title,:content,:secret,:more,:avatar,:nickname,:gender,:userId,:date)",
                params: {
                    title: r.title,
                    content: r.content,
                    secret: r.secret,
                    more: r.more,
                    avatar: r.avatar,
                    nickname: r.nickname,
                    gender: r.gender,
                    userId: r.userId,
                    date: req.body.date
                }
            }, function (ee, rr) {
                if (ee) {
                    console.log(ee);
                    res.end(JSON.stringify(code.mysqlError));
                    return;
                }

                //console.log(datas.tag);
                if (r.tags.length > 0) {
                    //console.log(r.tags);
                    var newTags = [];
                    for (var i = 0; i < r.tags.length; i++) {
                        //console.log(r);return;
                        if (!datas.tag[r.tags[i]]) {
                            newTags.push(r.tags[i]);
                        }
                    }
                    //console.log(newTags);

                    if (newTags.length > 0) {

                        var tagSql = 'insert into secret_tag (date,name,userId) VALUE ';
                        var tagValues = [];
                        for (var i = 0; i < newTags.length; i++) {
                            tagValues[i]= '(' + common.time() + ',"' + newTags[i] + '",' + r.userId + ')';
                        }
                        //console.log(tagSql,tagValues.join(','));
                        conn.query(
                            {
                                sql: tagSql + tagValues.join(',')
                            }, function (err) {
                                if (err) {
                                    console.log(err, tagSql);
                                    res.end(JSON.stringify(code.mysqlError));
                                    return;
                                }
                                datas.updateTag(function (eeeeeee) {
                                    if (eeeeeee) {
                                        res.end(JSON.stringify(eeeeeee));
                                        return;
                                    }
                                    var tagRelationValues = [];
                                    for (var i = 0; i < r.tags.length; i++) {
                                        tagRelationValues[i] = '(' + common.time() + ',' + datas.tag[r.tags[i]] + ',' + rr.insertId + ')';
                                    }
                                    conn.query(
                                        {
                                            sql: "insert into secret_tag_relation (date,tagId,postId) values " + tagRelationValues.join(',')
                                        }, function (eeee) {
                                            if (eeee) {
                                                res.end(JSON.stringify(code.mysqlError));
                                                console.log(eeee);
                                                return;
                                            }
                                            res.end(common.format(200, 'success', {
                                                insertId: rr.insertId
                                            }));
                                            return;
                                        });


                                });
                            });
                    } else {
                        var tagRelationValues = [];
                        for (var i = 0; i < r.tags.length; i++) {
                            tagRelationValues[i] = '(' + common.time() + ',"' + datas.tag[r.tags[i]] + '",' + rr.insertId + ')';
                        }
                        conn.query(
                            {
                                sql: "insert into secret_tag_relation (date,tagId,postId) values " + tagRelationValues.join(',')
                            }, function (eeee) {
                                if (eeee) {
                                    res.end(JSON.stringify(code.mysqlError));
                                    console.log(eeee);
                                    return;
                                }
                                res.end(common.format(200, 'success', {
                                    insertId: rr.insertId
                                }));
                                return;
                            });


                    }

                } else {

                    res.end(common.format(200, 'success', {
                        insertId: rr.insertId
                    }));
                    return;

                }


            });
    });

};
post.create = function(req,res){
//console.log(req.body);
    check.postCreate({
        content:req.body.content,
        secret:req.body.secret,
        session:req.session
    },function(e,r) {

        if (e) {
            res.end(JSON.stringify(e));
            return;
        }
        conn.query(
            {
                sql: "insert into secret_post (title,content,secret,more,avatar,nickname,gender,userId,date) " +
                "values " +
                "(:title,:content,:secret,:more,:avatar,:nickname,:gender,:userId,:date)",
                params: {
                    title: r.title,
                    content: r.content,
                    secret: r.secret,
                    more: r.more,
                    avatar: r.avatar,
                    nickname: r.nickname,
                    gender: r.gender,
                    userId: r.userId,
                    date: r.date
                }
            }, function (ee, rr) {
                if (ee) {
                    console.log(ee);
                    res.end(JSON.stringify(code.mysqlError));
                    return;
                }
console.log('1');
                console.log(datas.tag);
                
                console.log('22');
                if (r.tags.length > 0) {
                    var newTags = [];
                    for (var i = 0; i < r.tags.length; i++) {
                        //console.log(r);return;
                        console.log(r.tags[i]);
console.log('3');
                        
                        console.log("是否有:"+datas.tag[r.tags[i]]);


                        if (!datas.tag[r.tags[i]]) {

                            console.log(newTags);

                            newTags.push(r.tags[i]);
                        }
                    }
                    //console.log(newTags);

                    if (newTags.length > 0) {

                        var tagSql = 'insert into secret_tag (date,name,userId) values ';
                        var tagValues = [];
                        for (var i = 0; i < newTags.length; i++) {
                            tagValues[i]= '(' + common.time() + ',"' + newTags[i] + '",' + r.userId + ')';
                        }
                        //console.log(tagSql,tagValues.join(','));
                        conn.query(
                            {
                                sql: tagSql + tagValues.join(',')
                            }, function (err) {
                                if (err) {
                                    console.log(err, tagSql);
                                    res.end(JSON.stringify(code.mysqlError));
                                    return;
                                }
                                datas.updateTag(function (eeeeeee) {
                                    if (eeeeeee) {
                                        res.end(JSON.stringify(eeeeeee));
                                        return;
                                    }
                                    var tagRelationValues = [];
                                    for (var i = 0; i < r.tags.length; i++) {
                                        tagRelationValues[i] = '(' + common.time() + ',' + datas.tag[r.tags[i]] + ',' + rr.insertId + ')';
                                    }
                                    console.log("insert into secret_tag_relation (date,tagId,postId) values " + tagRelationValues.join(','));
                                    conn.query(
                                        {
                                            sql: "insert into secret_tag_relation (date,tagId,postId) values " + tagRelationValues.join(',')
                                        }, function (eeee) {
                                            if (eeee) {
                                                res.end(JSON.stringify(code.mysqlError));
                                                console.log(eeee);
                                                return;
                                            }
                                            res.end(common.format(200, 'success', {
                                                insertId: rr.insertId
                                            }));
                                            return;
                                        });


                                });
                            });
                    } else {
                        var tagRelationValues = [];
                        for (var i = 0; i < r.tags.length; i++) {
                            tagRelationValues[i] = '(' + common.time() + ',"' + datas.tag[r.tags[i]] + '",' + rr.insertId + ')';
                        }
                        
                        console.log("insert into secret_tag_relation (date,tagId,postId) values " + tagRelationValues.join(','));
                        conn.query(
                            {
                                sql: "insert into secret_tag_relation (date,tagId,postId) values " + tagRelationValues.join(',')
                            }, function (eeee) {
                                if (eeee) {
                                    res.end(JSON.stringify(code.mysqlError));
                                    console.log(eeee);
                                    return;
                                }
                                res.end(common.format(200, 'success', {
                                    insertId: rr.insertId
                                }));
                                return;
                            });


                    }

                } else {

                    res.end(common.format(200, 'success', {
                        insertId: rr.insertId
                    }));
                    return;

                }


            });
    });



};
post.postsDel = function (req, res) {
    //console.log('success in api');
    //console.log(req.param('id'));
    //console.log(req.param('token'))
    //console.log(req.body.id);
    if(req.body.id){
        conn.query(
            {
                sql:'select userId from secret_post where id='+req.body.id
            },function(e,r){
                if(e){
                    console.log(e);
                    res.end(JSON.stringify(code.mysqlError));
                    return;
                }
                if(r.length>0&&r[0].userId==req.session.userId){
                    conn.query({

                        sql: 'DELETE FROM `secret_post` WHERE id = ' + req.body.id
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
                        sql: 'DELETE FROM `secret_post` WHERE id = ' + req.body.id
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
post.postsDetail = function (req, res) {
    //console.log(req.query);return;
    //req.query.id = 3;
    var data = {};

    if(!req.query.id){
        res.end(JSON.stringify(code.lackParamsPostId));
        return;
    }else{

    conn.query(
        {
            sql: 'SELECT * FROM secret_post where id='+ req.query.id
        }, function (e1, r1) {
            if (e1) {
                console.log(e1);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            //console.log(r1);return;
            if(r1.length>0) {
                //console.log(r1);
                conn.query(
                    {
                        sql: 'select count("postId") from `secret_comment` where postId = "' + req.query.id + '"'
                    }, function (e2, r2) {
                        if (e2) {
                            console.log(e2);
                            res.end(JSON.stringify(code.mysqlError));
                            return;
                        }
                        //console.log(r2);return;
                        conn.query(
                            {
                                sql: 'select count("postId") from `secret_post_like` where postId = "' + req.query.id + '"'
                            }, function (e3, r3) {
                                if (e3) {
                                    console.log(e3);
                                    res.end(JSON.stringify(code.mysqlError));
                                    return;
                                }
                                //console.log(r3);return;
                                if(req.session.userId){
                                conn.query(
                                    {
                                        sql: 'select * from secret_post_like where postId =' + req.query.id + ' and userId= '+req.session.userId
                                    }, function (e4, r4) {
                                        if (e4) {
                                            console.log(e4);
                                            res.end(JSON.stringify(code.mysqlError));
                                            return;
                                        }
                                        //console.log(r4);return;
                                        if (r4.length>0) {
                                            data.like = 1;
                                        } else {
                                            data.like = 0;
                                        }
                                        data.id = r1[0].id;
                                        data.title = r1[0].title;
                                        data.content = r1[0].content;
                                        data.gender = r1[0].gender;
                                        data.secret = r1[0].secret;
                                        data.avatar = r1[0].avatar;
                                        data.title = r1[0].title;
                                        data.nickname = r1[0].nickname;
                                        data.author = (r1.length>0&&r1[0].userId == req.session.userId) ? 1 : 0;
                                        data.userId = data.secret ? 0 : r1[0].userId;
                                        data.commentCount = r2[0]['count("postId")'];
                                        data.likeCount = r3[0]['count("postId")'];
                                        data.date = r1[0].date;
                                        data.level = req.session.level;

                                        //console.log(data);
                                        res.end(common.format(200, "success", data));
                                    }
                                )}else{
                                    data.like = 0;
                                    data.id = r1[0].id;
                                    data.title = r1[0].title;
                                    data.content = r1[0].content;
                                    data.gender = r1[0].gender;
                                    data.secret = r1[0].secret;
                                    data.avatar = r1[0].avatar;
                                    data.title = r1[0].title;
                                    data.nickname = r1[0].nickname;
                                    data.author = (r1.length>0&&r1[0].userId == req.session.userId) ? 1 : 0;
                                    data.userId = data.secret ? 0 : r1[0].userId;
                                    data.commentCount = r2[0]['count("postId")'];
                                    data.likeCount = r3[0]['count("postId")'];
                                    data.date = r1[0].date;

                                    //console.log(data);
                                    res.end(common.format(200, "success", data));
                                }
                            }
                        )
                    }
                )
            }else{
                res.end(common.format(200,"",[]));
            }
        }
    )
    }
};
post.postsView = function (req, res) {
    //console.log('success in api');
    //console.log(req.body);
    //console.log(req.query);
    if (!req.query.pageSize) {
        req.query.pageSize = 15
    }
    var sql;
    if(!req.query.userId){
            if (!req.query.fromId) {

                sql= 'select * from(SELECT * FROM secret_post order by date desc limit 0,'+ req.query.pageSize+') t1 union select * from secret_post where top=1'
            }else{
                sql='SELECT * FROM secret_post where id<' + req.query.fromId + ' order by date desc limit 0,' + req.query.pageSize;
            }
    }else {
        if (req.query.userId == req.session.userId) {
            if (!req.query.fromId) {
                sql= 'select * from(SELECT * FROM secret_post where userId = ' + req.query.userId + ' order by date desc limit 0,'+ req.query.pageSize+') t1 union select * from secret_post where top=1'

            } else {
                sql = 'SELECT * FROM secret_post where id<' + req.query.fromId + ' and userId = ' + req.query.userId + ' order by date desc limit 0,' + req.query.pageSize;
            }
        } else {
            if (!req.query.fromId) {
                sql= 'select * from(SELECT * FROM secret_post where userId = ' + req.query.userId + ' and secret=0 order by date desc limit 0,'+ req.query.pageSize+') t1 union select * from secret_post where top=1'

            } else {
                sql = 'SELECT * FROM secret_post where userId='+req.query.userId+' and secret=0 and id<' + req.query.fromId + ' order by date desc limit 0,' + req.query.pageSize;
            }
        }
    }
    //console.log(sql);return;
    //console.log('SELECT * FROM secret_post where userId = ' + req.query.userId + ' order by date desc limit 0,' + req.query.pageSize);return;
console.log(sql);
    conn.query(
        {
            sql: sql
        }, function (err, rows) {
            var data = [];

            if (err) {
                console.log(err);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }

            async.each(rows, function (item, callback) {
                    conn.query(
                        {
                            sql: 'select count("postId") from `secret_comment` where postId = ' + item.id
                        }, function (e1, r1) {
                            if (e1) {
                                console.log(e1);
                                callback(code.mysqlError);
                                return;
                            }
                            conn.query(
                                {//
                                    sql: 'select count("postId") from `secret_post_like` where postId = ' + item.id + ''
                                }, function (e2, r2) {
                                    if (e2) {
                                        console.log(e2);
                                        callback(code.mysqlError);
                                        return;
                                    }
                                  //  console.log(r2);
                                    conn.query(
                                        {
                                            sql:'select userId from secret_post_like where postId ='+item.id
                                        },function(e3,r3){
                                            if(e3){
                                                console.log(e3);
                                                callback(code.mysqlError);
                                                return;
                                            }
                                            var items = {};
                                            items.id = item.id;
                                            items.title = item.title;
                                            items.gender = item.gender;
                                            items.secret = item.secret;
                                            items.avatar = item.avatar;
                                            items.nickname = item.nickname;
                                            //console.log(r1[0]['count("postId")']);return;
                                            items.commentCount = r1[0]['count("postId")'];
                                            //console.log(r1);
                                            items.author = (item.userId==req.session.userId)?1:0;
                                            items.userId = (item.secret)?0:item.userId;
                                            items.likeCount = r2[0]['count("postId")'];
                                            items.top = item.top;
                                            if(r3.length>0 && r3[0].userId == req.session.userId){
                                                items.like = 1
                                            }else{
                                                items.like = 0
                                            }
                                            items.level = req.session.level;
                                            items.date = item.date;
                                            items.more = item.more;
                                            data.push(items);
                                            //console.log(data);
                                            callback(null);
                                        }
                                    )
                                }
                            )
                        }
                    );
                }, function (err) {
                    if (err) {
                        res.end(JSON.stringify(err));
                        return;
                    }
                    function compare(value1,value2){
                        if(value1.date < value2.date){
                            if(value1.top<=value2.top){
                                return 1
                            }else{
                                return -1
                            }


                        }else if (value1.date >value2.date) {
                            if(value1.top>=value2.top){
                                return -1
                            }else{
                                return 1
                            }


                        }
                    }
                    data.sort(compare);
                    res.end(common.format(200, "success", data));
                }
            )
        }
    )
};
post.change = function(req,res){
    if(req.body.id){
        conn.query(
            {
                sql:'select userId from secret_post where id='+req.body.id
            },function(e,r){
                if(e){
                    console.log(e);
                    res.end(JSON.stringify(code.mysqlError));
                    return;
                }
                if(r.length>0&&r[0].userId==req.session.userId){
                    conn.query(
                        {
                            sql:'select * from secret_post where id = '+req.body.id
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
                                            sql:'UPDATE secret_post SET secret=1,nickname="'+r2[0].nickname+'",avatar="'+r2[0].avatar+'" WHERE id='+req.body.id
                                        },function(e3,r3){
                                            if(e3){
                                                console.log(e3);
                                                res.end(JSON.stringify(code.mysqlError));
                                                return;
                                            }conn.query(
                                                {
                                                    sql:'UPDATE secret_comment SET secret =1 ,nickname="'+r2[0].nickname+'",avatar="'+r2[0].avatar +'"WHERE postId='+req.body.id+' and userId='+r1[0].userId
                                                },function(e4,r4){
                                                    if(r4){
                                                        console.log(e4);
                                                        res.end(JSON.stringify(code.mysqlError));
                                                        return
                                                    }else{
                                                        res.end(common.format(200, "success", {}));
                                                    }
                                                }
                                            )
                                        }
                                    )
                                }
                            )
                        }
                    )
                }else{
                    console.log('小样,你还想改别人的帖子?');
                    res.end(JSON.stringify(code.loginError));
                    return;
                }
            }
        )
    }else{
        console.log('ID都不给我,改个鬼');
        res.end(JSON.stringify(code.loginError));
        return
    }



};



module.exports = post;