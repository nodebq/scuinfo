
/**
 * Created by GuobaoYang on 15/3/8.
 */
var config = {
    urls:{
        wechatSendTemplate:"http://localhost:8120/api/wechat/sendTemplate"
    },

    api:{
        baseUrl:"http://localhost:9231",
        appId:10000,
        appSecret:'scuinfo'
    },

    mysql:{
        'host':"127.0.0.1",
        'user':"root",
        password:"123456",
        database:"secret"
    },
    /*
     mysql:{
     'host':'127.0.0.1',
     'user':'dsgygb_secret',
     'password':'safsdafsdalkerdsgyssabqdfs',
     'database':'secret'
     },
     */
    /**
     *      * 正式的id和key，请勿必不要在测试环境下使用
     *           */

    wechat:{
        'appId':"wx64902e8505feae7f",
        'appSecret':"929d3f4fa7f4efc793968e1717727608"
    },

    /**
     * sichuanuniversity
     */
    sichuanUniversityWechat:{
        'appId':"wx732e638223b26007",
        'appSecret':"d756322a302e865e1a23f2eeaa4181c7",
        'token':"scuinfo",
        "encodingAESKey":"0Ooj6QAVmYb12ZRI9sansV4F4CXIdYmnGUTYCfNbk2G"
    },

    testWechat:{
        'appId':"wx65f95de25e8b320b",
        'appSecret':"5302afc82919e5e9583dcfddd9c572bf",
        'token':"scuinfoWechat"
    },

    /**
     *      * 测试用的id和key，
     *           */
    /*
     wechat:{
     'appId':"wx3d6f3fcc7cdd49eb",
     'appSecret':"61902d1d1c4dc894dc0437c24d8f9550"
     },
     */


    wechatWeb:{
        'appId':"wx8f8d7578a5a3023b",
        'appSecret':"94a563f3d442d4d0af88609260eb42ec"
    },
    host:{
        url:"fm.scuinfo.com"
    },

    weibo:{
        'appkey':"1159008171",
        'uid':"3656973697",
        'appSecret':'abe077b7bfd949ecf5906a2ce50211eb'

    },

    site:{
        name:"scuinfo",
        separator:' - ',
        url:"http://fm.scuinfo.com"
    },
    week:{
        '7':"周日",
        '6':"周六",
        '5':"周五",
        '4':"周四",
        '3':"周三",
        '2':"周二",
        '1':"周一"
    }
};

module.exports = config;



