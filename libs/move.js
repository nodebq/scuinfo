var conn  = require('./mysql.js');
var request = require('request');
var datas = require('./datas.js');
var common = require('./common.js');
var config= require('../config.js');
var move  = {
    name:"迁移"
};

var start=0,length=1;


move.user  =  function(o){
    console.log(o);
    conn.query(
        
        {
            sql:"select * from si_user limit "+ o.start+",1"
        },function(e,r){
            if(e){
                move.user({
                    start: o.start+1
                });
                console.log(e);
                return;
            }else{
                if(r.length>0){
//console.log(r);
                    if(r[0].sina_openid){

                        //是的话，写入 secret_open   openId,unionId,userId,写入 user_extend(是否已有): nickname,avatar,gender,userId,date,写入user(是否已有）,id,tel
                        
                        conn.query(
                            
                            {
                                sql:"select id from secret_open where openId='"+r[0].sina_openid+"'"
                            },function(e9,r9){
                                if(e9){
                                    move.user({
                                        start: o.start+1
                                    });
                                    console.log(e9);
                                    return;
                                }

                                if(r9.length==0){


                        conn.query(
                            {
                                sql: "insert into secret_user (id,tel) values (:id,:tel)",
                                params: {
                                    id: r[0].user_id,
                                    tel: r[0].phone?r[0].phone:""
                                }
                            },function(e1,r1) {
                                if (e1) {
                                    move.user({
                                        start: o.start+1
                                    });
                                    console.log(e1);
                                    return;
                                } else {
                                    //console.log(r1);
                                    conn.query(
                                        {
                                            sql: "insert into secret_open (openId,unionId,userId,source) values (:openId,:unionId,:userId,'weibo')",
                                            params: {
                                                openId: r[0].sina_openid,
                                                unionId: r[0].sina_openid,
                                                userId: r[0].user_id
                                            }
                                        }, function (e2, r2) {

                                            if(e2){
                                                move.user({
                                                    start: o.start+1
                                                });
                                                console.log(e2);
                                                return;
                                            }else{
//console.log(r2);
                                            var gender = {
                                            "男":1,
                                                "女":2
                                            };

                                                conn.query(
                                                    {
                                                        sql: "insert into secret_user_extend (userId,nickname,avatar,gender,date) values (:userId,:nickname,:avatar,:gender,:date)",
                                                        params: {
                                                            userId: r[0].user_id,
                                                            nickname:r[0].sina_name,
                                                            avatar:r[0].avatar_large,
                                                            gender:gender[r[0].gender],
                                                            date:r[0].register_time
                                                        }
                                                    }, function (e4, r4) {

                                                        if(e4){
                                                            move.user({
                                                                start: o.start+1
                                                            });
                                                            //console.log(e4);
                                                            return;
                                                        }else{
                                                            //console.log('weibo导入');

                                                            if(r[0].student_id && r[0].student_password) {

                                                                conn.query(
                                                                    {
                                                                        sql:"insert into secret_account (userId,password,studentId,date) values ("+r[0].user_id+",'"+r[0].student_password+"',"+r[0].student_id+","+common.time()+")"
                                                                    },function(e,r){
                                                                        console.log(e,'教务处添加成功');
                                                                    }
                                                                )

                                                            }
                                                            if(r[0].library_id && r[0].library_password) {


                                                                conn.query(
                                                                    {
                                                                        sql:"insert into secret_library (userId,password,studentId,date) values ("+r[0].user_id+",'"+r[0].library_password+"','"+r[0].library_id+"',"+common.time()+")"
                                                                    },function(e,r){
                                                                        console.log(e,'图书馆添加成功');
                                                                    }
                                                                )
                                                            }


                                                if(r[0].weixin_key){
                                                    conn.query(
                                                        {
                                                            sql:"select id from secret_open where openId='"+r[0].weixin_key+"'"
                                                        },function(e10,r10) {
                                                            if (e10) {
                                                                move.user({
                                                                    start: o.start + 1
                                                                });
                                                                console.log(e10);
                                                                return;
                                                            }

                                                            if (r10.length == 0) {
                                                                //console.log('2');
                                                                request('https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + datas.wechat.accessToken + '&openid=' + r[0].weixin_key + '&lang=zh_CN', function (e7, r7) {

                                                                    if (e7) {
                                                                        move.user({
                                                                            start: o.start + 1
                                                                        });
                                                                        console.log(e7);
                                                                        return;
                                                                    }

                                                                    //console.log(r7.body);return;
                                                                    try {
                                                                        var user = JSON.parse(r7.body);
                                                                    } catch (e) {
                                                                        var user = {
                                                                            errcode: 20000
                                                                        }
                                                                    }


                                                                    //console.log('下面一条输出是userinfo');
                                                                    if (user.errcode) {
                                                                        console.log(user);
                                                                        //没有拿到用户资料
                                                                        move.user({
                                                                            start: o.start + 1
                                                                        });
                                                                        return;

                                                                    } else {

                                                                        if (!user.subscribe) {
                                                                            console.log('取消订阅了');
                                                                            move.user({
                                                                                start: o.start + 1
                                                                            });
                                                                            return;

                                                                        } else {

                                                                            //console.log(user);


                                                                            conn.query(
                                                                                {
                                                                                    sql: "insert into secret_open (openId,unionId,userId,source) values (:openId,:unionId,:userId,'wechat')",
                                                                                    params: {
                                                                                        openId: user.openid,
                                                                                        unionId: user.unionid,
                                                                                        userId: r[0].user_id
                                                                                    }
                                                                                }, function (e10, r10) {

                                                                                    if (e10) {
                                                                                        move.user({
                                                                                            start: o.start + 1
                                                                                        });
                                                                                        console.log(e10);
                                                                                        return;
                                                                                    } else {
                                                                                        //console.log('微信导入');


                                                                                        move.user({
                                                                                            start: o.start + 1
                                                                                        });
                                                                                        return;
                                                                                    }


                                                                                });
                                                                        }
                                                                    }
                                                                });
                                                                return;

                                                            } else {
                                                                move.user(
                                                                    {
                                                                        start: o.start + 1
                                                                    }
                                                                )
                                                            }
                                                        });
                                                }else{
                                                    //next
                                                    move.user({
                                                        start: o.start+1
                                                    });
                                                    return;
                                                }
                                                }
                                                        });

                                            }
                                        });

                                }
                            });

                                }else{
                                    
                                    //console.log('已存在');
                                    move.user({
                                        start: o.start+1
                                    });
                                    return;
                                }
                            }
                        );
                    }else{
                        //next
                        move.user({
                            start: o.start+1
                        });
                        return;
                    }
                }else{
                    console.log('没有了停止吧');
                    return;
                }


                
            }
        }
    )
    
    
};

