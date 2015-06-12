var code = {
    //错误码格式 第一位 为错误大类型 ,1为系统级错误,2为业务错误,后三位为具体错误代码
    'ok':{
      code:200,
        message:"成功"
    },
    'success':{
        code:200,
        message:"成功"
    },
    'test':{
        code:1001,
        message:"xxx"
    },
    'mysqlError':{
        code:1002,
        message:"数据库访问错误"
    },
    'paramError':{
        code:1003,
        message:"参数错误"
    },
    'requestError':{
        code:1004,
        message:"请求错误"
    },
    'loginError':{
        code:2001,
        message:"并未获取授权"
    },
    'requestError':{
        code:2002,
        message:"教务处暂时无法访问"
    },
    'loadNotFinished':{
        code:2003,
        message:"有一些重要信息还没有载入完成"
    },
    'updateNotChanged':{
        code:2004,
        message:"数据并没有改动"//数据库更新
    },
    'contentCantNull':{
        code:2005,
        message:"内容不能为空"
    },
    'contentRepeat':{
        code:2006,
        message:"已经有相同的内容存在了"
    },
    'noMore':{
        code:2007,
        message:"没有更多了"
    },
    'notLoadWechatToken':{
        code:2008,
        message:'还没有载入accessToken'
    },
    'lackParamsPostId':{
        code:2009,
        message:'缺少参数 postId'
    },
    'lackParamsContent':{
        code:2009,
        message:'缺少参数 content'
    },
    'lackParamsCode':{
        code:2010,
        message:"缺少参数 code"
    },
    'wechatLoginCodeToAccessTokenError':{
        code:2011,
        message:"微信登录错误"
    },
    'noUserInfo':{
        code:2012,
        message:"该用户异常,没有他的数据"
    },
    'lackParamsNickname':{
        code:2013,
        message:"缺少参数 nickname"
    },
    'lackParamsOpenId':{
        code:2014,
        message:"缺少参数 openId"
    },
    'notLogin':{
        code:2015,
        message:"请先登录"
    },
    'hasLogin':{
        code:2016,
        message:"已登录"
    },
    'weiboLoginCodeToAccessTokenError':{
        code:2017,
        message:"微博登录错误"
    },
    'logoutError':{
        code:2018,
        message:"退出失败"
    },
    'notSubscribe':{
        code:2019,
        message:"没有关注我"
    },
    'noUser':{
        code:2020,
        message:"没有这个用户"
    },
    'noBindDean':{
        code:2021,
        message:"没有绑定教务处"
    },
    'lackParamsStudentId':{
        code:2022,
        message:"缺少参数 studentId"
    },
    'lackParamsPassword':{
        code:2023,
        message:"缺少参数 password"
    },
    'lackParamsUserId':{
        code:2024,
        message:"缺少参数 userId"
    },
    'getUserInfoError':{
        code:2025,
        message:"获取用户资料失败"
    },
    'noData':{
        code:2026,
        message:"没有数据"
    },
    'studentIdMustNumber':{
        code:2027,
        message:"学号必须是数字"
    },
    'lackParamsSqlName':{
        code:2028,
        message:"缺少参数数据库名字 sqlName"
    },
    'getWechatTicketError':{
        code:2029,
        message:"获取微信ticket错误"
    },
    'lackParamsName':{
        code:2030,
        message:"缺少参数 name"
    },
    'noBindLibrary':{
        code:2031,
        message:"没有绑定图书馆"
    },
    'lackParamsXc':{
        code:2032,
        message:"缺少参数 xc"
    },
    'lackParamsBarcode':{
        code:2033,
        message:"缺少参数 barcode"
    },
    'lackParamsBorId':{
        code:2034,
        message:"缺少参数 borId"
    },
    'jsonParseError':{
        code:2035,
        message:"json解析错误"
    },
    'lackParamsType':{
        code:2036,
        message:"缺少参数 type"
    },
    'userNoShare':{
        code:2037,
        message:"该用户没有分享"
    },
    'wechatError':{
        code:2038,
        message:"微信错误"
    },
    'unknownError':{
        code:2039,
        message:"未知错误"
    },
    'userHasLike':{
        code:2040,
        message:"你已经赞过了"
    }
};



module.exports = code;
