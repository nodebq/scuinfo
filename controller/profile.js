var check = require('../libs/check.js');
var common = require('../libs/common.js');
var code = require('../libs/code.js');
var conn = require('../libs/mysql.js');
var datas = require('../libs/datas.js');
var config = require('../config.js');
var request = require('request');
var aes=require('../libs/aes.js');
//var tokenName = 1;
var profile = {

    name:"用户数据处理"
};

profile.like = function (req, res) {
    var data = {};
    if(req.query.userId && req.query.userId!='undefined'){
        if(req.query.userId ==req.session.userId){
            //是本人
            conn.query(
                {
                    sql:'select count("postId") from `secret_post` where userId = ' + req.query.userId
                }, function (e, r) {
                    if(e){
                        console.log(e);
                        res.end(JSON.stringify(code.mysqlError));
                        return;
                    }conn.query(
                        {
                            sql:'select count("postId") from secret_post_like where userId ='+req.query.userId
                        }, function (ee, rr) {
                            if(ee){
                                console.log(ee);
                                res.end(JSON.stringify(code.mysqlError));
                                return;
                            }
                            data.postsCount = r[0]['count("postId")'];
                            data.likePostsCount = rr[0]['count("postId")'];
                            conn.query(
                                {
                                    sql:'select * from secret_user_extend where userId='+req.query.userId
                                },function(eee,rrr){
                                    if(eee){
                                        console.log(eee);
                                        res.end(JSON.stringify(code.mysqlError));
                                        return;
                                    }if(rrr.length>0){
                                        data.avatar = rrr[0].avatar;
                                        data.nickname = rrr[0].nickname;
                                        data.gender = rrr[0].gender;
                                        data.level = req.session.level;
                                        res.end(common.format(200,'success',data));
                                    }else{
                                        console.log('没有这个用户');
                                        res.end(JSON.stringify(code.paramError));
                                        return;
                                    }}
                            )
                        }
                    )
                }
            )
        }else{
            //不是本人
            conn.query(
                {
                    sql:'select count("postId") from `secret_post` where secret=0 and userId = ' + req.query.userId
                }, function (e, r) {
                    if(e){
                        console.log(e);
                        res.end(JSON.stringify(code.mysqlError));
                        return;
                    }conn.query(
                        {
                            sql:'select count("postId") from secret_post_like where userId ='+req.query.userId
                        }, function (ee, rr) {
                            if(ee){
                                console.log(ee);
                                res.end(JSON.stringify(code.mysqlError));
                                return;
                            }
                            //console.log('select count("postId") from secret_post_like where userId ='+req.query.userId);
                            data.postsCount = r[0]['count("postId")'];
                            data.likePostsCount = rr[0]['count("postId")'];
                            conn.query(
                                {
                                    sql:'select * from secret_user_extend where userId='+req.query.userId
                                },function(eee,rrr){
                                    if(eee){
                                        console.log(eee);
                                        res.end(JSON.stringify(code.mysqlError));
                                        return;
                                    }if(rrr.length>0){
                                        data.avatar = rrr[0].avatar;
                                        data.nickname = rrr[0].nickname;
                                        data.gender = rrr[0].gender;
                                        data.level = req.session.level;
                                        //console.log(data);
                                        res.end(common.format(200,'success',data));
                                    }else{
                                        console.log('没有这个用户');
                                        res.end(JSON.stringify(code.paramError));
                                        return;
                                    }}
                            )
                        }
                    )
                }
            )
        }
    }else if(req.session.userId){
        //console.log('select count("postId") from `secret_post` where userId = ' + req.session.userId);
        conn.query(
            {
                sql:'select count("postId") from `secret_post` where userId = ' + req.session.userId
            }, function (e, r) {
                if(e){
                    console.log(e);
                    res.end(JSON.stringify(code.mysqlError));
                    return;
                }

                conn.query(
                    {
                        sql:'select count("postId") from secret_post_like where userId ='+req.session.userId
                    }, function (ee, rr) {
                        if(ee){
                            console.log(ee);
                            res.end(JSON.stringify(code.mysqlError));
                            return;
                        }
                        data.postsCount = r[0]['count("postId")'];
                        data.likePostsCount = rr[0]['count("postId")'];
                        conn.query(
                            {
                                sql:'select * from secret_user_extend where userId='+req.session.userId
                            },function(eee,rrr){
                                if(eee){
                                    console.log(eee);
                                    res.end(JSON.stringify(code.mysqlError));
                                    return;
                                }if(rrr.length>0){
                                    data.avatar = rrr[0].avatar;
                                    data.nickname = rrr[0].nickname;
                                    data.gender = rrr[0].gender;
                                    data.level = req.session.level;
                                    res.end(common.format(200,'success',data));
                                }else{
                                    console.log('没有这个用户');
                                    res.end(JSON.stringify(code.noUserInfo));
                                    return;
                                }}
                        )
                    }
                )
            }
        )
    }else{
        console.log('既没有id也没登陆我查什么?');
        res.end(JSON.stringify(code.paramError));
        return;
    }
};

