var check = require('../libs/check.js');
var common = require('../libs/common.js');
var code = require('../libs/code.js');
var conn = require('../libs/mysql.js');
var datas = require('../libs/datas.js');
var request = require('request');
var config = require('../config.js');
var OAUTH = require('wechat-oauth');
var API = require('wechat-api');
var fs = require('fs');
var account = {
    name:'账户处理中心'
};





var oauth = new OAUTH(config.wechatWeb.appId,config.wechatWeb.appSecret, function (openid,callback) {
    // 传入一个获取全局token的方法
    fs.readFile('./token/'+oepnid+'AccessToken.txt', 'utf8', function (err, txt) {
        //console.log(err,txt);//return;
        if (err) {return callback(err);}
        callback(null, JSON.parse(txt));
    });
}, function (openid,token, callback) {
    // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
    // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
    fs.writeFile('./token/'+openid+'AccessToken.txt', JSON.stringify(token), callback);
});

var oauthWechat = new OAUTH(config.wechat.appId,config.wechat.appSecret, function (openid,callback) {
    // 传入一个获取全局token的方法
    fs.readFile('./token/'+openid+'AccessToken.txt', 'utf8', function (err, txt) {
        //console.log(err,txt);//return;
        if (err) {return callback(err);}
        callback(null, JSON.parse(txt));
    });
}, function (openid,token, callback) {
    // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
    // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
    fs.writeFile('./token/'+openid+'AccessToken.txt', JSON.stringify(token), callback);
});

var api = new API(config.wechat.appId,config.wechat.appSecret, function (callback) {
    // 传入一个获取全局token的方法
    fs.readFile('./token/access_token.txt', 'utf8', function (err, txt) {
        //console.log(err,txt);//return;
        //console.log(txt);
        if (err) {return callback(err);}
        callback(null, JSON.parse(txt));
    });
}, function (token, callback) {
    //console.log('123');
    // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
    // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
    fs.writeFile('./token/access_token.txt', JSON.stringify(token), callback);
});


//account.updateWeiboUserInfo(codeResult.access_token,codeResult.uid,r1[0].userId);

account.updateWeiboUserInfo = function(accessToken,openId,userId){

    request('https://api.weibo.com/2/users/show.json?access_token='+accessToken+'&uid='+openId,function(ee,rr){
        if(ee){
            console.log(ee);
            return;
        }

        try{
            var userInfo = JSON.parse(rr.body);
        }catch(e){
            var userInfo = {
                error_code:20000
            }
        }
        //console.log(userInfo);

        //todo 判断是否能拿到用户资料，如果能拿到的话，正常执行登录/注册流程
        // 如果拿不到的话，跳到redirect页，并设置 session.userStatus:wechatNotFans
        //

        if(userInfo.error_code){
            console.log(userInfo);
            return;
        }

        var gender= {
            'm':1,
            'f':2,
            'n':0
        };

        conn.query(
            {sql:"update secret_user_extend set gender="+ gender[userInfo.gender]+",avatar='"+userInfo.avatar_large+"',nickname='"+userInfo.screen_name+"' where userId="+userId
            },function(e,r){
                if(e){
                    console.log(e);
                }else {
                    //console.log( r);
                }
            }
        );
    });


};

account.updateUserInfo = function(accessToken,openId,userId,cb){
    //console.log(accessToken,openId);

    //oauth.getUser(_openId,function(e,r){
    //    if(e){
    //        console.log(e);return;
    //    }
    //
    //    console.log(r);
    //    cb(null)
    //    //conn.query(
    //    //    //sql:"update secret_user_extend set gender="+ r.gender
    //    //)
    //})
    request('https://api.weixin.qq.com/sns/userinfo?access_token='+accessToken+'&openid='+openId,function(eee21,rrr21,bbb21){

        if(eee21){
            res.end(code.getUserInfoError);
            console.log(eee21);return;
        }
        try{

            var body = JSON.parse(bbb21);

        }catch(e){
            var body=null;
        }
        if(body.errcode){
            console.log(bbb21);
            return;
        }
        var userInfo=body;
        console.log(userInfo);
        
        console.log('正在更新头像');

        if(userInfo){
//console.log("update secret_user_extend set gender="+ userInfo.sex+",avatar='"+userInfo.headimgurl+"',nickname='"+userInfo.nickname+"' where userId="+userId);
                conn.query(
                    {sql:"update secret_user_extend set gender="+ userInfo.sex+",avatar='"+userInfo.headimgurl+"',nickname='"+userInfo.nickname+"' where userId="+userId
                    },function(e,r){
                        if(e){
                            console.log(e);
                        }else {
                            console.log( r);
                        }
                    }
                )



            }else{
            //console.log('解析urserInfo出错');
        }
    });


};


