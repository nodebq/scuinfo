/**
 微博粉丝服务平台
 */
var express = require('express');
var weibo={};
var crypto = require('crypto');
var router = express.Router();
var app = express();
var config=require('./config.js');
/**
 * 检查签名
 */
var checkSignature = function (query, token) {

    if(!query.signature || !query.timestamp ||!query.nonce ||!token){
        return false;
    }

    var signature = query.signature;
    var timestamp = query.timestamp;
    var nonce = query.nonce;

    var shasum = crypto.createHash('sha1');
    var arr = [token, timestamp, nonce].sort();
    shasum.update(arr.join(''));

    return shasum.digest('hex') === signature;
};


router.get('/weibo',function(req,res,next){
console.log(req.query);
    console.log(config.weibo.appkey);
    if(checkSignature(req.query,config.weibo.appkey)){
        res.end(req.body.echostr);
    }else{
        res.end('0');
    };

});

app.use('/',router);


app.listen(8121,function(){
    console.log('8121');
});