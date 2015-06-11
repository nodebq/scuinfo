

/**
 * Created by GuobaoYang on 15/3/8.
 */


var config = {
    /**
     * 本地数据库
     */

    mysql:{
        'host':'127.0.0.1',
        'user':'root',
        'password':'',
        'database':'secret'
    },

    /**
     * 服务器数据库
     */
    /*
     mysql:{
     'host':'203.195.164.179',
     'user':'dsgygb_secret',
     'password':'safsdafsdalkerdsgyssabqdfs',
     'database':'secret'
     },
     */
    host:{
        url:"fm.scuinfo.com"
    },

    site:{
        name:"scuinfo",
        separator:' - '
    },
    /**
     * 正式的id和key，请勿必不要在测试环境下使用
     */

    wechat:{
        'appId':"wx64902e8505feae7f",
        'appSecret':"929d3f4fa7f4efc793968e1717727608"
    },

    /**
     * 测试用的id和key，
     */
    /*
     wechat:{
     'appId':"wx3d6f3fcc7cdd49eb",
     'appSecret':"61902d1d1c4dc894dc0437c24d8f9550"
     },*/

    wechatWeb:{
        'appId':"wx8f8d7578a5a3023b",
        'appSecret':"94a563f3d442d4d0af88609260eb42ec"
    },
    weibo:{
        'appkey':"1159008171",
        'uid':"3656973697",
        'appSecret':'abe077b7bfd949ecf5906a2ce50211eb'
    }


};

module.exports = config;