account.logout = function(req,res){

    req.session.destroy(function(err) {

        if(err){
            res.end(JSON.stringify(code.logoutError));
            return;
        }

        res.redirect(req.query.redirect?req.query.redirect:"/");
    })
};

account.login = function(req,res,data){
    
    //console.log(data);
  req.session.userId = data.userId;
    req.session.nickname = data.nickname;
    req.session.gender = data.gender;
    req.session.avatar = data.avatar;
    req.session.userStatus = 'login';
    req.session.level = data.level?data.level:0;
    res.redirect(data.redirect?data.redirect:"/");
};


account.test = function(req,res){
    if(!req.query.code) {
        //用户不同意授权
        res.end(JSON.stringify(code.lackParamsCode));
        return;
    }

    //console.log(req.query.code);
    res.end(req.query.code);
return;
};


account.register = function(req,res,data){
    check.register(data,function(e,r){
        if(e){
            res.end(JSON.stringify(e));
            return;
        }
        conn.query(
            {
                sql:"insert into secret_user (id,tel) values (null,'"+ r.tel+"')"
            },function(ee,rr){
                if(ee){
                    console.log(ee);
                    res.end(JSON.stringify(code.mysqlError));
                 return;
                }
                conn.query(
                    {
                        sql:"insert into secret_user_extend (userId,gender,nickname,avatar,date) values ("+rr.insertId+","+r.gender+",'"+ r.nickname+"','"+ r.avatar+"',"+ r.date+")"
                    },function(eee){
                        if(eee){
                            console.log(eee);
                            res.end(JSON.stringify(code.mysqlError));
                            return;
                        }
                        //console.log("insert into secret_open (userId,openId,unionId,source) values ("+rr.insertId+",'"+ r.openId+"','"+ r.unionId+"','"+r.source+"')");
                        conn.query(
                            {
                                sql:"insert into secret_open (userId,openId,unionId,source) values ("+rr.insertId+",'"+ r.openId+"','"+ r.unionId+"','"+r.source+"')"
                            },function(eeee,rrrr){
                                if(eeee){
                                    console.log(eeee);
                                    res.end(JSON.stringify(code.mysqlError));
                                    return;
                                }
                                account.login(req,res,{
                                    avatar: r.avatar,
                                    nickname: r.nickname,
                                    gender: r.gender,
                                    userId: rr.insertId,
                                    redirect: r.redirect
                                });
                            }
                        );

                    }
                )
            }
        )

    });


};

