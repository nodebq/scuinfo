/**
 * mysql模块，只负责连接数据库，
 */
var config = require('../config');
var client = require('easymysql');
//mysql conn
var conn = null;

var db_conf =config.mysql;
var link = function(){

    if(conn==null){
        conn = client.create({
            'maxconnections':10
        });
        conn.addserver(db_conf);

    }else{

    }
    conn.on('error',function(err){
        console.log('mysql error',err);
    });
    return conn;
};

module.exports = link();
