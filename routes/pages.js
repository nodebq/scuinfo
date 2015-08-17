var datas = require('../libs/datas.js');
var config = require('../config.js');
var check =require('../libs/check.js');
var API =require('wechat-api');
var fs= require('fs');
var code= require('../libs/code.js');
var conn= require('../libs/mysql.js');
var pages = {
    name:"页面"
};


var api = new API(config.wechat.appId,config.wechat.appSecret, function (callback) {
    // 传入一个获取全局token的方法
    fs.readFile('./token/access_token.txt', 'utf8', function (err, txt) {
        //console.log(err,txt);//return;
        if (err) {return callback(err);}
        callback(null, JSON.parse(txt));
    });
}, function (token, callback) {
    // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
    // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
    fs.writeFile('./token/access_token.txt', JSON.stringify(token), callback);
});
api.registerTicketHandle(function (type, callback) {
        //console.log(type);

        // 传入一个获取全局ticket的方法
        fs.readFile('./token/ticketToken.txt', 'utf8', function (err, txt) {
            console.log(txt);console.log('read');
            //console.log(err,txt);//return;
            if (err) {return callback(err);}
            callback(null, JSON.parse(txt));
        });
    }, function (type, _ticketToken, callback) {
        console.log(type,_ticketToken);console.log('write');

        fs.writeFile('./token/ticketToken.txt', JSON.stringify(_ticketToken), function(err){
            if(err) return callack(err);
            callback(null)
        });

    }
);

// getTicketToken

pages.index = function(req,res){

    res.header('Cache-Control','public');
    var url = req.protocol+"://"+config.host.url+req.originalUrl;

//console.log(url);
    var param = {
        url: url
    };
    api.getJsConfig(param, function(e,wechatJs){


        if(e){
            res.end(JSON.stringify(code.getWechatTicketError))
            return;
        }
        res.render('index',{
            title:config.site.name,
            barTitle:"首页",
            timestamp:parseInt(new Date()/1000),
            wechatJs:wechatJs,
            weibo:{
                appKey:config.weibo.appkey,
                uid:config.weibo.uid
            },
            userId:req.session.userId,
            page:{
                type:"index",
                userId:req.session.userId,
                avatar:req.session.avatar,
                nickname:req.session.nickname,
                gender:req.session.gender,
                userStatus:req.session.userStatus,
                url:url
            }});
    });

// saveTicketToken


};



pages.tag = function(req,res){
    //console.log(parseInt(new Date()/1000));
    res.header('Cache-Control','public');
    var url = req.protocol+"://"+config.host.url+req.originalUrl;
    var param = {
        url: url
    };
    api.getJsConfig(param, function(e,wechatJs) {


        if (e) {
            res.end(JSON.stringify(code.getWechatTicketError))
            return;
        }
        res.render('index', {

            title: req.params.name + config.site.separator + config.site.name,
            barTitle: "话题",
            timestamp: parseInt(new Date() / 1000),
            wechatJs: wechatJs,
            weibo: {
                appKey: config.weibo.appkey,
                uid: config.weibo.uid
            },
            userId: req.session.userId,
            page: {
                type: "tag",
                name: req.params.name,
                userId: req.session.userId,
                avatar: req.session.avatar,
                nickname: req.session.nickname,
                gender: req.session.gender,
                userStatus: req.session.userStatus,
                url: url,
                postContent: req.params.name ? "%23" + req.params.name + "%23" : ""

            }
        });
    });
};

pages.like = function(req,res){
    //console.log(parseInt(new Date()/1000));
    res.header('Cache-Control','public');
    var url = req.protocol+"://"+config.host.url+req.originalUrl;
    var param = {
        url: url
    };
    api.getJsConfig(param, function(e,wechatJs) {


        if (e) {
            res.end(JSON.stringify(code.getWechatTicketError))
            return;
        }
        res.render('index', {
            title: '赞过的帖子' + config.site.separator + config.site.name,
            timestamp: parseInt(new Date() / 1000),
            wechatJs: wechatJs,
            weibo: {
                appKey: config.weibo.appkey,
                uid: config.weibo.uid
            },
            barTitle: "赞过",
            userId: req.session.userId,
            page: {
                type: "like",
                userId: req.params.userId ? req.params.userId : 0,
                avatar: req.session.avatar,
                nickname: req.session.nickname,
                gender: req.session.gender,
                userStatus: req.session.userStatus,
                url: url

            }
        });
    });
};

