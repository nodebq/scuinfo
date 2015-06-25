var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var profile = require('./controller/profile.js');
var wechatApi= require('./libs/wechatApi.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.set('env','production');
app.use(logger('pro'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('./libs/wechatApi.js');
app.use('/api/updateCallback', function(req,res,next){
        if(req.method=="POST"){
            console.log(req.body);
profile.updateCallbackNews(req,res);
    }else{
        next();
    }
});

app.use('/api/wechat/sendTemplate', function(req,res,next){
        if(req.method=="POST"){
wechatApi.sendTemplate(req,res);
    }else{
        next();
    }
});


app.use('/api/wechat/sendText', function(req,res,next){
    if(req.method=="POST"){
        wechatApi.sendText(req,res);
    }else{
        next();
    }
});

app.use('/api/wechat/sendNews', function(req,res,next){
    if(req.method=="POST"){
        console.log(req.body);
        wechatApi.sendNews(req,res);
    }else{
        next();
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(8120,function(){
    console.log('已监听8120端口'+new Date());
});


module.exports = app;
