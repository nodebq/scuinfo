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
//console.log(query);
    if(!query.signature || !query.timestamp ||!query.nonce ||!token){
        //console.log('1');
        return false;
    }

    var signature = query.signature;
    var timestamp = query.timestamp;
    var nonce = query.nonce;

    var shasum = crypto.createHash('sha1');
    var arr = [token, timestamp, nonce].sort();
    
    //console.log(arr.join(''));
    shasum.update(arr.join(''));
//console.log(shasum.digest('hex'));
    
    return shasum.digest('hex') === signature;
    //return true;
};


router.get('/weibo',function(req,res,next){
    if(checkSignature(req.query,config.weibo.appSecret)){
        res.end(req.query.echostr);
    }else{
        res.end('0');
    };

});

router.post('/weibo',function(req,res,next){
    if(!checkSignature(req.body,config.weibo.appSecret)){
        console.log('not weibo ');
        res.end('not weibo')
        return;
    }
    });

app.use('/',router);


app.listen(8121,function(){
    console.log('8121');
});