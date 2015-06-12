var service = {
    name:"公共服务"
};
var code =require('../libs/code.js');
var common = require('../libs/common.js');
var request = require('request');
var conn= require('../libs/mysql.js');
var config= require('../config.js');
var dbs = require('../libs/db');
var user= require('./user.js');
var bind= require('../libs/bind.js');
service.validSession = function(msg,cb){

    if(msg.debug==0 || msg.debug){
        cb(null,{
            type:msg.debug
        });
        return;
    }

conn.query(
    {
        sql:"select * from wechat_session where openId='"+msg.FromUserName+"' order by id desc limit 0,1"
    },function(e,r){

        if(e){
            console.log(e);
            cb(code.mysqlError);
            return;
        }
        if(r.length==0){
            cb(code.noWechatSession);
            return;
        }
        cb(null,
            {
                type:r[0].type
            })

    }
)

};

service.advise = function(msg,req,res,next){

    conn.query(
        {
            sql:"insert into wechat_session (openId,createAt,type) values ('"+msg.FromUserName+"',"+common.time()+",1)"
        },function(e,r) {
            if (e) {
                console.log(e);
                res.reply(code.mysqlError.message);
                return;
            }
            dbs.getWechatText({
                name: "advise"
            }, function (eee, rrrr) {
                if (eee) {
                    res.reply(JSON.stringify(eee));
                    return;
                }
                //console.log(rrrr);
                res.reply(rrrr);

            });
            return;
        });

};


service.subscribe = function(msg,req,res,next){
    dbs.getWechatText({
        name:"subscribe"
    },function(eee,rrrr){
        if(eee){
            res.reply(JSON.stringify(eee));
            return;
        }
        //console.log(rrrr);
        res.reply(rrrr);

    });
    return;

};

service.post = function(msg,req,res,next){

    //content,secret,openId
conn.query(
    {
        sql:"insert into wechat_session (openId,createAt,type) values ('"+msg.FromUserName+"',"+common.time()+",0)"
    },function(e,r){
        if(e){
            console.log(e);
            res.reply(code.mysqlError.message);
            return;
        }
        //todo 严谨起见还是判断下id好

    dbs.getWechatText({
        name:"post"
    },function(eee,rrrr){
        if(eee){
            res.reply(JSON.stringify(eee));
            return;
        }
        //console.log(rrrr);
        res.reply(rrrr);

    });
    return;


    }
)

};




/**
 * 处理文本
 * @param msg
 * @param req
 * @param res
 * @param next
 */