pages.profilePosts = function(req,res){
    //console.log(parseInt(new Date()/1000));
    res.header('Cache-Control','public');
    var url = req.protocol+"://"+config.host.url+req.originalUrl;
    var param = {
        url: url
    };
    api.getJsConfig(param, function(e,wechatJs) {


        if (e) {
            res.end(JSON.stringify(code.getWechatTicketError))
            return;
        }
        //console.log(wechatJs);
        res.render('index', {
            title: "发布的文章" + config.site.separator + config.site.name,
            timestamp: parseInt(new Date() / 1000),
            wechatJs: wechatJs,
            weibo: {
                appKey: config.weibo.appkey,
                uid: config.weibo.uid
            },
            barTitle: "发过",
            userId: req.session.userId,
            page: {
                type: "profilePosts",
                userId: req.params.userId ? req.params.userId : 0,
                avatar: req.session.avatar,
                nickname: req.session.nickname,
                gender: req.session.gender,
                userStatus: req.session.userStatus,
                url: url


            }
        });
    });
};
pages.detail = function(req,res){
    //console.log(parseInt(new Date()/1000));
    res.header('Cache-Control','public');
    var url = req.protocol+"://"+config.host.url+req.originalUrl;
    var param = {
        url: url
    };
    api.getJsConfig(param, function(e,wechatJs) {


        if (e) {
            res.end(JSON.stringify(code.getWechatTicketError))
            return;
        }
        res.render('detail', {
            title: '帖子详情' + config.site.separator + config.site.name,
            timestamp: parseInt(new Date() / 1000),
            wechatJs: wechatJs,
            barTitle: "详情",
            weibo: {
                appKey: config.weibo.appkey,
                uid: config.weibo.uid
            }, id: req.params.id,
            userId: req.session.userId,
            page: {
                type: 'detail',
                userId: req.session.userId,
                avatar: req.session.avatar,
                nickname: req.session.nickname,
                gender: req.session.gender,
                userStatus: req.session.userStatus,
                url: url,
                postId:req.params.id

            }
        });
    });
};

pages.profile = function(req,res){
    var url = req.protocol+"://"+config.host.url+req.originalUrl;
  res.render('profile',{title:"主页"+config.site.separator+config.site.name,
      userId:req.session.userId,
      barTitle:"主页",

      page:{
      userId:req.params.id?req.params.id:req.session.userId,
      avatar:req.session.avatar,
      nickname:req.session.nickname,
      gender:req.session.gender,
      userStatus:req.session.userStatus,
      url:url,
      type:"profile"

  }})
};

pages.score = function(req,res){
    var url = req.protocol+"://"+config.host.url+req.originalUrl;
    res.render('score',{title:"成绩"+config.site.separator+config.site.name,
        userId:req.session.userId,
        barTitle:"成绩",
        page:{
            avatar:req.session.avatar,
            nickname:req.session.nickname,
            gender:req.session.gender,
            userStatus:req.session.userStatus,
            url:url,
            type:"score"

        }})

};



pages.classroom = function(req,res){
    var url = req.protocol+"://"+config.host.url+req.originalUrl;
    res.render('classroom',{title:"空闲教室"+config.site.separator+config.site.name,
        userId:req.session.userId,
        barTitle:"教室",
        page:{
            avatar:req.session.avatar,
            nickname:req.session.nickname,
            gender:req.session.gender,
            userStatus:req.session.userStatus,
            url:url,
            type:"classroom"

        }})

};
pages.major = function(req,res){
    var url = req.protocol+"://"+config.host.url+req.originalUrl;

    var param = {
        url: url
    };
    api.getJsConfig(param, function(e,wechatJs) {


        if (e) {
            res.end(JSON.stringify(code.getWechatTicketError))
            return;
        }
        res.render('major', {
            title: '课表' + config.site.separator + config.site.name,
            barTitle:"课表",
            timestamp: parseInt(new Date() / 1000),
            wechatJs: wechatJs,
            weibo: {
                appKey: config.weibo.appkey,
                uid: config.weibo.uid
            },
            userId: req.session.userId,
            page: {
                type: 'major',
                userId: req.session.userId,
                avatar: req.session.avatar,
                nickname: req.session.nickname,
                gender: req.session.gender,
                userStatus: req.session.userStatus,
                url: url

            }
        });
    });


};
pages.shareBook = function(req,res){
    //console.log(req.session);
    var url = req.protocol+"://"+config.host.url+req.originalUrl;
    var param = {
        url: url
    };
    api.getJsConfig(param, function(e,wechatJs) {

        if (e) {
            res.end(JSON.stringify(code.getWechatTicketError))
            return;
        }
        res.render('shareBook', {
            title: '书单' + config.site.separator + config.site.name,
            timestamp: parseInt(new Date() / 1000),
            wechatJs: wechatJs,
            barTitle: "书单",
            weibo: {
                appKey: config.weibo.appkey,
                uid: config.weibo.uid
            }, id: req.params.id,
            userId: req.session.userId,
            page: {
                avatar: req.session.avatar,
                nickname: req.session.nickname,
                gender: req.session.gender,
                userStatus: req.session.userStatus,
                userId:req.query.userId?req.query.userId:0,
                type: 'book',
                url: url

            }
        });
    });


};

