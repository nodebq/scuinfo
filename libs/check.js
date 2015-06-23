var code = require('./code.js');
var common = require('./common.js');
var libs = require('./libs.js');
var conn = require('./mysql.js');
var config =require('../config.js');
var escape = require('escape-html');
var check = {
    name:"检测页"
};
check.isWeixin = function(o){

    var ua = o.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
};


check.autoWechat = function(req,res,next){

    if(req.session) {
        
        //console.log('有session');
        

        if(req.session.userStatus == 'login' || req.session.userStatus =='other' || req.session.userStatus == 'wechatNotFans'){
            next();
        }else if (check.isWeixin(req.headers['user-agent'])) {
                var redirect = encodeURIComponent(req.protocol + "://" + config.host.url + req.originalUrl);
                res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.wechat.appId + '&redirect_uri='+config.site.urlEncode+'%2fauth%2fwechatUserAgent&response_type=code&scope=snsapi_base&state=wechat,' + redirect + '#wechat_redirect')

            } else {

                next();
                req.session.userStatus = 'other'

            }


    }else{


        if (check.isWeixin(req.headers['user-agent'])) {
            
            //console.log('没有session的微信');
            var redirect = encodeURIComponent(req.protocol + "://" + config.host.url + req.originalUrl);
            res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.wechat.appId + '&redirect_uri='+config.site.urlEncode+'%2fauth%2fwechatUserAgent&response_type=code&scope=snsapi_base&state=wechat,' + redirect + '#wechat_redirect')

        } else {
            next();
            req.session.userStatus = 'other'

        }

    }

};

//api验证是否登录
check.isLoginApi = function(req,res,next){
    

    if(req.session.userStatus=='login'){
        next();
    }else{
        res.end(JSON.stringify(code.notLogin));
        return;
    }
};


//api验证是否未登录
check.isNotLoginApi = function(req,res,next){
     if(req.session.userStatus=='login'){
         res.end(JSON.stringify(code.hasLogin));
         return;
     }else{
         next();
     }
};


//验证是否登录
check.isLogin = function(req,res,next){

    if(req.session.userStatus == 'login'){
        next();
    }else{
        res.redirect('/signin?redirect='+encodeURIComponent(req.protocol+"://"+config.host.url+req.originalUrl));
        return;
    }
};


//验证是否未登录
check.isNotLogin = function(req,res,next){
    if(req.session.userStatus == 'login'){
        res.redirect('/?redirect='+encodeURIComponent(req.protocol+"://"+config.host.url+req.originalUrl));
        return;
    }else{
        next();
    }
};

