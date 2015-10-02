

var conn = require("./mysql.js");
var request = require('request');
var common = require('./common.js');
var consumer ={};
/**
 * 微博发布消费者
 */
consumer.weibo = function(){



                conn.query(

                    {
                        sql:"select * from secret_post where id=7363"
                    },function(ee,rr){

                        if(ee){
                            console.log(ee+new Date());
                            return;
                        }

                        if(rr.length>0){

console.log(rr);

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

                                if(result.code==200){

                                }else{

                                }
                                
                            });



                            //request.post(
                            //    {
                            //        url:"https://api.weibo.com/2/statuses/update.json",
                            //        form:{
                            //            status:rr[0].content.substr(0,120)+config.site.url+"/p/"+rr[0].id,
                            //            access_token:weiboToken.access_token
                            //            //annotations:JSON.stringify({
                            //            //    secret: rr[0].secret,
                            //            //    userId:rr[0].userId
                            //            //})
                            //        }
                            //    },function(eee,rrr,bbb){
                            //
                            //        try{
                            //            var userInfo = JSON.parse(rrr.body);
                            //        }catch(e){
                            //            var userInfo = {
                            //                error_code:20000
                            //            }
                            //        }
                            //        //console.log(userInfo);
                            //
                            //        //todo 判断是否能拿到用户资料，如果能拿到的话，正常执行登录/注册流程
                            //        // 如果拿不到的话，跳到redirect页，并设置 session.userStatus:wechatNotFans
                            //        //
                            //
                            //        if(userInfo.error_code){
                            //            console.log(userInfo+new Date());
                            //            return;
                            //        }
                            //
                            //        //改状态
                            //        conn.query(
                            //            {
                            //                sql:"update secret_weibo_query set status=1,postAt="+common.time()+",weiboId="+userInfo.id
                            //            },function(eeeee,rrrrr){
                            //                //console.log(eeeee,'成功发布一条微博');
                            //            }
                            //        )
                            //
                            //
                            //    }
                            //);


                        }else{
                            console.log('该帖子已被删除'+new Date());
                        }

                    });



};

consumer.weibo()