account.wechatGetUserInfo = function(req,res) {

    if (!req.query.code) {
        //用户不同意授权
        res.end(JSON.stringify(code.lackParamsCode));
        return;
    }


    var state = [];
    state = req.query.state.split(',');
    //console.log(state);
    oauthWechat.getAccessToken(req.query.code, function (err, result) {

            if (err) {
                //err
                console.log(err);
                res.end(JSON.stringify(code.wechatLoginCodeToAccessTokenError));
                return;
            }
                var codeResult = result.data;
            //console.log(codeResult);
            conn.query(
                {
                    sql: 'select unionId,userId from secret_open where openId = "' + codeResult.openid + '"'
                },
                function (e1, r1) {
                    if (e1) {
                        res.end(JSON.stringify(code.mysqlError));
                        return;
                    }
                    //console.log(r1);
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
                                if (r2.length > 0) {

                                    account.login(
                                        req, res, {
                                            userId:r1[0].userId,
                                            avatar: r2[0].avatar,
                                            openId: codeResult.openId,
                                            unionId: codeResult.unionid,
                                            nickname: r2[0].nickname,
                                            gender: r2[0].gender,
                                            source: state[0],
                                            level:r2[0].level,
                                            redirect: state[1]
                                        }
                                    )
                                } else {
                                    res.end(JSON.stringify(code.noUserInfo));
                                    return;
                                }

                            }
                        );

     account.updateUserInfo(codeResult.access_token,codeResult.openid,r1[0].userId,function(e,r){
         //更新用户资料
     });

                        //client.getUser('openid', function (err, result) {
                    //    var userInfo = result;
                    //});



                        //toto后台去更新用户资料
                    } else {


                        conn.query(
                            {
                                sql: 'select userId from secret_open where unionId = "' + codeResult.unionid + '"'
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
                                            sql: "insert into secret_open (userId,openId,unionId,source) values (" + r5[0].userId + ",'" + codeResult.openid + "','" + codeResult.unionid + "','wechat')"
                                        }, function (e6) {

                                            if (e6) {
                                                res.end(JSON.stringify(code.mysqlError));
                                                console.log(e6);
                                                return;
                                            }
                                            conn.query(
                                                {
                                                    sql: "select * from secret_user_extend where userId = " + r5[0].userId
                                                }, function (e7, r7) {
                                                    if (e7) {
                                                        res.end(JSON.stringify(code.mysqlError));
                                                        console.log(e7);
                                                        return;
                                                    }
                                                    if (r7.length > 0) {
                                                        account.login(
                                                            req, res, {
                                                                userId: r5[0].userId,
                                                                avatar: r7[0].avatar,
                                                                openId: codeResult.openid,
                                                                unionId: codeResult.unionid,
                                                                nickname: r7[0].nickname,
                                                                gender: r7[0].gender,
                                                                source: state[0],
                                                                level:r7[0].level,
                                                                redirect: state[1]
                                                            });
                                                    }else{
                                                        res.end(JSON.stringify(code.noUserInfo));
                                                        return;
                                                    }
                                                });
                                        });

                                } else {


                                    api.getUser(codeResult.openid, function (err, result) {

var user = result;
                                        //console.log('下面一条输出是userinfo');
                                        //console.log(user);
                                        if (err) {
                                            req.session.userStatus = 'wechatNotFans';
                                            //没有拿到用户资料
                                            res.redirect(state[1]);
                                            return;

                                        } else {


                                            if (!user.subscribe) {

                                                req.session.userStatus = 'wechatNotFans';
                                                //没有拿到用户资料
                                                res.redirect(state[1]);
                                                return;
                                            }

                                            account.register(req, res, {
                                                avatar: user.headimgurl,
                                                openId: user.openid,
                                                unionId: user.unionid,
                                                nickname: user.nickname,
                                                gender: user.sex,
                                                source: state[0],
                                                redirect: state[1]
                                            });


                                        }

                                    });
                                }
                            });

                    }

                });


    });
};