move.love = function(o){

//找到数据，然后request 接口
    conn.query(

        {
            sql:"select * from si_love limit "+ o.start+",1"
        },function(e,r) {
            if (e) {
                move.love({
                    start: o.start + 1
                });
                console.log(e);
                return;
            } else {
                //console.log(r);
                
                if(r.length>0) {

                    var content = r[0].content.substring(3, r[0].content.indexOf('<\/p>'));

                    if(content.indexOf('+')==0)
                    {
                        content=content.substr(1);
                    }
                    conn.query(
                        {
                            sql: "select * from secret_user_extend where userId=" + r[0].user_id
                        }, function (ee, rr) {
                            if (ee) {
                                move.love({
                                    start: o.start + 1
                                });
                                console.log(ee);
                                return;
                            } else {

                                if (rr.length > 0) {
                                    request.post(
                                        {
                                            url: config.localhostUrl+"/api/postMove",
                                            form: {
                                                content: '#川大表白#' + content,
                                                userId: r[0].user_id,
                                                date: r[0].publish_time,
                                                nickname: rr[0].nickname,
                                                avatar: rr[0].avatar,
                                                gender: rr[0].gender,
                                                secret: 1
                                            }
                                        }, function (eee, rrr, bbb) {
                                            if (eee) {
                                                move.love({
                                                    start: o.start + 1
                                                });
                                                console.log(eee);
                                            } else {
                                                move.love({
                                                    start: o.start + 1
                                                });
                                                //console.log(bbb);
                                            }
                                        }
                                    )
                                } else {
                                    //next
                                    move.love({
                                        start: o.start + 1
                                    });
                                }
                            }
                        }
                    )
                }else{
                    console.log('搞完了');

                }

            }
        });

};