service.text = function(msg,req,res,next){

    service.validSession(msg,function(e,r){

        if(e) {
            //没有微信会话
            if (e.code == 2041) {
                service.noSessionText(msg, req, res, next);
                return;

            }
            dbs.getWechatText({
                name:"default"
            },function(eee,rrrr){
                if(eee){
                    res.reply(JSON.stringify(eee));
                    return;
                }
                //console.log(rrrr);
                res.reply(rrrr);

            });
           return;
        }

            switch(r.type){


                case 0:
                    //处理发布匿名帖子

                    request.post(
                        {
                            url:config.site.url+"/api/postWechat",
                            form:{
                                content:msg.Content,
                                secret:1,
                                openId:msg.FromUserName
                            }
                        },function(e9,r9,b9){

                            if(e9){
                                res.reply("服务器好像出了点问题，请重试。");
                                console.log(e9);
                                return;
                            }

                            try{
                                var result = JSON.parse(b9);
                            }catch(e){
                                var result=code.jsonParseError;

                            }

                            if(result.code==200){
                                var news=[];
                                news[0]={
                                    title:'我已经帮你发布在scuinfo.com了',
                                    description:'点击查看你刚刚发布的内容',
                                    pic:'',
                                    url:config.site.url+'/p/'+result.data.insertId
                            };
                                res.reply(news);
                                return;


                            }else{
                                res.reply(result.message);
                            }

                        }
                    );

                    break;
                case 1:

                    //处理留言

                    user.getUserId(msg.FromUserName,function(e,r) {
                        console.log(e, r);
                        if (e) {
                            if (e.code == 2020) {

                                bind.register(msg.FromUserName, function (ee, rr) {

                                    if (ee) {
                                        res.reply(JSON.stringify(ee));
                                        return;
                                    }

                                    conn.query(
                                        {
                                            sql:"insert into wechat_message (content,createAt,openId,nickname) values ('"+msg.Content+"',"+common.time()+",'"+msg.FromUserName+"','"+rr.nickname+"')"
                                        },function(e3){
                                            if(e3){
                                                res.reply(e3.message);
                                                return;
                                            }
                                            res.reply('已收到你的留言，稍后将人工回复你');
                                        }
                                    );

                                    return;

                                });

                                return;
                            }
                            return;
                        }

                        conn.query(
                            {
                                sql:"select nickname from secret_user_extend where userId="+r
                            },function(e4,r4){

                                if(e4){
                                    res.reply(code.mysqlError);
                                    return;
                                }


                                conn.query(
                                    {
                                        sql:"insert into wechat_message (content,createAt,openId,nickname) values ('"+msg.Content+"',"+common.time()+",'"+msg.FromUserName+"','"+(r4[0]?r4[0].nickname:'secret')+"')"
                                    },function(e3){
                                        if(e3){
                                            res.reply(e3.message);
                                            return;
                                        }
                                        res.reply('已收到你的留言，稍后将人工回复你。');
                                    }
                                );



                            }
                        )

                    });


                    break;

                case 2:

                    request.post(
                        {
                            url:config.site.url+"/api/postWechat",
                            form:{
                                content:"#海螺#"+msg.Content,
                                secret:1,
                                openId:msg.FromUserName
                            }
                        },function(e9,r9,b9){

                            if(e9){
                                res.reply("服务器好像出了点问题，请重试。");
                                console.log(e9);
                                return;
                            }
console.log(b9);
                            try{
                                var result = JSON.parse(b9);
                            }catch(e){
                                var result=code.jsonParseError;

                            }

                            if(result.code==200){
                                var news=[];
                                news[0]={
                                    title:'神奇海螺已经收到你的留言了',
                                    description:'点击查看你发布的内容，超过'+config.postWeibo.count+'个赞会自动发布在微博@scuinfo',
                                    pic:'',
                                    url:config.site.url+'/p/'+result.data.insertId
                                };
                                res.reply(news);
                                return;


                            }else{
                                res.reply(result.message);
                            }

                        }
                    );

                    break;

                case 3:

                    request.post(
                        {
                            url:config.site.url+"/api/postWechat",
                            form:{
                                content:"#川大表白#"+msg.Contents,
                                secret:1,
                                openId:msg.FromUserName
                            }
                        },function(e9,r9,b9){

                            if(e9){
                                res.reply("服务器好像出了点问题，请重试。");
                                console.log(e9);
                                return;
                            }
                            console.log(b9);
                            try{
                                var result = JSON.parse(b9);
                            }catch(e){
                                var result=code.jsonParseError;

                            }

                            if(result.code==200){
                                var news=[];
                                news[0]={
                                    title:'成功表白！',
                                    description:'点击查看你的表白，超过'+config.postWeibo.count+'个赞会自动发布在微博@scuinfo',
                                    pic:'',
                                    url:config.site.url+'/p/'+result.data.insertId
                                };
                                res.reply(news);
                                return;


                            }else{
                                res.reply(result.message);
                            }

                        }
                    );

                    break;
            }
        service.logout(msg.FromUserName,function(e,r){
//console.log(e,r);
        });


            return;



    });

    /**
     * 记录日志
     */
    service.log(msg);


};

/**
 * 处理没有会话状态的session
 */
