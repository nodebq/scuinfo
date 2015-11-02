var check = require('../libs/check.js');
var common = require('../libs/common.js');
var code = require('../libs/code.js');
var async = require('async');
var conn = require('../libs/mysql.js');
var datas = require('../libs/datas.js');
//var tokenName = 1;
var tag = {

    name:"标签处理页"
};

tag.tag = function (req, res) {
    if (!req.query.pageSize) {
        req.query.pageSize = 15
    }

    var sql;
    var data = [];
    items = {};
    if (!req.query.fromId) {

        sql='SELECT * FROM secret_tag order by date desc limit 0,' + ":pageSize";
    }else{
        sql='SELECT * FROM secret_tag where id<' + ":fromId" + ' order by date desc limit 0,' + ":pageSize";
    }
    conn.query(
        {
            sql:sql,
            params:{
                fromId:parseInt(req.query.fromId),
                pageSize:parseInt(req.query.pageSize)
            }
        },function(err,rows){
            if(err){
                console.log(err);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            
            for(var i = 0;i<rows.length;i++){
                items.id = rows[i].id;
                items.name = rows[i].name;
                //console.log(items);
                data.push(items);
            }
            //return;
            res.end(common.format(200,"success",data));
        }
    )

};
tag.list= function (req, res) {
    //console.log('success in api');
    //console.log(req.body);

    if (!req.query.pageSize) {
        req.query.pageSize = 15
    }
    if(!req.query.name){
        res.end(JSON.stringify(code.lackParamsNickname))
        return;
    }else{
    var sql = '';
    var post_id;
    //console.log('select * from secret_tag where name = "'+req.query.name+'"');return;
    conn.query(
        {
            sql:'select * from secret_tag where name = "'+":name"+'"',
            params:{
                name:req.query.name
            }
        }, function (err, rows) {
            if(err){
                console.log(err);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            //console.log(rows);return;
            //if (rows.length>0){post_id = rows[0].id;}else{post_id = 1}
            if(rows.length>0){

                post_id = rows[0].id;

                if (!req.query.fromId) {
                    sql='select postId from secret_tag_relation where tagId = '+post_id+' order by date desc limit 0,' + ":pageSize";
                }else{
                    sql='select postId from secret_tag_relation where tagId = '+post_id+' and postId<' + ":fromId"+' order by date desc limit 0,' + ":pageSize";
                    //console.log(sql);return
                }
                conn.query(
                    {
                        sql:sql,
                        params:{
                            fromId:parseInt(req.query.fromId),
                            pageSize:parseInt(req.query.pageSize)
                        }
                    },function(eee,rrr){
                        if(eee){
                            console.log(eee);
                            res.end(JSON.stringify(code.mysqlError));
                            return;
                        }


                        if(rrr.length>0) {
                            var postId = [];
                            //console.log(rrr);
                            for (var i = 0; i < rrr.length; i++) {
                                postId[i] = rrr[i].postId;
                            }
                            var postid = postId.join(',');
//                        console.log('SELECT * FROM secret_post where id in('+postid+')');
//                        return;
//                            console.log('SELECT * FROM secret_post where id in(' + postid + ')');
                            conn.query(
                                {
                                    sql: 'SELECT * FROM secret_post where id in(' + postid + ')'
                                }, function (err, rows) {
                                    var data = [];
                                    if (err) {
                                        console.log(err);
                                        res.end(JSON.stringify(code.mysqlError));
                                        return;
                                    }
                                    //console.log(rows);return;
                                    async.each(rows, function (item, callback) {
                                            //
                                            var items = {};
                                            //console.log(item);
                                            conn.query(
                                                {
                                                    sql: 'select count("postId") from `secret_comment` where postId = ' + item.id
                                                }, function (e1, r1) {
                                                    //console.log('select count ("postId") from `secret_comment` where "postId" = "' + item.id + '"')

                                                    if (e1) {
                                                        //console.log('select count("postId") from `secret_comment` where postId = ' + item.id );return;
                                                        console.log(e1);
                                                        callback(code.mysqlError);
                                                        return;
                                                    }
                                                    //console.log(conn.query.sql);
//                            console.log(r1[0]);
//                            console.log(r1[0]['count ("postId")']);
                                                    conn.query(
                                                        {//
                                                            sql: 'select count("postId") from `secret_post_like` where postId = ' + item.id
                                                        }, function (e2, r2) {
                                                            if (e2) {
                                                                console.log(e2);
                                                                callback(code.mysqlError);
                                                                return;
                                                            }
                                                            conn.query(
                                                                {
                                                                    sql: 'select userId from secret_post_like where postId =' + item.id
                                                                }, function (e3, r3) {
                                                                    if (e3) {
                                                                        console.log(e3);
                                                                        callback(code.mysqlError);
                                                                        return;
                                                                    }
                                                                    items.id = item.id;
                                                                    if (item.secret) {
                                                                        items.userId = 0;
                                                                    } else {
                                                                        items.userId = item.userId;
                                                                    }

                                                                    items.level = req.session.level;
                                                                    items.title = item.title;
                                                                    items.gender = item.gender;
                                                                    items.secret = item.secret;
                                                                    items.avatar = item.avatar;
                                                                    items.nickname = item.nickname;
                                                                    items.commentCount = r1[0]['count("postId")'];
                                                                    //console.log(r1);
                                                                    items.likeCount = r2[0]['count("postId")'];
                                                                    items.author = (item.userId == req.session.userId) ? 1 : 0;
                                                                    if (r3.length > 0 && r3[0].userId == req.session.userId) {
                                                                        items.like = 1
                                                                    } else {
                                                                        items.like = 0
                                                                    }

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
                                            function compare(value1, value2) {
                                                if (value1.date < value2.date) {
                                                    return 1;
                                                } else if (value1.date > value2.date) {
                                                    return -1;
                                                } else {
                                                    return 0;
                                                }
                                            }

                                            data.sort(compare);
                                            res.end(common.format(200, "success", data));
                                        }
                                    )
                                }
                            )
                        }else{
                            res.end(common.format(200, "success", []));

                        }
                    }
                );
                //return;
                //console.log(sql);return;
            //console.log('SELECT * FROM secret_post where id in(select postId from secret_tag_relation where tagId = '+post_id+') order by date desc limit 0,' + req.query.pageSize);return;
            }else{
                res.end(common.format(200,"success",[]));
                return;
            }
        }
    );


}};
tag.like = function (req, res) {
    if(req.query.userId){
    //console.log('success in api');
    //console.log(req.body);
    //console.log(req.query);
    if (!req.query.pageSize) {
        req.query.pageSize = 15
    }
    var sql = '';

    if (!req.query.fromId) {

        sql='SELECT * FROM secret_post where id in(select postId from secret_post_like where userId = '+":userId"+') order by date desc limit 0,' + ":pageSize";
    }else{
        sql='SELECT * FROM secret_post where id<' + ":fromId" + ' and id in(select postId from secret_post_like where userId = '+":userId"+') order by date desc limit 0,' + ":pageSize";
    }
    //console.log(sql);return;
    conn.query(
        {
            sql: sql,
            params:{
                userId:parseInt(req.query.userId),
                fromId:parseInt(req.query.fromId),
                pageSize:parseInt(req.query.pageSize)
            }
        }, function (err, rows) {
            var data = [];

            if (err) {
                console.log(err);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            //console.log(rows);return;
            async.each(rows, function (item, callback) {
                    //
                    var items = {};
                    //console.log(item);
                    conn.query(
                        {
                            sql: 'select count("postId") from `secret_comment` where postId = ' + item.id
                        }, function (e1, r1) {
                            //console.log('select count ("postId") from `secret_comment` where "postId" = "' + item.id + '"')

                            if (e1) {
                                console.log(e1);
                                callback(code.mysqlError);
                                return;
                            }
                            //console.log(conn.query.sql);
//                            console.log(r1[0]);
//                            console.log(r1[0]['count ("postId")']);
                            conn.query(
                                {//
                                    sql: 'select count("postId") from `secret_post_like` where "postId" = "' + item.id + '"'
                                }, function (e2, r2) {
                                    if (e2) {
                                        console.log(e2);
                                        callback(code.mysqlError);
                                        return;
                                    }
                                    conn.query(
                                        {
                                            sql:'select * from secret_post_like where userId='+":userId"+' and postId ='+item.id,
                                            params:{
                                                userId:parseInt(req.query.userId)
                                            }
                                        },function(e3,r3){
                                            if(e3){
                                                console.log(e3);
                                                callback(code.mysqlError);
                                                return;
                                            }
                                            if(item.secret=1){
                                                items.userId=0;
                                            }else{
                                                items.userId=item.userId;
                                            }
                                            items.level = req.session.level;
                                            items.id = item.id;
                                            items.title = item.title;
                                            items.gender = item.gender;
                                            items.secret = item.secret;
                                            items.avatar = item.avatar;
                                            items.nickname = item.nickname;
                                            items.commentCount = r1[0]['count("postId")'];
                                            //console.log(r1);
                                            items.likeCount = r2[0]['count("postId")'];
                                            if(r3.length>0){
                                                items.like = 1
                                            }else{
                                                items.like = 0
                                            }

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
                            return 1;
                        }else if (value1.date >value2.date){
                            return -1;
                        }else{
                            return 0;
                        }
                    }
                    data.sort(compare);
                    res.end(common.format(200, "success", data));
                }
            )
        }
    )
    }else{
        //console.log('Hey Siri,where is userId?');
        res.end(JSON.stringify(code.paramError));
        return;
    }
};
tag.count=function(req,res){
    if(req.query.name){
        var data = {}
        var sql;

        //console.log('select * from secret_tag where name='+req.query.name);return;
               conn.query(
                   {
                       sql:'select * from secret_tag where name="'+":name"+'"',
                       params:{
                           name:req.query.name
                       }
                   }, function (ee, rr) {
                       if(ee){
                           console.log(ee);
                           res.end(JSON.stringify(code.mysqlError));
                           return;
                       }
                       //console.log('select * from secret_tag where name="'+req.query.name+'"');return;
                       if(rr.length>0){
                           if(req.query.start){
                               //有start
                               if(req.query.end){
                                   sql='select count("id") from `secret_tag_relation` where tagId ='+rr[0].id+' and date>'+":start"+' and date<'+":end"
                               }else{
                                   sql='select count("id") from `secret_tag_relation` where tagId ='+rr[0].id+' and date>'+":start"
                               }
                           }else{
                               //没有start
                               if(req.query.end){
                                   sql='select count("id") from `secret_tag_relation` where tagId ='+rr[0].id+' and date<'+":end"
                               }else{

                                   sql='select count("id") from `secret_tag_relation` where tagId ='+rr[0].id
                               }
                           }
                           //console.log(sql);return;
                           conn.query(
                               {
                                   sql:sql,
                                   params:{
                                       start:parseInt(req.query.start),
                                       end:parseInt(req.query.end)
                                   }
                               },function(e,r){

                                   if(e){
                                       console.log(e);
                                       res.end(JSON.stringify(code.mysqlError));
                                       return;
                                   }else{
                                       if(r.length>0){
                                           data.postsCount=r[0]['count("id")']
                                       }

                                       res.end(common.format(200,'success',data))
                                   }
                               }
                           )
                       }else{
                           data.postsCount=0;
                           res.end(common.format(200,'success',data))
                       }
                   }
               )
    }else{
        console.log('参数错误');
        res.end(JSON.stringify(code.paramError));
        return;
    }
};

module.exports = tag;