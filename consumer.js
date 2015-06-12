var conn= require('./libs/mysql.js');
var common= require('./libs/common.js');
/**
 * 消费者
 * @type {{}}
 */
var consumer={

};

/**
 * 微博发布消费者
 */
consumer.weibo = function(){

    conn.query(
        {
            sql:"select * from secret_weibo_query where status=0 limit 0,1"
        },function(e,r){
            if(e){
                console.log(e);
                return;
            }
            
            if(r.length>0){


                //todo 发布到微博,改状态
                
                console.log('发布');
                
            }else{
                console.log('没有待发布的微博');
            }
        }
    )

};


/**
 * 微信会话销毁
 */

consumer.wechatSession=function(){
    conn.query(
        {
            sql:"delete from wechat_session where createAt<"+(common.time()-10*60)
        },function(e,r){
            //console.log(e,r);
        }
    )

};

consumer.wechatSession();
setInterval(function(){
    consumer.wechatSession();
},1*60*1000);


consumer.weibo();

setInterval(function(){
    consumer.weibo();
},5*60*1000);

