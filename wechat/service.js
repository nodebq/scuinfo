var service = {
    name:"公共服务"
};

var dbs = require('../libs/db');

service.advise = function(msg,req,res,next){
    dbs.getWechatNews({
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


module.exports = service;