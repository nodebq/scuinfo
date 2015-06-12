var conn= require('./libs/mysql.js');
var common= require('./libs/common.js');
var request = require('request');
var fs= require('fs');
/**
 * 消费者
 * @type {{}}
 */
var consumer={

};

var weiboToken = {

};

fs.readFile('./token/weibo_token.txt', 'utf8', function (err, txt) {
    //console.log(err,txt);//return;
    if (err) {
        console.log(err);
        console.log('微博初始化失败');
        return;
    }
console.log(txt);
    try{
        weiboToken=JSON.parse(txt);
        console.log('初始化微博分享');
    }catch(e){
        weiboToken={}
    }
    
});
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

                conn.query(

                    {
                        sql:"select * from secret_post where id="+r[0].postId
                    },function(ee,rr){

                        if(ee){
                            console.log(ee);
                            return;
                        }
                        
                        if(rr.length>0){
console.log({
    status:encodeURIComponent(rr[0].content.substr(0,138)),
    annotations:JSON.stringify({
        secret: rr[0].secret,
        userId:rr[0].userId
    })
});
                            request.post(
                                {
                                    url:"https://api.weibo.com/2/statuses/update.json",
                                    form:{
                                        status:encodeURIComponent(rr[0].content.substr(0,138)),
                                        annotations:JSON.stringify({
                                            secret: rr[0].secret,
                                            userId:rr[0].userId
                                        })
                                    }
                                },function(eee,rrr,bbb){

                                    try{
                                        var userInfo = JSON.parse(rrr.body);
                                    }catch(e){
                                        var userInfo = {
                                            error_code:20000
                                        }
                                    }
                                    //console.log(userInfo);

                                    //todo 判断是否能拿到用户资料，如果能拿到的话，正常执行登录/注册流程
                                    // 如果拿不到的话，跳到redirect页，并设置 session.userStatus:wechatNotFans
                                    //

                                    if(userInfo.error_code){
                                        console.log(userInfo);
                                        return;
                                    }

                                    //改状态
                                    conn.query(
                                        {
                                            sql:"update secret_weibo_query set status=1,postAt="+common.time()+",weiboId="+userInfo.id
                                        },function(eeeee,rrrrr){
                                            console.log(eeeee,'成功发布一条微博');
                                        }
                                    )


                    }
                            )

                            
                        }else{
                            console.log('该帖子已被删除');
                        }

                    }
                )










                
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
},1*20*1000);

