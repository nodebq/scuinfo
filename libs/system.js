/**
 * 系统统一行为集合
 * Created by lanhao on 15/3/23.
 */
var system = {};

//芒果DB存储的数据模型
system.db_session_model = require('../lib/mongo_model.js').db_session_model;
system.app_permission_model = require('../lib/mongo_model.js').app_permission_model;

//mysql 连接
system.db = require('../lib/mysql_conn').link();

//md5方法
system.md5 = require('../node_modules/crypto/md5');

/**
 * 刷新芒果DB里应用权限
 */
system.flushPermission = function(){
    console.log('flush');
    var sql = 'SELECT t1.*,t2.* from app_info t1 LEFT JOIN app_permission t2 on t1.id=t2.appid';
    system.db.query(sql,function(err,result){
        if(err)console.log(err);
        else{
            var len = result.length;
            for(var i=0;i<len;i++){
                var condition = {appid:result[i].appid};
                system.app_permission_model.remove(condition).exec();
                system.app_permission_model.create({
                    appid:result[i].appid,
                    appkey:result[i].appkey,
                    p_list:result[i].p_list
                });
            }
            console.log('load permission ok:'+(new Date().toLocaleString()));
        }
        setTimeout(function(){
            system.flushPermission();
        },600000);
    });
};