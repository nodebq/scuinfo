var conn = require('./mysql.js');
var log = {

};

log.wechatNotice = function(o,cb){
    var openId=o.openId;
    var time = o.time;
    var data = typeof o.data == "object"?JSON.stringify(o.data):o.data;
    var type = o.type;
    var callback = typeof o.callback == "object"?JSON.stringify(o.callback):o.callback;
    conn.query(
        {
            sql:"insert into wechat_notice_log (openId,time,data,type,callback) values (:openId,:time,:data,:type,:callback)",
            params:{
                openId,time,data,type,callback
            }
        },function(e,r){
            cb(e,r);
        }
    )
};

module.exports = log;