check.isShare = function(req,res,next){

    if(!req.query.userId && req.query.userId!="undefined"){
        res.end(JSON.stringify(code.lackParamsUserId));
        return;
    }


    if(!req.query.type){
        res.end(JSON.stringify(code.lackParamsType));
        return;
    }

    conn.query(
        {
            sql:"select id from secret_share where userId="+req.query.userId+" and type='"+req.query.type+"'"
        },function(e,r){
            if(e){
                console.log(e);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            if(r.length>0){
                next();
            }else{
                res.end(JSON.stringify(code.userNoShare));
                return;
            }
        }
    )

}

/**
 * 提取标题
 * @param o
 */

check.title = function(o){
    if(o.content.length>140){
        var content = o.content.substring(0,140);
        return {
            title:content,
            more:1
        }
    }else{
        return {
            title: o.content,
            more:0
        }
    }


};





/**
 * 检测标签
 * @param o
 * @returns {} or false
 */

/*
check.checkTag = function(o){
    if(!o.content){
        return false;
    }
    var index = o.content.indexOf("#", (o.index>=0)?o.index:0);

    if(index>=0) {
        var nextIndex = o.content.indexOf("#", (index + 2));
        if (nextIndex >= (index + 2)) {

            var name = o.content.substring((index + 1), nextIndex);


            if(name.indexOf(" ")>=0 || name.indexOf("\n")>=0 || name.indexOf("\r")>=0 ||name.indexOf("#")>=0){
                return {
                    nextIndex:nextIndex,
                    content: o.content,
                    code:3002 //非法的#,跳过
                }
            }
            return {
                nextIndex:nextIndex+1,
                content: o.content,
                name:name,
                code:200 //正常

            };
        }
        return false;
    }

    return false;
};*/

/**
 * 组装这个文章里的所有tag
 * @param o
 * @return array []
 */
/*
check.tag = function(o){
    var tags = [];
    //console.log(o);
    var initTag = check.checkTag(o);
    //console.log(initTag);
    if(initTag){
        if(initTag.code==200) {
            tags.push(initTag.name);
        }
        var tag = check.checkTag({
            content: initTag.content.substr(initTag.nextIndex)
        });
        //console.log(tag);

        while(tag){
            if(tag.code==200) {
                tags.push(tag.name);
            }
            if(tag.content.substr(tag.nextIndex)) {
                tag = check.checkTag({
                    content: tag.content.substr(tag.nextIndex)
                });
                //console.log(tag);
            }else{
                tag = false;
                //console.log(tag);
            }
        }

    }
    return tags;
};*/


/**
 * 检测标签
 * @param o
 * @returns {} or false
 */
check.checkTag = function(o){
    if(!o.content){
        return false;
    }
    //console.log(o.content);
    var index = o.content.indexOf("#", (o.index>=0)?o.index:0);
    //console.log(index);
    if(index>=0) {
        var nextIndex = o.content.indexOf("#", (index + 2));

        //console.log('next'+nextIndex);
        if (nextIndex >= (index + 2)) {

            var name = o.content.substring((index + 1), nextIndex);


            if(name.indexOf(" ")>=0 || name.indexOf("\n")>=0 || name.indexOf("\r")>=0 || name.indexOf("#")>=0){
                // console.log(name);
                return {
                    nextIndex:index+1,
                    content: o.content,
                    code:3002 //非法的#,跳过
                }

            }

//console.log(index);
//                console.log(nextIndex+1+ (o.offset? o.offset:0));

            return {
                index:index,
                nextIndex:nextIndex+1,
                content: o.content,
                name:name,
                code:200 //正常

            };
        }
        return false;
    }

    return false;
};

/**
 * 组装这个文章里的所有tag
 * @param o
 * @return array []
 */
check.tag = function(o){
    var tags = [];
    //console.log(o);
    var initTag = check.checkTag(o);
    //console.log(initTag);
    if(initTag){
        if(initTag.code==200) {
            tags.push(initTag.name);
        }
        var tag = check.checkTag({
            content:initTag.content.substr(initTag.nextIndex)});
        //console.log(tag);

        while(tag){
            if(tag.code==200) {
                tags.push(tag.name);
            }
            if(tag.content.substr(tag.nextIndex)) {
                tag = check.checkTag({
                    content: tag.content.substr(tag.nextIndex)
                });
                //console.log(tag);
            }else{
                tag = false;
                //console.log(tag);
            }
        }

    }
    return tags;
};

/**
 * 根据userId和secret生成作者信息
 * @param o
 * @param cb
 */
check.userInfo = function(o){

    if(o.secret){
        return{
                userId: o.session.userId,
                avatar:libs.randomAvatar({
                    gender: o.session.gender
                }),
                nickname:libs.randomNickname(),
                gender: o.session.gender
            };
    }
    return {
        userId: o.session.userId,
        avatar: o.session.avatar?o.session.avatar:libs.randomAvatar({
            gender: o.session.gender
        }),
        nickname: o.session.nickname? o.session.nickname: '用户___'+o.session.userId,
        gender: o.session.gender
    }

};
check.postCreate = function(o,cb){
    
    //console.log(o);
    if(!o.content){
        cb(code.contentCantNull);
        return;
    }

    //判断是否重复content
    var secret=0;
    if(o.secret){
        secret=1;
    }

    o.content=escape(o.content);
    

    var title = check.title({content: o.content});

    var userInfo = check.userInfo({session: o.session,secret:secret});
    
    conn.query({
        sql:"select id from secret_post where content=:content",
        params:{
            content: o.content
        }
    },function(e,r){
        if(e){
            console.log(e);
            cb(code.mysqlError);
            return;
        }

        if(r.length>0){
            cb(code.contentRepeat);
            return;
        }
        
        cb(null,{

            title:title.title,
            content: o.content,
            secret: secret,
            tags: check.tag({content: o.content}),
            more:title.more,
            avatar: userInfo.avatar,
            nickname: userInfo.nickname,
            gender:userInfo.gender,
            userId:userInfo.userId,
            date:common.time()

        });

    });
};


check.register = function(o,cb){
    var tel,nickname,avatar,openId,unionId,gender,source;
    if(!o.tel){
       tel="";
    }else{
        //todo 正则

        tel= o.tel;

    }

    if(!o.source){
        source = "default"
    }else{
        source = o.source
    }
    if(!o.nickname) {
        cb(code.lackParamsNickname);
        return;
    }else{
        nickname= o.nickname;
    }

    if(!o.gender){
        gender=0;
    }else{
        gender= o.gender;
    }
    if(!o.avatar){
        avatar=libs.randomAvatar({
            gender:gender
        });
    }else{
        //todo  正则
        avatar= o.avatar;
    }

    if(!o.openId){
        cb(code.lackParamsOpenId);
        return;
    }else{
        openId= o.openId;
    }

    if(!o.unionId){
        unionId=""
    }else{
        unionId= o.unionId;
    }



    if(!o.redirect){
        redirect = '/';
    }else{
        redirect = o.redirect;
    }


    cb(null,{
        tel:tel,
        date:common.time(),
        nickname: nickname,
        avatar: avatar,
        openId: openId,
        unionId: unionId,
        gender:gender,
        source:source,
        redirect:redirect

    })
};


check.renew = function(o,cb){
//console.log(o);

    if(!o.bookId){
        cb(code.lackParamsBookId);
        return;
    }

    if(!o.borId){
        cb(code.lackParamsBorId);
        return;
    }
    cb(null,o);

}
module.exports = check;