move.hole = function(o){
//console.log(o);
//找到数据，然后request 接口
    conn.query(

        {


            sql:"select * from si_hole limit "+ o.start+",1"
        },function(e,r) {
            if (e) {
                move.love({
                    start: o.start + 1
                });
                console.log(e);
                return;
            } else {
                //console.log(r);

                if(r.length>0) {

                    var content = r[0].content;

                    if(content.indexOf('+')==0)
                    {
                        content=content.substr(1);
                    }
                    conn.query(
                        {
                            sql: "select * from secret_user_extend where userId=" + r[0].user_id
                        }, function (ee, rr) {
                            if (ee) {
                                move.hole({
                                    start: o.start + 1
                                });
                                console.log(ee);
                                return;
                            } else {

                                if (rr.length > 0) {
                                    request.post(
                                        {
                                            url: config.localhostUrl+"/api/postMove",
                                            form: {
                                                content: '#川大树洞#' + content,
                                                userId: r[0].user_id,
                                                date: r[0].publish_time,
                                                nickname: rr[0].nickname,
                                                avatar: rr[0].avatar,
                                                gender: rr[0].gender,
                                                secret: 1
                                            }
                                        }, function (eee, rrr, bbb) {
                                            if (eee) {
                                                move.hole({
                                                    start: o.start + 1
                                                });
                                                console.log(eee);
                                            } else {
                                                move.hole({
                                                    start: o.start + 1
                                                });
                                                //console.log(bbb);
                                            }
                                        }
                                    )
                                } else {
                                    //next
                                    move.hole({
                                        start: o.start + 1
                                    });
                                }
                            }
                        }
                    )
                }else{
                    console.log('搞完了');

                }

            }
        });

};


move.wish = function(o){

//找到数据，然后request 接口
    conn.query(

        {


            sql:"select * from si_wish limit "+ o.start+",1"
        },function(e,r) {
            if (e) {
                move.love({
                    start: o.start + 1
                });
                console.log(e);
                return;
            } else {
                //console.log(r);

                if(r.length>0) {

                    var content = r[0].content.substring(3, r[0].content.indexOf('<\/p>'));

                    if(content.indexOf('+')==0)
                    {
                        content=content.substr(1);
                    }
                    conn.query(
                        {
                            sql: "select * from secret_user_extend where userId=" + r[0].user_id
                        }, function (ee, rr) {
                            if (ee) {
                                move.wish({
                                    start: o.start + 1
                                });
                                console.log(ee);
                                return;
                            } else {
                                //console.log(rr);

                                if (rr.length > 0) {
                                    request.post(
                                        {
                                            url: config.localhostUrl+"/api/postMove",
                                            form: {
                                                content: '#川大心愿#' + content,
                                                userId: r[0].user_id,
                                                date: r[0].publish_time,
                                                nickname: rr[0].nickname,
                                                avatar: rr[0].avatar,
                                                gender: rr[0].gender,
                                                secret: 0
                                            }
                                        }, function (eee, rrr, bbb) {
                                            if (eee) {
                                                move.wish({
                                                    start: o.start + 1
                                                });
                                                console.log(eee);
                                            } else {
                                                move.wish({
                                                    start: o.start + 1
                                                });
                                                console.log(bbb);
                                            }
                                        }
                                    )
                                } else {
                                    //next
                                    move.wish({
                                        start: o.start + 1
                                    });
                                }
                            }
                        }
                    )
                }else{
                    console.log('搞完了');

                }

            }
        });

};



/**
 * 更改来源
 */
move.updateSourse = function(o){
//console.log(o);
    
    conn.query(
        {
            sql:"select id from secret_open where source='weiboImport' limit "+o.start+",1"
        },function(e,r) {
            if (e) {
                console.log(e);
                move.updateSourse({
                    start: o.start + 1
                });
                return;
            }

            if (r.length > 0) {

                conn.query(
                    {
                        sql: "update secret_open set source='weibo' where id=" + r[0].id
                    }, function (ee, rr) {
                        if (ee) {
                            move.updateSourse({
                                start: o.start + 1
                            });
                            console.log(ee);
                            return;
                        }
                        console.log('成功');
                        move.updateSourse({
                            start: o.start + 1
                        });
                    }
                )
            }
            else {
                console.log('没有了');
            }
        }
    )

};

//move.user(
//    {
//        start:0
//    }
//)
//move.updateSourse({
//    start:0
//});



 //move.wish(
 //{start:0}
 //);


 //
 //
 //move.love({
 //start:0
 //});




 //move.hole(
 //{start:0}
 //);


