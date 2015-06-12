var code = require('./code.js');
var conn = require('./mysql.js');
var check =require('./check.js');
var API = require('wechat-api');
var fs = require('fs');
var config = require('../config.js');
var bind = {

};


var api = new API(config.wechat.appId,config.wechat.appSecret, function (callback) {
    // 传入一个获取全局token的方法
    fs.readFile('./token/test_access_token.txt', 'utf8', function (err, txt) {
        //console.log(err,txt);//return;
        if (err) {return callback(err);}
        callback(null, JSON.parse(txt));
    });
}, function (token, callback) {
    // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
    // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
    fs.writeFile('./token/test_access_token.txt', JSON.stringify(token), callback);
});
console.log(api);
bind.register = function(openId,cb){

console.log(openId);
 api.getUser(openId,function(e,user){

     if(e){
         console.log(e);
         cb(code.getUserInfoError);
         return;
     }


     check.register({
         avatar: user.headimgurl,
         openId: user.openid,
         unionId: user.unionid,
         nickname: user.nickname,
         gender: user.sex,
         source: 'wechat'
     },function(e,r){
         if(e){
              cb(e);
              return;
         }
         conn.query(
             {
                 sql:"insert into secret_user (id,tel) values (null,'"+ r.tel+"')"
             },function(ee,rr){
                 if(ee){
                     console.log(ee);
                     cb(code.mysqlError);
                     return;
                 }
                 conn.query(
                     {
                         sql:"insert into secret_user_extend (userId,gender,nickname,avatar,date) values ("+rr.insertId+","+r.gender+",'"+ r.nickname+"','"+ r.avatar+"',"+ r.date+")"
                     },function(eee){
                         if(eee){
                             console.log(eee);
                             cb(code.mysqlError);
                             return;
                         }
                         //console.log("insert into secret_open (userId,openId,unionId,source) values ("+rr.insertId+",'"+ r.openId+"','"+ r.unionId+"','"+r.source+"')");
                         conn.query(
                             {
                                 sql:"insert into secret_open (userId,openId,unionId,source) values ("+rr.insertId+",'"+ r.openId+"','"+ r.unionId+"','"+r.source+"')"
                             },function(eeee,rrrr){
                                 if(eeee){
                                     console.log(eeee);
                                     cb(code.mysqlError);
                                     return;
                                 }
                                 cb(null,{
                                     nickname:user.nickname
                                 });
                             }
                         );

                     }
                 )
             }
         )

     });
 });


};

bind.accounts = function(o,cb){

    if(!o.sqlName){

        cb(code.lackParamsSqlName);

        return;
    }

    if(!o.studentId){
        cb(code.lackParamsStudentId);
        return;
    }else{
        try{
            o.studentId=parseInt(o.studentId);

        }catch(e){

        }
        if(isNaN(o.studentId)){
            cb(code.studentIdMustNumber);
            return;
        }
    }

    if(!o.password){
    cb(code.lackParamsPassword);
        return;
    }

    if(!o.userId){
        cb(code.lackParamsUserId);
        return;
    }


    conn.query(
        {
            sql:"select studentId,password from "+ o.sqlName+" where userId="+ o.userId
        },function(e,r){
            if(e){
                console.log(e);
                cb(code.mysqlError);
                return;
            }
            

            if(r.length>0){


                conn.query(

                    {
                        sql:"update "+ o.sqlName+" set studentId="+ o.studentId+",password='"+ o.password+"' where userId="+ o.userId
                    },function(ee){
                        if(ee){
                            console.log(ee);
                            cb(code.mysqlError);
                            return;
                        }

                        cb(null);
                    }
                );
                return;
            }


            conn.query(

                {
                    sql:"insert into "+ o.sqlName+" set studentId="+ o.studentId+",password='"+ o.password+"',userId="+ o.userId
                },function(ee,rr){
                    if(ee){
                        cb(code.mysqlError);
                        return;
                    }
                    cb(null);
                }
            );
            return;

        }
    )




};

module.exports = bind;
