var conn= require('./libs/mysql.js');
var common= require('./libs/common.js');
var request = require('request');
var config = require('./config.js');
var fs= require('fs');
var FormData = require('form-data');

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
        console.log(err+new Date());
        console.log('微博初始化失败');
        return;
    }
//console.log(txt);
    try{
        weiboToken=JSON.parse(txt);
        //console.log('初始化微博分享');
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
                console.log(e+new Date());
                return;
            }
            //console.log(r);
            if(r.length>0){


                //todo 发布到微博,改状态

                conn.query(

                    {
                        sql:"select * from secret_post where id="+r[0].postId
                    },function(ee,rr){

                        if(ee){
                            console.log(ee+new Date());
                            return;
                        }
                        
                        if(rr.length>0){
//console.log(rr);

                            request.post('http://text2pic.scuinfo.com',{form:{
                                "text":rr[0].content,
                                "footer":rr[0].nickname+"\n"+common.dayWeibo(rr[0].date*1000)
                            }},function(eeeee,rrrrr,bbbbb){
                                try{
                                    var result = JSON.parse(bbbbb);
                                }catch(e){
                                    console.log(e);
                                    var result = {
                                        code:2009,
                                        message:"json解析出错"
                                    }
                                }
//console.log(result);
                                if(result.code==200){
                                    var form = new FormData();

                                    var content = ((rr[0].content.substr(0,120)+config.site.url+"/p/"+rr[0].id)).split("\n").join("\n\r%0A");
                                    console.log(content);
                                    form.append('status', content);
                                    form.append('access_token',weiboToken.access_token);
                                    form.append('pic', request(result.data.url));
                                    form.submit('https://upload.api.weibo.com/2/statuses/upload.json', function(err, res) {
                                        // res – response object (http.IncomingMessage)  //
                                        res.resume();

                                        var body = '';
                                        res.on('data', function(chunk) {
                                            //console.log(chunk);
                                            body += chunk;
                                        });
                                        res.on('end', function() {
                                            try {
                                                var userInfo = JSON.parse(body);
                                            } catch (e) {
                                                var userInfo = {
                                                    error_code: 20000
                                                }
                                            }


                                            if (userInfo.error_code) {
                                                console.log(userInfo + new Date());
                                                return;
                                            }
                                            conn.query(
                                                {
                                                    sql: "update secret_weibo_query set status=1,postAt=" + common.time() + ",weiboId=" + userInfo.id + " where id=" + r[0].id
                                                }, function (eeeee, rrrrr) {
                                                    //console.log(eeeee,'成功发布一条微博');
                                                }
                                            );
                                        });

                                    });





                                }else{


                                    console.log(result);

                                }

                            });

                            
                        }else{
                            console.log('该帖子已被删除'+new Date());
                            conn.query(
                                {
                                    sql:"update secret_weibo_query set status=3,postAt="+common.time()+" where id="+r[0].id
                                },function(eeeee,rrrrr){
                                    //console.log(eeeee,'成功发布一条微博');
                                }
                            );
                        }

                    }
                );










                
                //console.log('发布');
                
            }else{
                //console.log('没有待发布的微博');
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
},1*90*1000);

