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
var service= require('./wechat/service.js');
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
        //
        //{ content: '收到。',
        //    result: true,
        //    type: 'text',
        //    receiver_id: 2786119320,
        //    sender_id: 3656973697,
        //    data: '%7B%22text%22%3A%22%E6%94%B6%E5%88%B0%E3%80%82%22%7D' }

        res.writeHead(200);
        // 响应空字符串，用于响应慢的情况，避免微信重试
        if (!content) {
            return res.end('');
        }
        //var json = reply(content, message.ToUserName, message.FromUserName);
        var info = {};
        var type = 'text';

        var data={};
        if (Array.isArray(content)) {
            type = 'articles';

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
        info.result=true;
        info.type = type;
        info.receiver_id = req.body.sender_id;
        info.sender_id = req.body.receiver_id;
        info.data=encodeURIComponent(JSON.stringify(data));
        console.log(info);

        console.log(JSON.stringify(info));
            res.end(JSON.stringify(info));

    };


    console.log(req.body);
    if(!checkSignature(req.query,config.weibo.appSecret)){
        console.log('not weibo ');
        res.end('not weibo')
        return;
    }

    var message=req.body;

    message.source="weibo";

    message.FromUserName=message.sender_id;


    switch (message.type){

        case 'text':
            message.Content=message.text;

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

            switch (message.data.subtype) {

                case 'subscribe':
                    service.subscribe(message,req,res,next);
                    break;

                case 'click':

                switch(message.data.key)
                {


                case
                    'score'
                :
                    user.score(message, req, res, next);
                    break;
                case
                    'book'
                :
                    user.book(message, req, res, next);
                    break;
                case
                    'major'
                :
                    user.major(message, req, res, next);
                    break;

                case
                    'exam'
                :
                    user.exam(message, req, res, next);
                    break;
                case
                    'advise'
                :
                    service.advise(message, req, res, next);
                    break;
                case
                    'post'
                :
                    service.post(message, req, res, next);
                    break;
                case
                    'fm'
                :
                    service.fm(message, req, res, next);

                    break;

                    case
                    'love'
                    :
                        service.love(message, req, res, next);

                        break;

                }
            }


            break;
        case 'mention':
        //
        //{
        //    "type": "mention",
        //    "receiver_id": 1902538057,
        //    "sender_id": 2489518277,
        //    "created_at": "Mon Jul 16 18:09:20 +0800 2012",
        //    "text": "被@的微博或评论文本信息",
        //    "data": {
        //    "subtype": "MENTION_TYPE,
        //    "key": "MENTION_KEY"
        //}
        //}
            console.log(message.text.replace("@scuinfo",""));
            
            console.log(message.text.replace("@scuinfo","").trim());
            message.Content=message.text.replace("@scuinfo","").trim();

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
            }



            break;


    }





 });

app.use('/',router);


app.listen(8121,function(){
    console.log('8121');
});