account.wechatLogin = function (req, res) {
    if(!req.query.code) {
        //用户不同意授权
        res.end(JSON.stringify(code.lackParamsCode));
        return;
    }
    var state = [];
    state = req.query.state.split(',');
        //get code
    if(state[0]=='wechatWeb'){
        oauth.getAccessToken(req.query.code, function (err, result) {
                    if (err) {
                        //err
                        console.log(err);
                        res.end(JSON.stringify(code.wechatLoginCodeToAccessTokenError));
                        return;
                    }
                    var codeResult = result.data;
                    conn.query(
                        {
                            sql:'select unionId,userId from secret_open where openId = "'+codeResult.openid+'"'
                        },
                        function (e1, r1) {
                            console.log(e1,r1);
                            if(e1){
                                res.end(JSON.stringify(code.mysqlError));
                                return;
                            }
                            //console.log(r1);
                            if(r1.length>0){

                                conn.query(
                                    {
                                        sql:"select * from secret_user_extend where userId = "+r1[0].userId
                                    },function(e2,r2){
                                        if(e2){
                                            res.end(JSON.stringify(code.mysqlError));
                                            console.log(e2);
                                            return;
                                        }
                                        if(r2.length>0) {

                                            account.login(
                                                req, res, {
                                                    avatar: r2[0].avatar,
                                                    openId: r1.openid,
                                                    unionId: codeResult.unionid,
                                                    nickname: r2[0].nickname,
                                                    gender: r2[0].gender,
                                                    source:state[0],
                                                    level:r2[0].level,
                                                    userId:r1[0].userId,
                                                    redirect:state[1]
                                                }
                                            )
                                        }else{
                                            res.end(JSON.stringify(code.noUserInfo));
                                            return;
                                        }

                                    }
                                );
                                //console.log(codeResult);
                                account.updateUserInfo(codeResult.access_token,codeResult.openid,r1[0].userId);

                                //toto 后台去更新用户资料
                            }else{


                                conn.query(
                                    {
                                        sql: 'select userId from secret_open where unionId = "' + codeResult.unionid + '"'
                                    },
                                    function (e5, r5) {
                                        if (e5) {
                                            res.end(JSON.stringify(code.mysqlError));
                                            return;
                                        }
                                        console.log(r5);
                                        //console.log(r1);
                                        if (r5.length > 0) {


                                            conn.query(
                                                {
                                                    sql: "insert into secret_open (userId,openId,unionId,source) values (" + r5[0].userId + ",'" + codeResult.openid + "','" + codeResult.unionid + "','wechat')"
                                                }, function (e6) {

                                                    if (e6) {
                                                        res.end(JSON.stringify(code.mysqlError));
                                                        console.log(e6);
                                                        return;
                                                    }
                                                    conn.query(
                                                        {
                                                            sql: "select * from secret_user_extend where userId = " + r5[0].userId
                                                        }, function (e7, r7) {
                                                            if (e7) {
                                                                res.end(JSON.stringify(code.mysqlError));
                                                                console.log(e7);
                                                                return;
                                                            }
                                                            if (r7.length > 0) {
                                                                account.login(
                                                                    req, res, {
                                                                        userId: r5[0].userId,
                                                                        avatar: r7[0].avatar,
                                                                        openId: codeResult.openid,
                                                                        unionId: codeResult.unionid,
                                                                        nickname: r7[0].nickname,
                                                                        gender: r7[0].gender,
                                                                        source: state[0],
                                                                        redirect: state[1],
                                                                        level:r7[0].level
                                                                    });
                                                            } else {
                                                                res.end(JSON.stringify(code.noUserInfo));
                                                                return;
                                                            }
                                                        });
                                                });

                                            account.updateUserInfo(codeResult.access_token,codeResult.openid,r5[0].userId);


                                        } else {



                                            request('https://api.weixin.qq.com/sns/userinfo?access_token='+codeResult.access_token+'&openid='+codeResult.openid,function(eee21,rrr21,bbb21){

                                                if(eee21){
                                                    res.end(code.getUserInfoError);
                                                    console.log(eee21);return;
                                                }
                                                try{

                                                    var userInfo = JSON.parse(bbb21);

                                                }catch(e){
                                                    var userInfo=null;
                                                }

                                                if(userInfo){
                                                    account.register(req, res, {
                                                            avatar: userInfo.headimgurl,
                                                            openId: userInfo.openid,
                                                            unionId: userInfo.unionid,
                                                            nickname: userInfo.nickname,
                                                            gender: userInfo.sex,
                                                            source: state[0],
                                                            redirect: state[1]
                                                        }
                                                    );
                                                }else{
                                                    res.end(code.getUserInfoError);
                                                    console.log(eee21);return;
                                                }

                                            });


                                        }

                                    });
                            }
                        }
                    )


                }
            )
    }else{
        oauthWechat.getAccessToken(req.query.code, function (err, result) {
                if (err) {
                    //err
                    console.log(err);
                    res.end(JSON.stringify(code.wechatLoginCodeToAccessTokenError));
                    return;
                }
                var codeResult = result.data;
                
                console.log(codeResult);
                conn.query(
                    {
                        sql:'select unionId,userId from secret_open where openId = "'+codeResult.openid+'"'
                    },
                    function (e1, r1) {
                        if(e1){
                            res.end(JSON.stringify(code.mysqlError));
                            return;
                        }
                        //console.log(r1);
                        if(r1.length>0){

                            conn.query(
                                {
                                    sql:"select * from secret_user_extend where userId = "+r1[0].userId
                                },function(e2,r2){
                                    if(e2){
                                        res.end(JSON.stringify(code.mysqlError));
                                        console.log(e2);
                                        return;
                                    }
                                    if(r2.length>0) {

                                        account.login(
                                            req, res, {
                                                avatar: r2[0].avatar,
                                                openId: r1.openid,
                                                unionId: codeResult.unionid,
                                                nickname: r2[0].nickname,
                                                gender: r2[0].gender,
                                                source:state[0],
                                                userId:r1[0].userId,
                                                redirect:state[1],
                                                level:r2[0].level
                                            }
                                        )
                                    }else{
                                        res.end(JSON.stringify(code.noUserInfo));
                                        return;
                                    }

                                }
                            );

                            account.updateUserInfo(codeResult.access_token,codeResult.openid,r1[0].userId);


                            //toto 后台去更新用户资料
                        }else{


                            conn.query(
                                {
                                    sql: 'select userId from secret_open where unionId = "' + codeResult.unionid + '"'
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
                                                sql: "insert into secret_open (userId,openId,unionId,source) values (" + r5[0].userId + ",'" + codeResult.openid + "','" + codeResult.unionid + "','wechat')"
                                            }, function (e6) {

                                                if (e6) {
                                                    res.end(JSON.stringify(code.mysqlError));
                                                    console.log(e6);
                                                    return;
                                                }
                                                conn.query(
                                                    {
                                                        sql: "select * from secret_user_extend where userId = " + r5[0].userId
                                                    }, function (e7, r7) {
                                                        if (e7) {
                                                            res.end(JSON.stringify(code.mysqlError));
                                                            console.log(e7);
                                                            return;
                                                        }
                                                        if (r7.length > 0) {
                                                            account.login(
                                                                req, res, {
                                                                    userId: r5[0].userId,
                                                                    avatar: r7[0].avatar,
                                                                    openId: codeResult.openid,
                                                                    unionId: codeResult.unionid,
                                                                    nickname: r7[0].nickname,
                                                                    gender: r7[0].gender,
                                                                    source: state[0],
                                                                    level:r7[0].level,
                                                                    redirect: state[1]
                                                                });
                                                        } else {
                                                            res.end(JSON.stringify(code.noUserInfo));
                                                            return;
                                                        }
                                                    });
                                            });
                                        account.updateUserInfo(codeResult.access_token,codeResult.openid,r5[0].userId);


                                    } else {

                                        oauthWechat.getUser(codeResult.openid, function(eeee1,userInfo){

                                            //console.log(userInfo);

                                            if (eeee1) {
                                                console.log(eeee1);
                                                res.end(JSON.stringify(code.wechatLoginCodeToAccessTokenError));
                                                return;
                                            }
                                            account.register(req, res, {
                                                    avatar: userInfo.headimgurl,
                                                    openId: userInfo.openid,
                                                    unionId: userInfo.unionid,
                                                    nickname: userInfo.nickname,
                                                    gender: userInfo.sex,
                                                    source: state[0],
                                                    redirect: state[1]
                                                }
                                            );
                                        });
                                    }

                                });
                        }
                    }
                )


            }
        )
    }


};


