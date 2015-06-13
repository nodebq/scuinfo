var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var wechat = require('wechat');
var user = require('./wechat/user.js');
var config = require('./config.js');
var service = require('./wechat/service.js');
var app = express();
var router = express.Router();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.set('env','production');
//app.use(logger('pro'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var config = {
    token: config.wechat.token,
    appid: config.wechat.appId,
    encodingAESKey: "TYt123ywezOYOAQqlKPOPsx29GJ6RuwYB6GTjSjJ1ZP"
};

app.use('/wechat', wechat(config, wechat.text(function (message, req, res, next) {
    // message为文本内容
    // { ToUserName: 'gh_d3e07d51b513',
    // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
    // CreateTime: '1359125035',
    // MsgType: 'text',
    // Content: 'http',
    // MsgId: '5837397576500011341' }

    switch(message.Content){

        case '成绩':
        case 'cj':
        case '我的成绩':
        case 'score':
            user.score(message,req,res,next);
            break;
        case 'book':
        case '我的图书':
        case '图书':
            user.book(message,req,res,next);
            break;
        case '课单':
        case 'major':
        case '课表':
            user.major(message,req,res,next);
            break;
        case '考表':
        case '考试':
        case 'exam':
        case '我的考表':

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
}).image(function (message, req, res, next) {
    // message为图片内容
    // { ToUserName: 'gh_d3e07d51b513',
    // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
    // CreateTime: '1359124971',
    // MsgType: 'image',
    // PicUrl: 'http://mmsns.qpic.cn/mmsns/bfc815ygvIWcaaZlEXJV7NzhmA3Y2fc4eBOxLjpPI60Q1Q6ibYicwg/0',
    // MediaId: 'media_id',
    // MsgId: '5837397301622104395' }
    res.reply("收到");
}).voice(function (message, req, res, next) {
    // message为音频内容
    // { ToUserName: 'gh_d3e07d51b513',
    // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
    // CreateTime: '1359125022',
    // MsgType: 'voice',
    // MediaId: 'OMYnpghh8fRfzHL8obuboDN9rmLig4s0xdpoNT6a5BoFZWufbE6srbCKc_bxduzS',
    // Format: 'amr',
    // MsgId: '5837397520665436492' }

    res.reply("收到");
}).video(function (message, req, res, next) {
    // message为视频内容
    // { ToUserName: 'gh_d3e07d51b513',
    // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
    // CreateTime: '1359125022',
    // MsgType: 'video',
    // MediaId: 'OMYnpghh8fRfzHL8obuboDN9rmLig4s0xdpoNT6a5BoFZWufbE6srbCKc_bxduzS',
    // ThumbMediaId: 'media_id',
    // MsgId: '5837397520665436492' }
    res.reply("收到");

}).location(function (message, req, res, next) {
    // message为位置内容
    // { ToUserName: 'gh_d3e07d51b513',
    // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
    // CreateTime: '1359125311',
    // MsgType: 'location',
    // Location_X: '30.283950',
    // Location_Y: '120.063139',
    // Scale: '15',
    // Label: {},
    // MsgId: '5837398761910985062' }
    res.reply("收到");

}).link(function (message, req, res, next) {
    // message为链接内容
    // { ToUserName: 'gh_d3e07d51b513',
    // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
    // CreateTime: '1359125022',
    // MsgType: 'link',
    // Title: '公众平台官网链接',
    // Description: '公众平台官网链接',
    // Url: 'http://1024.com/',
    // MsgId: '5837397520665436492' }
    res.reply("收到");

}).event(function (message, req, res, next) {
    // message为事件内容
    // { ToUserName: 'gh_d3e07d51b513',
    // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
    // CreateTime: '1359125022',
    // MsgType: 'event',
    // Event: 'LOCATION',
    // Latitude: '23.137466',
    // Longitude: '113.352425',
    // Precision: '119.385040',
    // MsgId: '5837397520665436492' }
    //console.log(message);
    //
    switch(message.Event){

        case 'CLICK' :
            switch(message.EventKey){

                case 'score':
                    user.score(message,req,res,next);
                    break;
                case 'book':
                    user.book(message,req,res,next);
                    break;
                case 'major':
                    user.major(message,req,res,next);
                    break;

                case 'exam':
                    user.exam(message,req,res,next);
                    break;
                case 'advise':
                    service.advise(message,req,res,next);
                    break;
                case 'post':
                    service.post(message,req,res,next);
                    break;
                case 'fm':
                    service.fm(message,req,res,next);

                    break;
            }

            break;
        case 'view' :

            break;

        case 'subscribe':
            service.subscribe(message,req,res,next);
            break;

        default:
            res.reply("");
            break;


    }
    
    
    
    
})));




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function(err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(8119,function(){
    console.log('已监听8119端口');
});


module.exports = app;