/**
 * 获取成绩
 * @param req
 * @param res
 */
profile.score = function(req,res){
    conn.query(
        {
            sql:"select studentId,password from secret_account where userId="+req.session.userId+" order by id desc"
        },function(e,r){
            if(e){
                console.log(e);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            //console.log(r);

            if(r.length>0){

                console.log(config.api.baseUrl+"/api/score?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&studentId="+ r[0].studentId+"&password="+ aes.encode(config.api.appId,config.api.appSecret,r[0].password));

                //console.log(config.api.baseUrl+"/api/score?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r[0].studentId+"&password="+ r[0].password);
                request.get(
                    {
                        url:config.api.baseUrl+"/api/score?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&studentId="+ r[0].studentId+"&password="+ aes.encode(config.api.appId,config.api.appSecret,r[0].password)
                    },function(eeeee,rrrrr,body){

                        //console.log(eeeee,body);
                        if(eeeee){
                            res.end(JSON.stringify(code.requestError));
                            return;
                        }
                        res.end(body);
                        return;


                    });

                return;
            }

            res.end(JSON.stringify(code.noBindDean));
            return;

        }
    )



};
/**
 * 获取课表api封装
 * @param req
 * @param res
 */
profile.major = function(req,res){
    conn.query(
        {
            sql:"select studentId,password from secret_account where userId="+req.session.userId+" order by id desc"
        },function(e,r){
            if(e){
                console.log(e);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            //console.log(r);

            if(r.length>0){
                //console.log(config.api.baseUrl+"/api/major?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r[0].studentId+"&password="+ r[0].password);
                request.get(
                    {
                        url:config.api.baseUrl+"/api/major?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r[0].studentId+"&password="+ r[0].password
                    },function(eeeee,rrrrr,body){

                        //console.log(eeeee,body);
                        if(eeeee){
                            res.end(JSON.stringify(code.requestError));
                            return;
                        }

                        try{
                            var result=JSON.parse(body);
                        }catch(e){
                            var result=code.jsonParseError
                        }
                        //console.log(result);
                        if(result.code==200) {
                            result.data.avatar = req.session.avatar;
                            result.data.nickname = req.session.nickname;
                            result.data.userId=req.session.userId;
                            res.end(JSON.stringify(result));


                        }else{

                            result.data={
                                avatar:req.session.avatar,
                                nickname:req.session.nickname,
                                userId:req.session.userId

                            };
                            res.end(JSON.stringify(result));

                        }
                        return;


                    });

                return;
            }

            res.end(JSON.stringify(code.noBindDean));
            return;

        }
    )



};


/**
 * 获取考表api封装
 * @param req
 * @param res
 */
profile.exam = function(req,res){
    conn.query(
        {
            sql:"select studentId,password from secret_account where userId="+req.session.userId+" order by id desc"
        },function(e,r){
            if(e){
                console.log(e);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            //console.log(r);

            if(r.length>0){
                //console.log(config.api.baseUrl+"/api/exam?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r[0].studentId+"&password="+ r[0].password);
                request.get(
                    {
                        url:config.api.baseUrl+"/api/exam?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r[0].studentId+"&password="+ r[0].password
                    },function(eeeee,rrrrr,body){

                        //console.log(eeeee,body);
                        if(eeeee){
                            res.end(JSON.stringify(code.requestError));
                            return;
                        }

                        try{
                            var result=JSON.parse(body);
                        }catch(e){
                            var result=code.jsonParseError
                        }
                        //console.log(result);
                        if(result.code==200) {
                            result.data.avatar = req.session.avatar;
                            result.data.nickname = req.session.nickname;
                            result.data.userId=req.session.userId;
                            result.data.gender= req.session.gender;
                            res.end(JSON.stringify(result));


                        }else{

                            result.data={
                                avatar:req.session.avatar,
                                nickname:req.session.nickname,
                                userId:req.session.userId,
                                gender:req.session.gender


                            };
                            res.end(JSON.stringify(result));

                        }
                        return;


                    });

                return;
            }

            res.end(JSON.stringify(code.noBindDean));
            return;

        }
    )



};

/**
 * 获取图书列表api封装
 * @param req
 * @param res
 */
profile.book = function(req,res){

    conn.query(
        {
            sql:"select studentId,password from secret_library where userId="+req.session.userId+" order by id desc"
        },function(e,r){
            if(e){
                console.log(e);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            //console.log(r);

            if(r.length>0){
                //console.log(config.api.baseUrl+"/api/book?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r[0].studentId+"&password="+ r[0].password);
                request.get(
                    {
                        url:config.api.baseUrl+"/api/book?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r[0].studentId+"&password="+ r[0].password
                    },function(eeeee,rrrrr,body){

                        //console.log(eeeee,body);
                        if(eeeee){
                            res.end(JSON.stringify(code.requestError));
                            return;
                        }

                        try{
                            var result=JSON.parse(body);
                        }catch(e){
                            var result=code.jsonParseError
                        }
                        //console.log(result);

                        //console.log(req.session);
                        if(result.code==200) {
                            result.data.avatar = req.session.avatar;
                            result.data.nickname = req.session.nickname;
                            result.data.userId=req.session.userId;
                            res.end(JSON.stringify(result));


                        }else{

                            result.data={
                                avatar:req.session.avatar,
                                nickname:req.session.nickname,
                                userId:req.session.userId

                            };
                            res.end(JSON.stringify(result));

                        }

                        return;


                    });

                return;
            }

            res.end(JSON.stringify(code.noBindLibrary));
            return;

        }
    )



};


profile.renew = function(req,res){
//console.log(req.body);
    check.renew(req.body,function(ee,rr){
        if(ee){
            res.end(JSON.stringify(ee));
            return;
        }
//console.log("select studentId,password from secret_library where userId="+req.session.userId);
        conn.query(
            {
                sql:"select studentId,password from secret_library where userId="+req.session.userId+" order by id desc"
            },function(e,r){
                if(e){
                    console.log(e);
                    res.end(JSON.stringify(code.mysqlError));
                    return;
                }
                // console.log(r);

                if(r.length>0){
//console.log(config.api.baseUrl+"/api/renew?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r[0].studentId+"&password=" +
//    ""+ r[0].password+"&xc="+rr.xc+"&barcode="+rr.barcode+"&borId="+rr.borId);
                    request.get(
                        {
                            url:config.api.baseUrl+"/api/renew?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r[0].studentId+"&password=" +
                            ""+ r[0].password+"&xc="+req.body.xc+"&barcode="+req.body.barcode+"&borId="+req.body.borId
                        },function(eeeee,rrrrr,body){

                            //console.log(eeeee,body);
                            if(eeeee){
                                res.end(JSON.stringify(code.requestError));
                                return;
                            }
                            res.end(body);
                            return;


                        });

                    return;
                }

                res.end(JSON.stringify(code.noBindLibrary));
                return;

            }
        )
    });



};


profile.shareBook = function(req,res){

    //console.log(req.query);


    if(!req.query.userId || req.query.userId=="undefined" || req.query.userId=="0"){
        res.end(JSON.stringify(code.lackParamsUserId));
        return;
    }


    if(!req.query.type){
        res.end(JSON.stringify(code.lackParamsType));
        return;
    }

    conn.query(
        {
            sql:"select * from secret_share where userId="+req.query.userId+" and type='"+req.query.type+"' limit 0,1"
        },function(e3,r3){
            if(e3){
                console.log(e3);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            if(r3.length>0){
//console.log(r3);

                conn.query(
                    {
                        sql:"select studentId,password from secret_library where userId="+req.query.userId+" order by id desc"
                    },function(e,r){
                        if(e){
                            console.log(e);
                            res.end(JSON.stringify(code.mysqlError));
                            return;
                        }
                        //console.log(r);

                        if(r.length>0){
                            //console.log(config.api.baseUrl+"/api/book?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r[0].studentId+"&password="+ r[0].password);
                            request.get(
                                {
                                    url:config.api.baseUrl+"/api/book?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r[0].studentId+"&password="+ r[0].password
                                },function(eeeee,rrrrr,body){

                                    //console.log(eeeee,body);
                                    if(eeeee){
                                        res.end(JSON.stringify(code.requestError));
                                        return;
                                    }

                                    try{
                                        var result=JSON.parse(body);
                                    }catch(e){
                                        var result=code.jsonParseError
                                    }
                                    //console.log(result);

                                    //console.log(req.session);
                                    if(result.code==200) {
                                        result.data.avatar = r3[0].avatar;
                                        result.data.nickname = r3[0].nickname;
                                        result.data.userId=r3[0].userId;
                                        //console.log(result);
                                        res.end(JSON.stringify(result));


                                    }else{

                                        result.data={
                                            avatar:r3[0].avatar,
                                            nickname:r3[0].nickname,
                                            userId:r3[0].userId

                                        };
                                        res.end(JSON.stringify(result));

                                    }

                                    return;


                                });

                            return;
                        }

                        res.end(JSON.stringify(code.noBindLibrary));
                        return;

                    }
                )


            }else{
                res.end(JSON.stringify(code.userNoShare));
                return;
            }
        }
    )

};

profile.shareMajor = function(req,res){

    //console.log(req.query);


    if(!req.query.userId || req.query.userId=="undefined" || req.query.userId=="0"){
        res.end(JSON.stringify(code.lackParamsUserId));
        return;
    }


    if(!req.query.type){
        res.end(JSON.stringify(code.lackParamsType));
        return;
    }
    //console.log("select * from secret_share where userId="+req.query.userId+" and type='"+req.query.type+"' limit 0,1");

    conn.query(
        {
            sql:"select * from secret_share where userId="+req.query.userId+" and type='"+req.query.type+"' limit 0,1"
        },function(e3,r3){
            if(e3){
                console.log(e3);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            if(r3.length>0){
//console.log(r3);

                conn.query(
                    {
                        sql:"select studentId,password from secret_account where userId="+req.query.userId+" order by id desc"
                    },function(e,r){
                        if(e){
                            console.log(e);
                            res.end(JSON.stringify(code.mysqlError));
                            return;
                        }
                        //console.log(r);

                        if(r.length>0){
                            //console.log(config.api.baseUrl+"/api/major?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r[0].studentId+"&password="+ r[0].password);
                            request.get(
                                {
                                    url:config.api.baseUrl+"/api/major?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r[0].studentId+"&password="+ r[0].password
                                },function(eeeee,rrrrr,body){

                                    //console.log(eeeee,body);
                                    if(eeeee){
                                        res.end(JSON.stringify(code.requestError));
                                        return;
                                    }

                                    try{
                                        var result=JSON.parse(body);
                                    }catch(e){
                                        var result=code.jsonParseError
                                    }
                                    //console.log(result);

                                    //console.log(req.session);
                                    if(result.code==200) {
                                        result.data.avatar = r3[0].avatar;
                                        result.data.nickname = r3[0].nickname;
                                        result.data.userId=r3[0].userId;
                                        //console.log(result);
                                        res.end(JSON.stringify(result));


                                    }else{

                                        result.data={
                                            avatar:r3[0].avatar,
                                            nickname:r3[0].nickname,
                                            userId:r3[0].userId

                                        };
                                        res.end(JSON.stringify(result));

                                    }

                                    return;


                                });

                            return;
                        }

                        res.end(JSON.stringify(code.noBindDean));
                        return;

                    }
                )


            }else{
                res.end(JSON.stringify(code.userNoShare));
                return;
            }
        }
    )

}



profile.shareExam = function(req,res){

    //console.log(req.query);


    if(!req.query.userId || req.query.userId=="undefined" || req.query.userId=="0"){
        res.end(JSON.stringify(code.lackParamsUserId));
        return;
    }


    if(!req.query.type){
        res.end(JSON.stringify(code.lackParamsType));
        return;
    }
//console.log("select * from secret_share where userId="+req.query.userId+" and type='"+req.query.type+"' limit 0,1");
    conn.query(
        {
            sql:"select * from secret_share where userId="+req.query.userId+" and type='"+req.query.type+"' order by id desc limit 0,1"
        },function(e3,r3){
            if(e3){
                console.log(e3);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }

            //console.log(r3);

            if(r3.length>0){

                conn.query(
                    {
                        sql:"select studentId,password from secret_account where userId="+req.query.userId+" order by id desc"
                    },function(e,r){
                        if(e){
                            console.log(e);
                            res.end(JSON.stringify(code.mysqlError));
                            return;
                        }
                        //console.log(r);

                        if(r.length>0){
                            //console.log(config.api.baseUrl+"/api/exam?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r[0].studentId+"&password="+ r[0].password);
                            request.get(
                                {
                                    url:config.api.baseUrl+"/api/exam?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r[0].studentId+"&password="+ r[0].password
                                },function(eeeee,rrrrr,body){

                                    //console.log(eeeee,body);
                                    if(eeeee){
                                        res.end(JSON.stringify(code.requestError));
                                        return;
                                    }

                                    try{
                                        var result=JSON.parse(body);
                                    }catch(e){
                                        var result=code.jsonParseError
                                    }
                                    //console.log(result);

                                    //console.log(req.session);
                                    if(result.code==200) {
                                        result.data.avatar = r3[0].avatar;
                                        result.data.nickname = r3[0].nickname;
                                        result.data.userId=r3[0].userId;
                                        //console.log(result);
                                        res.end(JSON.stringify(result));


                                    }else{

                                        result.data={
                                            avatar:r3[0].avatar,
                                            nickname:r3[0].nickname,
                                            userId:r3[0].userId

                                        };
                                        res.end(JSON.stringify(result));

                                    }

                                    return;


                                });

                            return;
                        }

                        res.end(JSON.stringify(code.noBindDean));
                        return;

                    }
                )


            }else{
                res.end(JSON.stringify(code.userNoShare));
                return;
            }
        }
    )

}

profile.share = function(req,res){

    if(!req.body.userId && req.body.userId!='undefined'){
        res.end(JSON.stringify(code.lackParamsUserId));
        return;
    }


    if(!req.body.type) {
        res.end(JSON.stringify(code.lackParamsType));

        return;
    }
    conn.query(
        {
            sql:"insert into secret_share (userId,type,avatar,nickname,gender,createAt) values ("+req.body.userId+",'"+req.body.type+"','"+(req.body.avatar?req.body.avatar:"http://ww2.sinaimg.cn/large/d9f8fd81gw1e9nzda6i7kj20rs0rs75i.jpg") +
            "','"+req.body.nickname+"',"+(req.body.gender?req.body.gender:0)+","+common.time()+")"
        },function(e){
            if(e){
                console.log(e);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            res.end(JSON.stringify(code.ok));
            return;
        }
    )


};

profile.updateCallback = function(req,res){
    //console.log(req.body);
    if(req.body.type){
        var first="";
        var keyword1=req.body.studentId;
        var keyword2="";
        var keyword3=common.date(parseInt(req.body.time)*1000);
        var table='secret_account';
        var noBind="noBindDean";
        var url="";

        switch (req.body.type){

            case 'exam':
                first="你的考表有新动态";
                keyword2='考表';
                url=config.site.url+"/exam";
                break;

            case 'book':
                first="你借的图书有新动态";
                table="secret_library";
                noBind="noBindLibrary";
                keyword2='我的图书';
                url=config.site.url+"/book";
                return;

                break;
            case 'renew':
                first="你的续借操作有新动态";
                table="secret_library";
                noBind="noBindLibrary";
                keyword2='续借';
                url=config.site.url+"/book";

                break;
            case 'score':
                first="你的成绩有新动态";
                keyword2='成绩';
                url=config.site.url+"/score";

                break;
            case 'major':
                first="你的课表有新动态";
                url=config.site.url+"/major";

                keyword2='课表';

                break;
        }
        conn.query(
            {sql:"select userId from "+table+" where studentId="+req.body.studentId+" order by id desc limit 0,1"},function(e,r){

                if(e){

                    res.end(JSON.stringify(code.mysqlError));
                    return;
                }

                if(r.length==0){

                    res.end(JSON.stringify(code[noBind]));
                    return;
                }
                //console.log("select openId from secret_open where userId="+r[0].userId+" and source='wechat'");
                conn.query(
                    {
                        sql:"select openId from secret_open where userId="+r[0].userId+" and source='wechat'"
                    },function(ee,rr){

                        if(ee){
                            res.end(JSON.stringify(code.mysqlError));
                            return;
                        }

                        if(rr.length==0){
                            res.end(JSON.stringify(code.notSubscribe));
                            return;
                        }
//console.log(config.urls.wechatSendTemplate);
//console.log({
//    url:url?url:(config.site.url+"/u"),
//    template:(req.body.code==200)?"ok":"fail",
//    first:first,
//    remark:(req.body.code==200)?"点击这里或右下角自定义菜单查看结果":"点击查看详情",
//    keyword1:keyword1,
//    keyword2:keyword2,
//    keyword3:keyword3,
//    keyword4:(req.body.code==200)?"成功更新":req.body.message,
//    openId:rr[0].openId
//});
                        request.post(
                            {
                                url:config.urls.wechatSendTemplate,
                                form:{
                                    url:url?url:(config.site.url+"/u"),
                                    template:(req.body.code==200)?"ok":"fail",
                                    first:first,
                                    remark:(req.body.code==200)?"点击这里或右下角自定义菜单查看结果":"点击查看详情",
                                    keyword1:keyword1,
                                    keyword2:keyword2,
                                    keyword3:keyword3,
                                    keyword4:(req.body.code==200)?"成功更新":req.body.message,
                                    openId:rr[0].openId
                                }
                            },function(eee,rrr,bbb){
                                //console.log(eee);
                                if(eee){
                                    //console.log(eee);
                                    res.end(JSON.stringify(code.requestError));
                                    return;
                                }
                                //console.log('222');

                                res.end(bbb);
                                return;
                            }
                        )

                    }
                )



            }
        )

        return;
    }

    res.end(JSON.stringify(code.unknownError));
};


profile.update = function(req,res){

    if(!req.body.type){
        res.end(JSON.stringify(code.lackParamsType));
        return;
    }

    var sqlName=(req.body.type=='book')?"secret_library":"secret_account";

    conn.query(
        {
            sql:"select studentId,password from "+sqlName+" where userId="+req.session.userId+" order by id desc"
        },function(e,r) {
            if (e) {
                console.log(e);
                res.end(JSON.stringify(code.mysqlError));
                return;
            }
            //console.log(r);

            if (r.length > 0) {

                request.get(config.api.baseUrl + '/api/update?appId=' + config.api.appId + '&appSecret=' + config.api.appSecret + '&studentId='+r[0].studentId+'&password='+r[0].password+'&debug=1&type=' + req.body.type,function(ee,rr,bb) {
                    if(ee){
                        res.end(JSON.stringify(code.requestError));
                        return;
                    }

                    res.end(bb);
                    return;

                });

                return;

            }
            res.end(JSON.stringify(((req.body.type=='book')?code.noBindLibrary:code.noBindDean)));

        });


};
module.exports = profile;