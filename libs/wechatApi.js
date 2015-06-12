var API = require('wechat-api');
var fs = require('fs');
var config = require('../config.js');
var code = require('../libs/code.js');
var wechatApi = {

};

var api = new API(config.testWechat.appId,config.testWechat.appSecret, function (callback) {
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


wechatApi.sendTemplate = function(req,res,next){
    if(!req.body.template){
        res.end(JSON.stringify(code.lackParamsTemplate));
        return;
    }

    if(!req.body.first){
        res.end(JSON.stringify(code.lackParamsFirst));
        return;
    }


    var template={
        'test':"KLL80FIDc-_dBn8LWfEPcGKZ_cSD61XD_r609NgSibo",
        'fail':"h6_3AlkcPkGiHE6p53lxxoOi1FE2aRJEwhYUJElCzLM",
        'ok':"E1TnaxC7jfkt6QJ_ou49xVJZAccLUqCkLb_Ev5Yyn98"
    };

    var templateId=req.body.template?template[req.body.template]:'KLL80FIDc-_dBn8LWfEPcGKZ_cSD61XD_r609NgSibo';
// URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
    var url= req.body.url?req.body.url:(config.site.url+'/u');
    var topColor = req.body.color?req.body.color:'#FF0000'; // 顶部颜色


    var data = {
        first:{
            "value":req.body.first,
            "color":"#173177"
        },
        remark:{
            "value":req.body.remark,
            "color":"#173177"
        }
    };
    switch(req.body.template){
        case 'ok':
            data.keyword1={
                "value":req.body.keyword1,
                "color":"#173177"
            };
            data.keyword2={
                "value":req.body.keyword2,
                "color":"#173177"
            };
            data.keyword3={
                "value":req.body.keyword3,
                "color":"#173177"
            };
            break;
        case 'fail':
            data.keyword1={
                "value":req.body.keyword1,
                "color":"#173177"
            };
            data.keyword2={
                "value":req.body.keyword2,
                "color":"#173177"
            };
            data.keyword3={
                "value":req.body.keyword3,
                "color":"#173177"
            };
            data.keyword4={
                "value":req.body.keyword4,
                "color":"#173177"
            };
            break;

        case 'test':
            break;
    }
    //console.log(data);
    api.sendTemplate(req.body.openId, templateId, url, topColor, data, function(e,r){
        if(r){
            console.log(r);
            if(r.errcode==0){
                res.end(JSON.stringify({
                    code:200,
                    message:JSON.stringify(r)
                }));
                return;
            }else{
                res.end(JSON.stringify({
                    code:code.wechatError,
                    message:JSON.stringify(r)
                }));
                return;
            }
        }
    });


};

/**
 * 创建菜单
 */
wechatApi.createMenu = function(){
var menu1 ={
    "button":[
        {
        "name":"服务",
        "sub_button":[
            {type:"view",
                "name":"历史消息",
                "url":"http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MjM5NDM4NDU2MA==#wechat_webview_type=1&wechat_redirect"

            },
            {   type:"view",
                "name":"神奇海螺",
                "url":"http://music.163.com/radio?id=1136006"

            },
            {
                type:"view",
                "name":"跳蚤市场",
                "url":"http://xiaoqu.qq.com/mobile/barindex.html?_bid=128&_wv=1027&bid=130899"
            },
            {
                type:"click",
                "name":"合作建议",
                "key":"advise"
            }

            /*
        {
            "type":"click",
            "name":"川大新闻",
            "key":"news"
        },
        {
            "type":"click",
            "name":"川大讲座",
            "key":"lecture"
        },
            {

                "type":"click",
                "name":"川大就业",
                "key":"jobs"
            }
            */
        ]
        },
        {
            "type":"view",
            "name":"scuinfo",
            "url":"http://scuinfo.com"
        },
        {
            "name":"我的",
            "sub_button":[
                /*
                {
                    "type":"click",
                    "name":" 消息中心 ",
                    "key":"notice"
                },
                */
                {
                    "type":"click",
                    "name":" 成绩查询 ",
                    "key":"score"
                },
                {
                    "type":"click",
                    "name":"考表查询",
                    "key":"exam"
                },
                {
                    "type":"click",
                    "name":" 图书借阅 ",
                    "key":"book"
                },
                {
                    "type":"click",
                    "name":" 课表查询 ",
                    "key":"major"
                },
                {
                    "type":"view",
                    "name":"我的主页 ",
                    "url":"http://scuinfo.com/u"
                }

            ]
        }]
};

    var menu={
        "button":[

            {
                "type":"view",
                "name":"神奇海螺",
                "url":"http://music.163.com/program/10000101/60153606/"
            },
            {
                "type":"view",
                "name":"scuinfo",
                "url":"http://fm.scuinfo.com"
            }
            ]
    }


console.log('start');
api.createMenu(menu1,function(e,r){
console.log(e,r);

});

};

/**
 * 创建菜单
 */
//wechatApi.createMenu();

/**
 * 获取菜单
 * @type {{}}
 */

//api.getMenu(function(e,r){
//console.log(e,r);
//});

/**
 * 发送模板消息
 */
//wechatApi.sendTemplate({
//    body:{
//     template:"ok",
//        first:"你刚刚提交的成绩查询已成功",
//        keyword1:'2012141442029',
//        keyword2:'成绩',
//        keyword3:"2012年3月5号",
//        remark:"点击查看详情"
//    }
//});


module.exports = wechatApi;