pages.shareMajor = function(req,res){
    //console.log(req.session);
    var url = req.protocol+"://"+config.host.url+req.originalUrl;
    var param = {
        url: url
    };
    api.getJsConfig(param, function(e,wechatJs) {

        if (e) {
            res.end(JSON.stringify(code.getWechatTicketError))
            return;
        }
        res.render('shareMajor', {
            title: '课单' + config.site.separator + config.site.name,
            timestamp: parseInt(new Date() / 1000),
            wechatJs: wechatJs,
            barTitle: "课单",
            weibo: {
                appKey: config.weibo.appkey,
                uid: config.weibo.uid
            }, id: req.params.id,
            userId: req.session.userId,
            page: {
                avatar: req.session.avatar,
                nickname: req.session.nickname,
                gender: req.session.gender,
                userStatus: req.session.userStatus,
                userId:req.query.userId?req.query.userId:0,
                type: 'major',
                url: url

            }
        });
    });


};

pages.shareExam = function(req,res){
    //console.log(req.session);
    var url = req.protocol+"://"+config.host.url+req.originalUrl;
    var param = {
        url: url
    };
    api.getJsConfig(param, function(e,wechatJs) {

        if (e) {
            res.end(JSON.stringify(code.getWechatTicketError))
            return;
        }
        res.render('shareExam', {
            title: '考表' + config.site.separator + config.site.name,
            timestamp: parseInt(new Date() / 1000),
            wechatJs: wechatJs,
            barTitle: "考表",
            weibo: {
                appKey: config.weibo.appkey,
                uid: config.weibo.uid
            }, id: req.params.id,
            userId: req.session.userId,
            page: {
                avatar: req.session.avatar,
                nickname: req.session.nickname,
                gender: req.session.gender,
                userStatus: req.session.userStatus,
                userId:req.query.userId?req.query.userId:0,
                type: 'exam',
                url: url

            }
        });
    });


};


pages.book = function(req,res){
    var url = req.protocol+"://"+config.host.url+req.originalUrl;
    var param = {
        url: url
    };
    api.getJsConfig(param, function(e,wechatJs) {


        if (e) {
            res.end(JSON.stringify(code.getWechatTicketError))
            return;
        }
        res.render('book', {
            title: '我借的图书' + config.site.separator + config.site.name,
            timestamp: parseInt(new Date() / 1000),
            wechatJs: wechatJs,
            barTitle: "详情",
            weibo: {
                appKey: config.weibo.appkey,
                uid: config.weibo.uid
            }, id: req.params.id,
            userId: req.session.userId,
            page: {
                type: 'book',
                userId: req.session.userId,
                avatar: req.session.avatar,
                nickname: req.session.nickname,
                gender: req.session.gender,
                userStatus: req.session.userStatus,
                url: url

            }
        });
    });


};
pages.post = function(req,res){
    var url = req.protocol+"://"+config.host.url+req.originalUrl;
    res.render('post',{title:"写一篇新帖子"+config.site.separator+config.site.name,
        userId:req.session.userId,
        barTitle:"发布",
        page:{
        userId:req.session.userId,
        avatar:req.session.avatar,
        nickname:req.session.nickname,
        gender:req.session.gender,
        content:req.query.content?req.query.content:"",
        userStatus:req.session.userStatus,
        url:url

    }});
};

