/**
 * mysql模块，接收参数组装sql语句
 */
var mysql = require('./mysql.js');
var conn = require('./mysql.js');
var code = require('./code.js');
//console.log(code);
var db = {

}

/**
 * 插入语句
 * @param table 数据表名
 * @param record 对象,key(字段名):value(字段值)
 * @return 返回最新的自增ID，
 */

db.insert = function(table,record,cb){
    if(table=='')return null;

    if(record){
        //console.log(table);
        mysql.query({
            sql: "insert into `"+table+"` (`"+record.key+"`) VALUES ('"+record.value+"')",

    }, function (err, rows) {
        // console.log(err,rows);
        //return rows.insertId;
        cb(null,rows.insertId);
    });

    }
    //return rows.insertId;
}




/**
 * 读取微信图文信息
 * @type {{}}
 */

db.getWechatNews = function(o,cb){

var sql;
    if(Array.isArray(o.name)){
        var names = [];
        for(var i = 0;i< o.name.length;i++){
            names[i]="'"+ o.name[i]+"'";
        }

        sql="select * from wechat_news where name in ("+ names.join(',')+")"
    }else if(typeof(o.name)){
        sql="select * from wechat_news where name='"+ o.name+"'"
    }else{
        cb(code.paramError);
        return;
    }
    conn.query(
        {
            sql:sql
        },function(e,r){
            if(e){
                cb(code.mysqlError);
                console.log(e);
                return;
            }
            console.log(r);
            if(r.length>0){
                    cb(null,r);
                    return;

            }
            cb(code.noData);
            return;

        })

};


db.getWechatText = function(o,cb){

       var sql="select * from wechat_text where name='"+ o.name+"'";

    conn.query(
        {
            sql:sql
        },function(e,r){
            if(e){
                cb(code.mysqlError);
                console.log(e);
                return;
            }
            console.log(r);
            if(r.length>0){

                cb(r[0].content);
                return;
            }
            cb(code.noData);
            return;

        })

};

db.getUser = function(o,cb){

    conn.query(
        {
            sql:"select * from secret_account as a,secret_open as b where a.userId=b.userId and b.openId="+ o.openId
        },function(e,r){
            if(e){
                cb(code.mysqlError);
                return;
            }
            console.log(r);
        }
    )

};

module.exports = db;