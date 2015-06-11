var check = require('../libs/check.js');
var common = require('../libs/common.js');
var code = require('../libs/code.js');
var async = require('async');
var conn = require('../libs/mysql.js');
var datas = require('../libs/datas.js');
//var tokenName = 1;
var notice = {

    name:"通知处理页"
};

notice.count = function (req,res) {
    //console.log('xxx');
    if(req.session.userId){
    if(!req.query.type){
        req.query.type = 'all';
    }
    var data={};
    //console.log(sql, fff);return;
    conn.query(
        {
            sql:'select count("id") from `secret_notice` where status=1 and pattern in (1,3) and userId ='+req.session.userId
        },function(e,r){
            if(e){
                console.log(e);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }conn.query(
                {
                    sql:'select count("id") from `secret_notice` where status=1 and pattern in(2,4) and userId ='+req.session.userId
                },function(ee,rr){
                    if(e){
                        console.log(e);
                        res.end(JSON.stringify(code.mysqlError));
                        return;
                    }
                    data.likeCount = r[0]['count("id")'];
                    data.replyCount = rr[0]['count("id")'];
                    data.count = r[0]['count("id")'] + rr[0]['count("id")'];
                    res.end(common.format(200,"success",data));
                }
            );

        }
    )}else{
        console.log('你没有登陆');
        return;
    }
};

notice.list = function (req, res) {
    if(req.session.userId){
        //console.log('xxx');
        if(!req.query.type){
            req.query.type = 'all';
        }
        var sql='';
        switch(req.query.type){
            case 'all':
                sql='select * from secret_notice where userId = '+req.session.userId;
                break;
            case 'like':
                sql='select * from secret_notice where pattern in (2,4) and userId = '+req.session.userId;
                break;
            case 'reply':
                sql='select * from secret_notice where pattern in (1,3) and userId = '+req.session.userId;
                break;
        }
        //console.log(sql);return;
        conn.query(
            {
                sql:sql
            }, function (e,r) {
                if(e){
                    console.log(e);
                    res.end(JSON.stringify(code.mysqlError));
                    return;
                }
                var datas=[];

                //console.log(r[0].userId);return;
                for(var i=0;i< r.length;i++){
                    var data ={};
                    //console.log(r[i].userId);return;
                    data.userId = r[i].userId;
                    data.authorId = r[i].authorId;
                    switch (r[i].pattern){
                        case 1:
                            data.action='likePost';
                            break;
                        case 2:
                            data.action='replyPost';
                            data.commentId=r[i].commentId;
                            break;
                        case 3:
                            data.action='likeComment';
                            data.parentCommentId=r[i].parentCommentId;
                            break;
                        case 4:
                            data.action='replyComment';
                            data.commentId=r[i].commentId;
                            data.parentCommentId=r[i].parentCommentId;
                            break;
                    }
                    data.content = r[i].content;
                    data.originContent = r[i].originContent;
                    data.postId = r[i].postId;
                    data.status = r[i].status;
                    datas.push(data);
                    //console.log('xxx');
                }
                    res.end(common.format(200,'success',datas));

            }
        )
    }else{
        console.log('你没有登录');
        return;
    }
};

module.exports = notice;