service.noSessionText = function(msg,req,res,next){



    if(msg.Content.substr(0,4)=='川大表白'){

        if(msg.Content.length==4){

            //content,secret,openId
            conn.query(
                {
                    sql:"insert into wechat_session (openId,createAt,type) values ('"+msg.FromUserName+"',"+common.time()+",3)"
                },function(e,r) {
                    if (e) {
                        console.log(e);
                        res.reply(code.mysqlError.message);
                        return;
                    }
                    //todo 严谨起见还是判断下id好
                    res.reply('接下来请直接写下你的表白（我会帮你加上#川大表白#的话题，10分钟内有效，表白发布后超过'+config.postWeibo.count+'个人点赞，就会自动发布到@scuinfo的新浪微博）：');
                    return;
                });

            return;
        }

        request.post(
            {
                url:config.site.url+"/api/postWechat",
                form:{
                    content:"#川大表白#"+((msg.Content.substr(4,1)=="+")?msg.Content.substr(5):msg.Content.substr(4)),
                    secret:1,
                    openId:msg.FromUserName
                }
            },function(e9,r9,b9){

                if(e9){
                    res.reply("服务器好像出了点问题，请重试。");
                    console.log(e9);
                    return;
                }

                try{
                    var result = JSON.parse(b9);
                }catch(e){
                    var result=code.jsonParseError;

                }

                if(result.code==200){
                    var news=[];
                    news[0]={
                        title:'成功表白！',
                        description:'点击查看你的表白，超过'+config.postWeibo.count+'个赞会自动发布在微博@scuinfo',
                        pic:'',
                        url:config.site.url+'/p/'+result.data.insertId
                    };
                    res.reply(news);
                    return;


                }else{
                    res.reply(result.message);
                }

            }
        );

        return;
    }


    if(msg.Content.substr(0,2)=='海螺'){

        if(msg.Content.length==2){

            //content,secret,openId
            conn.query(
                {
                    sql:"insert into wechat_session (openId,createAt,type) values ('"+msg.FromUserName+"',"+common.time()+",2)"
                },function(e,r) {
                    if (e) {
                        console.log(e);
                        res.reply(code.mysqlError.message);
                        return;
                    }
                    //todo 严谨起见还是判断下id好
                    res.reply('接下来请直接写下你要与海螺分享的话（我会帮你加上#海螺#的话题，10分钟内有效）：');
                    return;
                });

            return;
        }

        request.post(
            {
                url:config.site.url+"/api/postWechat",
                form:{
                    content:"#海螺#"+((msg.Content.substr(3,1)=="+")?msg.Content.substr(3):msg.Content.substr(2)),
                    secret:1,
                    openId:msg.FromUserName
                }
            },function(e9,r9,b9){

                if(e9){
                    res.reply("服务器好像出了点问题，请重试。");
                    console.log(e9);
                    return;
                }

                try{
                    var result = JSON.parse(b9);
                }catch(e){
                    var result=code.jsonParseError;

                }

                if(result.code==200){
                    var news=[];
                    news[0]={
                        title:'我已经帮你发布在scuinfo.com了',
                        description:'点击查看你刚刚发布的内容',
                        pic:'',
                        url:config.site.url+'/p/'+result.data.insertId
                    };
                    res.reply(news);
                    return;


                }else{
                    res.reply(result.message);
                }

            }
        );

        return;
    }



    dbs.getWechatContainsText({
        name:msg.Content
    },function(eee,rrrr){
        if(eee){


            dbs.getWechatContainsNews({
                name:msg.Content
            },function(e,r){

                if(e){
                    dbs.getWechatText({
                        name:"default"
                    },function(eee,rrrr){
                        if(eee){
                            res.reply(JSON.stringify(eee));
                            return;
                        }
                        //console.log(rrrr);
                        res.reply(rrrr);

                    });
                    return;
                }
                var news=[];

                for(var i=0;i< r.length;i++){

                    if(r[i].name.split('|').indexOf(msg.Content)>-1){
                        news.push(r[i]);
                    }
                }

                if(news.length>0){
                    res.reply(news);
                }else{
                    dbs.getWechatText({
                        name:"default"
                    },function(eee,rrrr){
                        if(eee){
                            res.reply(JSON.stringify(eee));
                            return;
                        }
                        //console.log(rrrr);
                        res.reply(rrrr);

                    });
                    return;
                }

                return;
            });

            return;

        }
var texts=[];

        for(var i=0;i< r.length;i++){

            if(r[i].name.split('|').indexOf(msg.Content)>-1){
                texts.push(r[i].content);
            }
        }

        if(texts.length>0){
            res.reply(texts.join('\n\n ------'));
            return;
        }else{
            dbs.getWechatText({
                name:"default"
            },function(eee,rrrr){
                if(eee){
                    res.reply(JSON.stringify(eee));
                    return;
                }
                //console.log(rrrr);
                res.reply(rrrr);

            });
            return;
        }
    });

};

/**
 * 记录日志到数据库
 * @param msg
 */
service.log = function(msg){

    conn.query(
        {
            sql:"insert into wechat_log (openId,content,createAt) values ('"+msg.FromUserName+"','"+msg.Content+"',"+common.time()+")"
        },function(e,r){
            console.log(e,'记录日志成功');
        }
    )

};

service.signout = function(msg,req,res,next){

    res.reply('退出当前会话成功');

    service.logout(msg.FromUserName,function(e,r){
//console.log(e,r);
    });
};

/**
 * 退出
 * @param msg
 * @param req
 * @param res
 * @param next
 */
service.logout = function(openId,cb){

    if(!openId){
        cb(code.lackParamsOpenId);
        return;
    }

    cb(null);

    conn.query(
        {
            sql:"delete from wechat_session where openId='"+openId+"'"
        },function(e,r){
//console.log(e,r);
        }
    )

};

module.exports = service;