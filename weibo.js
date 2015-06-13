/**
 微博粉丝服务平台
 */
var express = require('express');
var weibo={};
var crypto = require('crypto');
var router = express.Router();
var app = express();
var config=require('./config.js');
var bodyParser = require('body-parser');
var user=require('./wechat/user.js');
var service= requie('./wechat/service.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

    res.reply = function (content) {
        //
        //{
        //    "result": true,
        //    "receiver_id":123456,
        //    "sender_id":123123,
        //    "type": "text",
        //    "data":"{}"
        //}

        res.writeHead(200);
        // 响应空字符串，用于响应慢的情况，避免微信重试
        if (!content) {
            return res.end('');
        }
        //var json = reply(content, message.ToUserName, message.FromUserName);
        var info = {};
        var type = 'text';

        var data={};
        info.content = content || '';
        if (Array.isArray(content)) {
            type = 'news';

            data.articles=[];
            for(var i=0;i<content.length;i++){
                data.articles[i]={
                    "display_name": content[i].title,
                    "summary": content[i].description,
                    "image":content[i].pic,
                    "url": content[i].url
                }
            }


        } else if (typeof content === 'object') {
            if (content.hasOwnProperty('type')) {
                type = content.type;
                data=content.data;
            } else {
                type = 'position';
                data=content.data;

            }
        }else{
            data.text=content;
        }
        info.type = type;
        info.createTime = new Date().getTime();
        info.receiver_id = req.body.sender_id;
        info.sender_id = req.body.receiver_id;
        info.data=encodeURIComponent(JSON.stringify(data));
        console.log(info);
            res.end(JSON.stringify(info));

    };


    console.log(req.body);
    if(!checkSignature(req.query,config.weibo.appSecret)){
        console.log('not weibo ');
        res.end('not weibo')
        return;
    }

    var message=req.body;



    switch (message.type){

        case 'text':
            message.Content=message.text;
            message.FromUserName=message.sender_id;

            switch(message.Content){
                case '成绩':
                case 'cj':
                    user.score(message,req,res,next);
                    break;
                case '图书':
                    user.book(message,req,res,next);
                    break;
                case '课表':
                    user.major(message,req,res,next);
                    break;
                case '考表':
                    user.exam(message,req,res,next);
                    break;

                case '退出':
                case 'tc':
                    service.signout(message,req,res,next);
                    break;

                default:

                    service.text(message,req,res,next);

                    break;
            }
            break;

        case 'event':
            break;
        case 'mention':
            break;


    }





 });

app.use('/',router);


app.listen(8121,function(){
    console.log('8121');
});