account.weiboLogin = function (req, res) {
    if(!req.query.code) {
        //用户不同意授权
        res.end(JSON.stringify(code.lackParamsCode));
        return;
    }


    var state = [];
    state = req.query.state.split(',');


    //get code

    var appId,appSecret;
        appId= config.weibo.appkey;
        appSecret = config.weibo.appSecret;
    request({url:'https://api.weibo.com/oauth2/access_token',
            method:'post',
        form:{
            client_id:appId,
            client_secret:appSecret,
            grant_type:'authorization_code',
            code:req.query.code,
            redirect_uri:config.site.url+'/auth/weibo'
        }
        },function (e,r) {
            if (e) {
                res.end(JSON.stringify(code.requestError));
                return;
            }else{

                try{
                    var codeResult = JSON.parse(r.body);
                }catch(e){
                    var codeResult = {error_code:23333};
                }

                //console.log(codeResult);


                if(codeResult.error_code){
                    //err
                    console.log(codeResult);
                    res.end(JSON.stringify(code.weiboLoginCodeToAccessTokenError));
                    return;
                }
                //console.log(codeResult);
                conn.query(
                    {
                        sql:'select userId from secret_open where unionId = "'+codeResult.uid+'"'
                    },
                    function (e1, r1) {
                        if(e1){
                            res.end(JSON.stringify(code.mysqlError));
                            return;
                        }
                        //console.log(r1);
                        if(r1.length>0){

                            conn.query(
                                {
                                    sql:"select * from secret_user_extend where userId = "+r1[0].userId
                                },function(e2,r2){
                                    if(e2){
                                        res.end(JSON.stringify(code.mysqlError));
                                        console.log(e2);
                                        return;
                                    }
                                    if(r2.length>0) {

                                        account.login(
                                            req, res, {
                                                avatar: r2[0].avatar,
                                                unionId: codeResult.uid,
                                                nickname: r2[0].nickname,
                                                gender: r2[0].gender,
                                                source:state[0],
                                                userId:r1[0].userId,
                                                redirect:state[1],
                                                level:r2[0].level
                                            }
                                        )
                                    }else{
                                        res.end(JSON.stringify(code.noUserInfo));
                                        return;
                                    }

                                }
                            );


                            account.updateWeiboUserInfo(codeResult.access_token,codeResult.uid,r1[0].userId);

                            //toto 后台去更新用户资料
                        }else{
                            request('https://api.weibo.com/2/users/show.json?access_token='+codeResult.access_token+'&uid='+codeResult.uid,function(ee,rr){
                                if(ee){
                                    res.end(JSON.stringify(code.requestError));
                                    console.log(ee);
                                    return;
                                }

                                try{
                                    var userInfo = JSON.parse(rr.body);
                                }catch(e){
                                    var userInfo = {
                                        error_code:20000
                                    }
                                }
                                //console.log(userInfo);

                                //todo 判断是否能拿到用户资料，如果能拿到的话，正常执行登录/注册流程
                                // 如果拿不到的话，跳到redirect页，并设置 session.userStatus:wechatNotFans
                                //

                                if(userInfo.error_code){
                                    console.log(userInfo);
                                    res.end(JSON.stringify(code.wechatLoginCodeToAccessTokenError));
                                    return;
                                }

                                var gender= {
                                    'm':1,
                                    'f':2,
                                    'n':0
                                };
                                account.register(req,res,{
                                        avatar:userInfo.avatar_large,
                                        openId:userInfo.id,
                                        unionId:userInfo.id,
                                        nickname:userInfo.screen_name,
                                        gender:gender[userInfo.gender],
                                        source:state[0],
                                        redirect:state[1]
                                    }
                                );
                            });
                        }
                    }
                )

            }
        }
    )

};


