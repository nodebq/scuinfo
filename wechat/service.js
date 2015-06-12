var service = {
    name:"公共服务"
};
var code =require('../libs/code.js');
var common = require('../libs/common.js');
var request = require('request');
var conn= require('../libs/mysql.js');

var dbs = require('../libs/db');


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
    dbs.getWechatText({
        name:"advise"
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

        if(e){
            //没有微信会话
            if(e.code==2041){
                service.noSessionText(msg,req,res,next);
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
                    )

                    break;
                case 1:
                    break;
            }



            return;
        }


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



/**
 * 退出
 * @param msg
 * @param req
 * @param res
 * @param next
 */
service.logout = function(msg,req,res,next){


};

module.exports = service;