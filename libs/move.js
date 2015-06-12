var conn  = require('./mysql.js');
var request = require('request');
var datas = require('./datas.js');
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
                                            sql: "insert into secret_open (openId,unionId,userId,source) values (:openId,:unionId,:userId,'weiboImport')",
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
                                                if(r[0].weixin_key){
                                                    request('https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + datas.wechat.accessToken + '&openid=' +r[0].weixin_key + '&lang=zh_CN', function (e7, r7) {

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
                                                                        sql: "insert into secret_open (openId,unionId,userId,source) values (:openId,:unionId,:userId,'wechatImport')",
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
                console.log(r);
                
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
                                                console.log(bbb);
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
console.log(o);
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
                                                console.log(bbb);
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
                console.log(r);

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
                                console.log(rr);

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

/*
 move.user({
 start:0
 });

 */


/*
 move.wish(
 {start:0}
 );
&*/


/*
 move.love({
 start:0
 });

 */

/*
 move.hole(
 {start:0}
 );
 */

module.exports = move;