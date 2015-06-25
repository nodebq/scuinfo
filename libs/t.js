var request = require('request');
var config = require('../config.js');
var common= require('./common');
//var datas= require('../datas');
//
//var conn = require('../libs/mysql.js');
////
////request.post('http://localhost:4150/api/post?secret=0&content=sdfhsfdhst', function (error, response, body) {
////    if (!error && response.statusCode == 200) {
////        console.log('xxx')
////        console.log(body) // Show the HTML for the Google homepage.
////    }
////});
//
//
//conn.query(
//    {
//        sql:"insert into secret_tag (date,name) VALUES (111,'xxx'),(222,'yyy')"
//    },function(e,r){
//        console.log(e,r);
//    }
//)
//request.post('http://localhost:4150/api/comments/2/delete?token=1',function (error, response, body) {
//    if (!error && response.statusCode == 200) {
//       // console.log('xxx')
//        console.log(body) // Show the HTML for the Google homepage.
//    }})


//var a = [];
//console.log (typeof(a));
//if(a){
//    console.log('a==true');
//}
//if(a==true){
//    console.log('a==true');
//}else{
//    console.log('a!=true');
//}
//
//if(a==false){
//    console.log('a==false')
//}else{
//    console.log('a!=false');
//}
//if(a==null){
//    console.log('a==null')
//}else{
//    console.log('a!=null');
//}
//
//console.log('success');
//console.log('http://localhost:4150/api/posts');
//request({
//    method:"post",
//    url:'http://localhost:4150/api/like/comment',
//   json:true,
//    body:{
//        id:10
//    }
//},function(e,r){
//     console.log(e, r.body);
//});

//request({
//    method:"get",
//    url:"http://localhost:4150/api/posts",
//    json:true,
//    body:{
//        pageSize:15,
//        fromId:5
//    }
//},function(e,r){
//    console.log(e, r.body)
//})
//function random(min,max){
//    return Math.floor(min+Math.random()*(max-min));
//}
//
////
//////console.log(random(0,9));
//var b=[0.0,0,0,0,0,0,0,0,0];
//for (var i = 0;i<1000000000;i++){
//    switch(random(0,9)){
//        case(0):
//            b[0]++;
//            break;
//        case(1):
//            b[1]++;
//            break;
//        case(2):
//            b[2]++;
//            break;
//        case(3):
//            b[3]++;
//            break;
//        case(4):
//            b[4]++;
//            break;
//        case(5):
//            b[5]++;
//            break;
//        case(6):
//            b[6]++;
//            break;
//        case(7):
//            b[7]++;
//            break;
//        case(8):
//            b[8]++;
//            break;
//        case(9):
//            b[9]++;
//            break;
//    }
//}
//console.log(b);
//request({
//    method:"GET",
//    url:"http://localhost:4150/api/posts/3"
//
//},function(e,r){
//    console.log(e, r.body)
//})


//request({
//    method:"POST",
//    url:"http://localhost:4150/api/comments/2/delete?token=1",
//    json:true
////    body:{
////        userId:1,
////        secret:1,
////        parentId:"2",
////        content:"大帅哥杨国宝"
////    }
//},function(e,r){
//     console.log(e, r.body);
//})