pages.fm = function(req,res){
    var url = req.protocol+"://"+config.host.url+req.originalUrl;
    var param = {
        url: url
    };
    api.getJsConfig(param, function(e,wechatJs) {


        if (e) {
            res.end(JSON.stringify(code.getWechatTicketError))
            return;
        }
        res.render('fm', {
            title: "神奇海螺电台" + config.site.separator + config.site.name,
            userId: req.session.userId,
            barTitle: "海螺",
            wechatJs: wechatJs,
            page: {
                postContent: encodeURIComponent("#海螺#"),
                userId: req.session.userId,
                avatar: req.session.avatar,
                nickname: req.session.nickname,
                gender: req.session.gender,
                userStatus: req.session.userStatus,
                url: url

            }
        });
    });
};

pages.signin = function(req,res){

    res.render('signin',{title:"登录"+config.site.separator+config.site.name,
        barTitle:"登录",

        page:{
        redirect:req.query.redirect?req.query.redirect:"",
        wechatUserAgent:check.isWeixin(req.headers['user-agent'])
    }});
};

pages.notice = function(req,res){
    var url = req.protocol+"://"+config.host.url+req.originalUrl;

    res.render('notice',{title:"通知"+config.site.separator+config.site.name,
        barTitle:"通知",

        userId:req.session.userId,
        page:{
        userId:req.session.userId,
        avatar:req.session.avatar,
        nickname:req.session.nickname,
        gender:req.session.gender,
        userStatus:req.session.userStatus,
        url:url

    }});
};
pages.bindDean = function(req,res){
var url = "";

    conn.query(
        {
            sql:"select studentId,password from secret_account where userId="+req.session.userId+" order by id desc"
        },function(e,r){
            if(e){
                console.log(e);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            var studentId,password;
            if(r.length>0){
                    studentId=r[0].studentId,
                    password=r[0].password
            }else{
                studentId="",
                    password=""
            }
            res.render('bind',{
                title:"绑定到四川大学教务处",
                barTitle:"绑定",
                userId:req.session.userId,
                page:{
                    inputType:"number",
                    userId:req.session.userId,
                    avatar:req.session.avatar,
                    nickname:req.session.nickname,
                    gender:req.session.gender,
                    userStatus:req.session.userStatus,
                    url:url,
                    idName:"学号",
                    idPlaceholder:"仅支持绑定四川大学本科学号",
                    passwordPlaceholder:"教务处密码",
                    type:"dean",
                    idValue:studentId,
                    passwordValue:password
                }
            });
        }
    )


};

pages.bindBook = function(req,res){
    conn.query(
        {
            sql:"select studentId,password from secret_library where userId="+req.session.userId+" order by id desc"
        },function(e,r) {
            if (e) {
                console.log(e);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            var studentId, password;
            if (r.length > 0) {
                studentId = r[0].studentId,
                    password = r[0].password
            } else {
                studentId = "",
                    password = ""
            }
            var url = "";
            res.render('bind', {
                title: "绑定到四川大学图书馆",
                barTitle: "绑定",
                userId: req.session.userId,
                page: {
                    inputType: "text",
                    userId: req.session.userId,
                    avatar: req.session.avatar,
                    nickname: req.session.nickname,
                    gender: req.session.gender,
                    userStatus: req.session.userStatus,
                    url: url,
                    idName: "图书馆帐号",
                    idPlaceholder: "输入四川大学图书馆帐号",
                    passwordPlaceholder: "图书馆密码",
                    type: "library",
                    idValue:studentId,
                    passwordValue:password
                }
            });
        });
};

pages.exam = function(req,res){
    var url = req.protocol+"://"+config.host.url+req.originalUrl;

    var param = {
        url: url
    };
    api.getJsConfig(param, function(e,wechatJs) {


        if (e) {
            res.end(JSON.stringify(code.getWechatTicketError))
            return;
        }
        res.render('exam', {
            title: '考表' + config.site.separator + config.site.name,
            barTitle:"考表",
            timestamp: parseInt(new Date() / 1000),
            wechatJs: wechatJs,
            weibo: {
                appKey: config.weibo.appkey,
                uid: config.weibo.uid
            },
            userId: req.session.userId,
            page: {
                type: 'exam',
                userId: req.session.userId,
                avatar: req.session.avatar,
                nickname: req.session.nickname,
                gender: req.session.gender,
                userStatus: req.session.userStatus,
                url: url

            }
        });
    });


};


module.exports = pages;