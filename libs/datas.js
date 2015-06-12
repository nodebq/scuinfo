var conn = require('./mysql.js');
var request = require('request');
var config = require('../config.js');
var common = require('./common.js');
var code = require('./code.js');
var datas ={
    name:"全局数据"
};
datas.tag ={};
datas.tagById = {};

datas.wechat = {
    accessToken:"31_xP_AynU8FZlH_HwvHIQtANP2eUqoYPzYgukzU8A1mnHU1YtP139CufRVV-Gt152D0fYnH7ht5Ha0LCW21TOsxPZ0JpbT3RIiNCR_ekoQ",
    tokenExpire:1430562806,
    jsApiTicket:"bxLdikRXVbTPdHSM05e5uwhOuGlZ_VPDVTIqk9gYjaIjpomRjAiL5mocHScqNxwGZqMnBxxxgqCcmPl9DDxgRw",
    ticketExpire:1430562808

};


datas.updateTag = function(cb){
conn.query(
    {
        sql:"select `id`,`name` from secret_tag"
    },function(e,r){
        if(e){
            cb(code.mysqlError);
            console.log(e);
            return;
        }
        for(var i=0;i< r.length;i++){
            datas.tag[r[i].name] = r[i].id;
            datas.tagById[r[i].id] = r[i].name;
        }
        console.log('tag载入完成');
        console.log(datas.tag);
        cb(null);
    }
)
};



datas.updateWechatToken = function(cb){

    request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.wechat.appId+'&secret='+config.wechat.appSecret,function(e,r){

        if(e){
            console.log(e);
            cb(e);
            return;
        }
        try{
            var result = JSON.parse(r.body);
        }catch(e){
            var result = {
                "errcode":2005,
                "errmsg":"json解析错误"
            }
        }

        if(result.errcode){
            cb({
                code:result.errcode,
                message:result.message
            });
            console.log(result);

            return;
        }


        datas.wechat.accessToken = result.access_token;
        datas.wechat.tokenExpire = parseInt(result.expires_in)+common.time();
        console.log(datas.wechat);
        console.log('wechat accessToken load');
        cb(null, result);
    });
};

datas.updateWechatJsApiTicket = function(cb){

    if(datas.wechat.accessToken && datas.wechat.tokenExpire >common.time()){
        request(
            'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+datas.wechat.accessToken+'&type=jsapi',function(e,r){
                if(e){
                    cb(code.requestError);
                    console.log(e);
                    return;
                }
                try{
                    var result = JSON.parse(r.body);
                }catch(e){
                    var result = {
                        "errcode":2005,
                        "errmsg":"json解析错误"
                    }
                }

                if(result.errcode!=0){
                    cb({
                        code:result.errcode,
                        message:result.message
                    });
                    console.log(result);

                    return;
                }

                datas.wechat.jsApiTicket = result.ticket;
                datas.wechat.ticketExpire = parseInt(result.expires_in)+common.time();
                console.log(datas.wechat);
                console.log('wechat jsApiTicket load');
                cb(null, result);

            }
        )
    }else{
        cb(code.notLoadWechatToken);
        return;
    }

};

datas.updateWechatToken(function(e,r){
    if(e){
        return;
    }
    var expire = (parseInt(r.expires_in)-180)*1000;
    setTimeout(function(){
    datas.updateWechatToken(function(e,r){
       if(e){
           return;
       }
        expire = (parseInt(r.expires_in)-180)*1000;
    });
    }, expire)
});

//
//setTimeout(function(){
//datas.updateWechatJsApiTicket(function(e,r){
//    if(e){
//        return;
//    }
//    var expire = (parseInt(r.expires_in)-180)*1000;
//    setTimeout(function(){
//        datas.updateWechatJsApiTicket(function(e,r){
//            if(e){
//                return;
//            }
//            expire = (parseInt(r.expires_in)-180)*1000;
//        });
//    }, expire)
//});
//},2000);


datas.updateTag(function(e){

});

module.exports = datas;