//api.postsPost = function (req, res) {
//    if (req.body.tag) {
//
//
//        // console.log(req.body.tag);
//        var newTag = [];
//        for (var i = 0; i < req.body.tag.length; i++) {
//
//            if (!datas.tag[req.body.tag[i]]) {
//                newTag.push(req.body.tag[i]);
//            }
//        }
//    }
//    //console.log(newTag);
//    if (newTag.length > 0) {
//
//        var sqlll = 'insert into secret_tag (date,name) VALUE ("' + common.time() + '","' + newTag[0] + '")';
//        for (var i = 1; i < newTag.length; i++) {
//            sqlll += ',("' + common.time() + '","' + newTag[i] + '")';
//        }
//        conn.query(
//            {
//                sql: sqlll
//            }, function (err, rows) {
//                if (err) {
//                    console.log(err, sqlll);
//                    res.end(JSON.stringify(code.mysqlError));
//                    return;
//                }
//                conn.query(
//                    {
//                        sql: 'SELECT * FROM secret_user where id='+tokenName
//                    }, function (e, r) {
//
//                        //console.log(r);
//                        if (e) {
//                            console.log(e);
//                            res.end(JSON.stringify(code.mysqlError));
//                            return;
//                        }
//                        //console.log(r);
//                        if (req.body.secret) {
//                            conn.query(
//                                {
//                                    sql: 'insert into `secret_post` (secret,content,date,user,title,more,gender,nickname,avatar) VALUES (' + req.body.secret + ',"' + req.body.content + '",' + common.time() + ',"'+tokenName+'","' + req.body.title + '","' + req.body.more + '","' + r[0].gender + '","' + r[0].nickname + '","' + r[0].avatar + '")'
//                                }, function (ee, rr) {
//
//                                    if (ee) {
//                                        console.log(ee);
//                                        res.end(JSON.stringify(code.mysqlError));
//                                        return;
//                                    }
//                                    conn.query(
//                                        {
//                                            sql: 'insert into `secret_tag_relation`(`tagId`,`postId`,`date`) VALUE ("' + rows.insertId + '","' + rr.insertId + '","' + common.time() + '")'
//                                        }, function (eee, rrr) {
//                                            if (eee) {
//                                                console.log(ee);
//                                                res.end(JSON.stringify(code.mysqlError));
//                                                return;
//                                            }
//                                            res.end(common.format(200, "success", {id: rr.insertId}));
//                                        }
//                                    )
//                                }
//                            )
//                        } else {
//                            var afterAvatar = config.random(1, 49);//头像数目
//                            r[0].avatar = "../public/images/" + afterAvatar;
//                            r[0].nickname = "某同学";
//                            conn.query(
//                                {
//                                    sql: 'insert into `secret_post` (secret,content,date,user,title,more,gender,nickname,avatar) VALUES (' + req.body.secret + ',"' + req.body.content + '",' + common.time() + ',"'+tokenName+'","' + req.body.title + '","' + req.body.more + '","' + r[0].gender + '","' + r[0].nickname + '","' + r[0].avatar + '")'
//                                }, function (ee, rr) {
//
//                                    if (ee) {
//                                        console.log(ee);
//                                        res.end(JSON.stringify(code.mysqlError));
//                                        return;
//                                    }
//                                    conn.query(
//                                        {
//                                            sql: 'insert into `secret_tag_relation`(`tagId`,`postId`,`date`) VALUE ("' + rows.insertId + '","' + rr.insertId + '","' + common.time() + '")'
//                                        }, function (eee, rrr) {
//                                            if (eee) {
//                                                console.log(ee);
//                                                res.end(JSON.stringify(code.mysqlError));
//                                                return;
//                                            }
//                                            res.end(common.format(200, "success", {id: rr.insertId}));
//                                        }
//                                    )
//                                }
//                            )
//                        }
//                    }
//                )
//            }
//        )
//
//        //console.log('success');
//    } else {
//        conn.query(
//            {
//                sql: 'SELECT * FROM secret_user where id='+tokenName
//            }, function (e, r) {
//
//                if (e) {
//                    console.log(e);
//                    res.end(JSON.stringify(code.mysqlError));
//                    return;
//                }
//                if (req.body.secret) {
//                    conn.query(
//                        {
//                            sql: 'insert into `secret_post` (secret,content,date,user,title,more,gender,nickname,avatar) VALUES (' + req.body.secret + ',"' + req.body.content + '",' + common.time() + ',"'+tokenName+'","' + req.body.title + '","' + req.body.more + '","' + r[0].gender + '","' + r[0].nickname + '","' + r[0].avatar + '")'
//                        }, function (ee, rr) {
//                            console.log(r);
//                            if (ee) {
//                                console.log(ee);
//                                res.end(JSON.stringify(code.mysqlError));
//                                return;
//                            } else {
//                                res.end(common.format(200, "success", {id: rr.insertId}));
//                            }
//
//                        }
//                    )
//                } else {
//                    var afterAvatar = config.random(1, 49);//头像数目
//                    r[0].avatar = "../public/images/" + afterAvatar;
//                    r[0].nickname = "某同学";
//                    conn.query(
//                        {
//                            sql: 'insert into `secret_post` (secret,content,date,user,title,more,gender,nickname,avatar) VALUES (' + req.body.secret + ',"' + req.body.content + '",' + common.time() + ',"'+tokenName+'","' + req.body.title + '","' + req.body.more + '","' + r[0].gender + '","' + r[0].nickname + '","' + r[0].avatar + '")'
//                        }, function (ee, rr) {
//                            console.log(r);
//                            if (ee) {
//                                console.log(ee);
//                                res.end(JSON.stringify(code.mysqlError));
//                                return;
//                            } else {
//                                res.end(common.format(200, "success", {id: rr.insertId}));
//                            }
//
//                        }
//                    )
//                }
//            }
//        )
//    }
//    //console.log('success');