account.weiboAdmin = function(req,res){
    if(!req.query.code) {
        //用户不同意授权
        //res.end(JSON.stringify(code.lackParamsCode));

        res.render('weiboAdmin');
        return;
    }

    //get code

    var appId,appSecret;
    appId= config.weibo.appkey;
    appSecret = config.weibo.appSecret;
    request({url:'https://api.weibo.com/oauth2/access_token',
        method:'post',
        form:{
            client_id:appId,
            client_secret:appSecret,
            grant_type:'authorization_code',
            code:req.query.code,
            redirect_uri:config.site.url+'/auth/weibo'
        }
    },function (e,r) {
        if (e) {
            res.end(JSON.stringify(code.requestError));
            return;
        } else {

            try {
                var codeResult = JSON.parse(r.body);
            } catch (e) {
                var codeResult = {error_code: 23333};
            }

            //console.log(codeResult);


            if (codeResult.error_code) {
                //err
                console.log(codeResult);
                res.end(JSON.stringify(code.weiboLoginCodeToAccessTokenError));
                return;
            }

            if(codeResult.uid==3656973697){

                fs.writeFile('./token/weibo_token.txt', r.body, function(e,r){
                    if(e){
                        console.log(e);
                        res.end(e.toString());
                        return;
                    }
                    res.end("更新scuinfo的token成功，下次过期时间是:"+(common.date((common.time()+codeResult.expires_in)*1000)))
                });


            }else{
                res.end("你是什么鬼？");
            }

        }
    });
}


module.exports = account;