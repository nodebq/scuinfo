var service = {
    name:"公共服务"
};

var dbs = require('../libs/db');

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

module.exports = service;