//};
//api.postsDel = function (req, res) {
//    //console.log('success in api');
//    //console.log(req.param('id'));
//    //console.log(req.param('token'))
//    conn.query({
//        sql: 'DELETE FROM `secret_post` WHERE id = ' + req.param('id')
//    }, function (err, rows) {
//        if (err) {
//            console.log(err);
//            res.end(JSON.stringify(code.mysqlError));
//            return;
//        }
//        res.end(common.format(200, "success", {}));
//    })
//};
//api.postsDetail = function (req, res) {
//    //console.log(req.query);return;
//    //req.query.id = 3;
//    datas = {};
//    //console.log(req.params.id);
//
//    conn.query(
//        {
//            sql: 'SELECT * FROM secret_post where id="' + req.params.id + '"'
//        }, function (e1, r1) {
//            if (e1) {
//                console.log(e1);
//                res.end(JSON.stringify(code.mysqlError));
//                return;
//            }
//            //console.log(r1);
//            conn.query(
//                {
//                    sql: 'select count("postId") from `secret_comment` where "postId" = "' + req.params.id + '"'
//                }, function (e2, r2) {
//                    if (e2) {
//                        console.log(e2);
//                        res.end(JSON.stringify(code.mysqlError));
//                        return;
//                    }
//                    //console.log(r2);
//                    conn.query(
//                        {
//                            sql: 'select count("postId") from `secret_post_like` where "postId" = "' + req.params.id + '"'
//                        }, function (e3, r3) {
//                            if (e1) {
//                                console.log(e3);
//                                res.end(JSON.stringify(code.mysqlError));
//                                return;
//                            }
//                            conn.query(
//                                {
//                                    sql: 'select * from secret_post_like where "postId" =' + req.params.id + ' '
//                                }, function (e4, r4) {
//                                    if (e4) {
//                                        console.log(e4);
//                                        res.end(JSON.stringify(code.mysqlError));
//                                        return;
//                                    }
//                                    if (r[4]) {
//                                        datas.like = 1;
//                                    } else {
//                                        datas.like = 0;
//                                    }
//                                    //console.log(r1[0]);
//                                    //console.log(r1[0].id);
//                                    datas.id = r1[0].id;
//
//                                    datas.content = r1[0].content;
//                                    datas.gender = r1[0].gender;
//                                    datas.secret = r1[0].secret
//                                    datas.avatar = r1[0].avatar;
//                                    datas.nickname = r1[0].nickname;
//                                    datas.commentCount = r2[0]['count("postId")'];
//                                    datas.likeCount = r2[0]['count("postId")'];
//                                    datas.date = r1[0].date;
//                                    //console.log(datas);
//                                    res.end(common.format(200, "success", datas));
//                                }
//                            )
//                        }
//                    )
//                }
//            )
//        }
//    )
//
//};
//api.commentPost = function (req, res) {
//    if(req.body.secret){
//        conn.query(
//            {
//                sql:'select nickname,avatar from secret_comment where id = '+tokenName
//            }, function (e1, r1) {
//                if(e1){
//                    console.log(e1);
//                    res.end(JSON.stringify(code.mysqlError))
//                    return;
//                }
//                conn.query(
//                    {
//                        sql: 'insert into `secret_comment` (`postId`,`parentId`,`secret`,`content`,`date`,`userId`,`nickname`,`avatar`) values("' + req.params.id + '","' + req.body.parentId + '","' + req.body.secret + '","' + req.body.content + '","' + common.time() + '","'+tokenName+'","'+r1[0].nickname+'","'+r1[0].avatar+'")'
//                    }, function (err, rows) {
//                        if (err) {
//                            console.log(err);
//                            res.end(JSON.stringify(code.mysqlError));
//                            return;
//                        } else {
//                            console.log(rows.insertId);
//                            res.end(common.format(200, "success", {id: rows.insertId}));
//
//                        }
//                    }
//                )
//            }
//        )
//    }else{
//        r1=[{}];
//        r1[0].nickname = "某同学";
//        var afterAvatar = config.random(1, 49);//头像数目
//        r[1].avatar = "../public/images/" + afterAvatar;
//        conn.query(
//            {
//                sql: 'insert into `secret_comment` (`postId`,`parentId`,`secret`,`content`,`date`,`userId`,`nickname`,`avatar`) values("' + req.params.id + '","' + req.body.parentId + '","' + req.body.secret + '","' + req.body.content + '","' + common.time() + '","'+tokenName+'","'+r1[0].nickname+'","'+r1[0].avatar+'")'
//            }, function (err, rows) {
//                if (err) {
//                    console.log(err);
//                    res.end(JSON.stringify(code.mysqlError));
//                    return;
//                } else {
//                    console.log(rows.insertId);
//                    res.end(common.format(200, "success", {id: rows.insertId}));
//
//                }
//            }
//        )
//    }
//};
//api.commentDel = function (req, res) {
//    //console.log('success in api');
//    //console.log(req.param('id'));
//    //console.log(req.param('token'))
//    //console.log( req.params.id);
//    conn.query({
//        sql: 'DELETE FROM `secret_comment` WHERE id = ' + req.params.id
//    }, function (err, rows) {
//        if (err) {
//            console.log(err);
//            res.end(JSON.stringify(code.mysqlError));
//            return;
//        }
//        res.end(common.format(200, "success", {}));
//    })
//};
//api.postsView = function (req, res) {
//    //console.log('success in api');
//    console.log(req.body);
//    console.log(req.query);
//    if (!req.query.pageSize) {
//        req.query.pageSize = 15
//    }
//    var sql;
//    if (!req.query.fromId) {
//        req.query.fromId = 1;
//        sql='SELECT * FROM secret_post order by date desc limit 0,' + req.query.pageSize;
//    }else{
//        sql='SELECT * FROM secret_post where id<' + req.query.fromId + ' order by date desc limit 0,' + req.query.pageSize;
//    }
//    conn.query(
//        {
//            sql: sql
//        }, function (err, rows) {
//            var data = [];
//
//            if (err) {
//                console.log(err);
//                res.end(JSON.stringify(code.mysqlError));
//                return;
//            }
//
//            async.each(rows, function (item, callback) {
//                    //
//                    var items = {};
//                    //console.log(item);
//                    conn.query(
//                        {
//                            sql: 'select count("postId") from `secret_comment` where "postId" = "' + item.id + '"'
//                        }, function (e1, r1) {
//                            //console.log('select count ("postId") from `secret_comment` where "postId" = "' + item.id + '"')
//
//                            if (e1) {
//                                console.log(e1);
//                                callback(code.mysqlError);
//                                return;
//                            }
//                            //console.log(conn.query.sql);
////                            console.log(r1[0]);
////                            console.log(r1[0]['count ("postId")']);
//                            conn.query(
//                                {//
//                                    sql: 'select count("postId") from `secret_post_like` where "postId" = "' + item.id + '"'
//                                }, function (e2, r2) {
//                                    if (e2) {
//                                        console.log(e2);
//                                        callback(code.mysqlError);
//                                        return;
//                                    }conn.query(
//                                        {
//                                            sql:'select userId from secret_post_like where postId ='+item.id
//                                        }
//                                    ),function(e3,r3){
//                                        if(e3){
//                                            console.log(e3);
//                                            callback(code.mysqlError);
//                                            return;
//                                        }
//                                        items.id = item.id;
//                                        items.title = item.title;
//                                        items.gender = item.gender;
//                                        items.secret = item.secret;
//                                        items.avatar = item.avatar;
//                                        items.nickname = item.nickname;
//                                        items.commentCount = r1[0]['count("postId")'];
//                                        //console.log(r1);
//                                        items.likeCount = r2[0]['count("postId")'];
//                                        if(r3[0].userId == tokenName){
//                                            items.like = 1
//                                        }else{
//                                            items.like = 0
//                                        }
//
//                                        items.date = item.date;
//                                        items.more = item.more;
//                                        data.push(items);
//                                        //console.log(data);
//                                        callback(null);
//                                    }
//
//
//                                }
//                            )
//                        }
//                    );
//
//
//                }, function (err) {
//                    if (err) {
//                        res.end(JSON.stringify(err));
//                        return;
//                    }
//                    function compare(value1,value2){
//                        if(value1.date < value2.date){
//                            return 1;
//                        }else if (value1.date >value2.date){
//                            return -1;
//                        }else{
//                            return 0;
//                        }
//                    }
//                    data.sort(compare);
//                    res.end(common.format(200, "success", data));
//                }
//            )
//        }
//    )
//};
//api.commentView = function (req, res) {
//    //console.log('success in api');
//    console.log(req.query);
//
//    if (!req.query.pageSize) {
//        req.query.pageSize = 15
//    }
//    if (!req.query.fromId) {
//        req.query.fromId = 1
//    }
//    conn.query(
//        {
//            sql: 'SELECT * FROM secret_comment where id<' + req.query.fromId + ' and postId = '+req.query.postId+' order by date desc limit 0,' + req.query.pageSize
//        }, function (err, rows) {
//            var data = [];
//
//            if (err) {
//                console.log(err);
//                res.end(JSON.stringify(code.mysqlError));
//                return;
//            }
//
//            async.each(rows, function (item, callback) {
//                    //
//                    var items = {};
//                    //console.log(item);
//                    conn.query(
//                        {
//                            sql: 'select postId from `secret_comment_like` where "commentId" = "' + item.id + '"'
//                        }, function (e1, r1) {
//                            //console.log('select count ("postId") from `secret_comment` where "postId" = "' + item.id + '"')
//
//                            if (e1) {
//                                console.log(e1);
//                                callback(code.mysqlError);
//                                return;
//                            }
//                            console.log(conn.query.sql);
//                            console.log(r1[0]);
//                            console.log(r1[0]['count ("postId")']);
//                            conn.query(
//                                {//
//                                    sql: 'select count("postId") from `secret_comment_like` where "commentId" = "' + item.id + '"'
//                                }, function (e2, r2) {
//                                    if (e2) {
//                                        console.log(e2);
//                                        callback(code.mysqlError);
//                                        return;
//                                    }
//                                    items.id = item.id;
//                                    items.parentId = item.parentId;
//                                    items.gender = item.gender;
//                                    items.secret = item.secret;
//                                    items.avatar = item.avatar;
//                                    items.nickname = item.nickname;
//                                    if(item.postId = tokenName){
//                                        items.isAuther = 1;
//                                    }else{
//                                        items.isAuther = 0;
//                                    }
//                                    items.postId = item.postId;
//                                    items.content = item.content;
//
//                                    if(r1[0].postId = tokenName){
//                                        items.like = 1;
//                                    }else{
//                                        items.like = 0;
//                                    }
//                                    items.likeCount = r2[0]['count("commmentId")'];
//                                    //console.log(r1);
//                                    // items.likeCount = r2[0]['count("postId")'];
//                                    items.date = item.date;
//                                    data.push(items);
//                                    //console.log(data);
//                                    callback(null);
//
//                                }
//                            )
//                        }
//                    );
//
//
//                }, function (err) {
//                    if (err) {
//                        res.end(JSON.stringify(err));
//                        return;
//                    }
//                    function compare(value1,value2){
//                        if(value1.date < value2.date){
//                            return 1;
//                        }else if (value1.date >value2.date){
//                            return -1;
//                        }else{
//                            return 0;
//                        }
//                    }
//                    data.sort(compare);
//                    res.end(common.format(200, "success", data));
//                }
//            )
//        }
//    )
//};

//datas.load();
//
//setTimeout(function(){
//   var week =  (common.todayStartTimestamp-datas.firstDay[datas.currentTerm.termId])/3600/24/7
//    console.log(week);
//},2000);

//var articles=[
//    {
//        title:"test",
//        description:"desc",
//        url:"http://baidu.com"
//    }
//]
//
//request.post(
//    {
//        url:config.urls.wechatSendNews,
//        json:true,
//        body:{
//            url:(config.site.url+"/u"),
//            articles:articles,
//            openId:'orJ8DjwvPDnWzhoVEVSc-T0Q60Fo'
//        }
//    },function(eee,rrr,bbb){
//        //console.log(eee);
//        if(eee){
//            console.log(eee);
//            //res.end(JSON.stringify(code.requestError));
//            return;
//        }
//        //console.log('222');
//console.log(bbb);
//        //res.end(bbb);
//        return;
//    }
//)


request.post(
    {
        url:"http://203.195.164.179:8120/api/updateCallback",
        form:{
            code:200,
            message:"成功",
            type:"exam",
            studentId:"2012141442029"
        }
    },function(e,r){
        console.log(e, r.body);
    }
)