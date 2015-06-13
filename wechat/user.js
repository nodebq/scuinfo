var request = require('request');
var conn = require('../libs/mysql');
var code = require('../libs/code');
var config = require('../config.js');
var bind = require('../libs/bind');
var dbs = require('../libs/db');
var common = require('../libs/common.js');
var user = {

};

user.getUserId = function(openId,cb){

    if(!openId){
        cb(code.lackParamsOpenId);
        return;
    }
    conn.query({
        sql:"select userId from secret_open where openId = '"+openId+"'"
    },function(e,r){

        if(e){
            console.log(e);
            cb(code.mysqlError);
            return;
        }

        if(r.length>0){
            cb(null,r[0].userId);
            return;
        }

        cb(code.noUser);
        return;


    });

};

user.valid = function(msg,req,res,cb){

    user.getUserId(msg.FromUserName,function(e,r){
if(e){
    cb(e);
    return;
}
//console.log(r);
//        console.log("select studentId,password from secret_"+ ((msg.field=='library')?"library":"account")+" where userId = "+ r);
conn.query(
    {
        sql:"select studentId,password from secret_"+ ((msg.field=='library')?"library":"account")+" where userId = "+ r
    },function(ee,rr){
        if(ee){
            console.log(ee);
            cb(code.mysqlError);
            return;
        }
        //console.log(rr);

        if(rr.length>0) {
            cb(null, {
                studentId: rr[0].studentId,
                password:rr[0].password
            });
            return;
        }

        if(msg.field=='library'){
            cb(code.noBindLibrary);
        }else {
            cb(code.noBindDean);
        }
        return;
    }
)


    });

};


user.score = function(msg,req,res,next){
    user.valid(msg,req,res,function(e,r){
//console.log(e,r);
        if(e){


            if(e.code == 2020){

                bind.register(msg.FromUserName,function(ee,rr){

                    if(ee){
                        res.reply(JSON.stringify(ee));
                        return;
                    }
                    dbs.getWechatNews({
                        name:"notBindDean"
                    },function(eee,rrrr){
                        if(eee){
                            res.reply(JSON.stringify(eee));
                            return;
                        }
                        //console.log(rrrr);
                        res.reply(rrrr);

                    });
                    return;

                });

                return;
            }


            if(e.code == 2021){
                dbs.getWechatNews({
                    name:"notBindDean"
                },function(eee,rrrr){
                    if(eee){
                        res.reply(JSON.stringify(eee));
                        return;
                    }
                    //console.log(rrrr);
                    res.reply(rrrr);

                });

                return;
            }



            res.reply(e.message);
            return;
        }
        //console.log(config.api.baseUrl+"/api/score?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r.studentId+"&password="+ r.password);
        request.get(
            {
                url:config.api.baseUrl+"/api/score?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r.studentId+"&password="+ r.password
            },function(eeeee,rrrrr,body){
                
                //console.log(eeeee,body);
                if(eeeee){
                    res.reply(code.requestError.message);
                    return;
                }

                try{
                    var scores = JSON.parse(body);
                }catch(e){
                    var scores= {};
                }
//console.log(scores);
//                console.log(scores.code);
                if(scores.code==200){
                    //console.log(scores);
                    var scoresData=scores.data.scores;
                    //console.log(scoresData);
                    if(scoresData.length>0){

                        var text=scoresData[0].term+"成绩:";
                        for(var i=0;i<scoresData.length;i++){
                            if(scoresData[i].term==scoresData[0].term) {
                                text += "\n\n"+scoresData[i].name+"["+scoresData[i].property+"]" + ":" + scoresData[i].score + "";
                            }
                        }

                        text+='\n\n <a href="'+config.site.url+'/score">点击查看全部成绩详情</a>' +
                            '\n\n最后更新时间:'+(new Date(parseInt(scores.data.updateAt)*1000).getMonth()+1)+"月"+(new Date(parseInt(scores.data.updateAt)*1000).getDate())+"日 "+new Date(parseInt(scores.data.updateAt)*1000).getHours()+":"+new Date(parseInt(scores.data.updateAt)*1000).getMinutes() ;
                        res.reply(text);
                        return;

                    }else{
                        dbs.getWechatText({
                            name:"noScores"
                        },function(eee,rrrr){
                            if(eee){
                                res.reply(JSON.stringify(eee));
                                return;
                            }
                            //console.log(rrrr);
                            res.reply(rrrr);
                            return;
                        });
                    }
                    return;


                }else if(scores.code==2012){

                    dbs.getWechatNews({
                        name:"deanPasswordError"
                    },function(eee,rrrr){
                        if(eee){
                            res.reply(JSON.stringify(eee));
                            return;
                        }
                        //console.log(rrrr);
                        res.reply(rrrr);

                    });

                    return;

                }else if(scores.code==2010 || scores.code==2011){
                    dbs.getWechatText({
                        name:"getScoresLater"
                    },function(eee,rrrr){
                        if(eee){
                            res.reply(JSON.stringify(eee));
                            return;
                        }
                        //console.log(rrrr);
                        res.reply(rrrr);
                        return;

                    });

                    return;

                }
                res.reply(scores.code+":"+scores.message);
                return;
                


            });

    });

};





user.book = function(msg,req,res,next){
    msg.field="library";
    user.valid(msg,req,res,function(e,r){
        //console.log(e,r);
        if(e){


            if(e.code == 2020){

                bind.register(msg.FromUserName,function(ee,rr){

                    if(ee){
                        res.reply(JSON.stringify(ee));
                        return;
                    }
                    dbs.getWechatNews({
                        name:"notBindLibrary"
                    },function(eee,rrrr){
                        if(eee){
                            res.reply(JSON.stringify(eee));
                            return;
                        }
                        //console.log(rrrr);
                        res.reply(rrrr);

                    });
                    return;

                });

                return;
            }


            if(e.code == 2031){
                dbs.getWechatNews({
                    name:"notBindLibrary"
                },function(eee,rrrr){
                    if(eee){
                        res.reply(JSON.stringify(eee));
                        return;
                    }
                    //console.log(rrrr);
                    res.reply(rrrr);

                });

                return;
            }
            res.reply(e.message);
            return;
        }
        //console.log(config.api.baseUrl+"/api/book?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r.studentId+"&password="+ r.password);
        request.get(
            {
                url:config.api.baseUrl+"/api/book?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r.studentId+"&password="+ r.password
            },function(eeeee,rrrrr,body){

                //console.log(eeeee,body);
                if(eeeee){
                    res.reply(code.requestError.message);
                    return;
                }
                try{
                    var books = JSON.parse(body);
                }catch(e){
                    var books= {};
                }
                //console.log(books);
                //console.log(books.code);
                if(books.code==200){
                    //console.log(books);
                    var booksData=books.data.books;
                    //console.log(booksData);
                    if(booksData.length>0){

                        var text="我借的图书:";
                        for(var i=0;i<booksData.length;i++){
                                text += "\n\n《"+booksData[i].name + "》\n"+(((booksData[i].deadline-parseInt(new Date().getTime()/1000))>0)?"还有":"已超期") + Math.abs(parseInt((booksData[i].deadline-parseInt(new Date().getTime()/1000))/3600/24))+ "天("+(new Date(booksData[i].deadline*1000).getFullYear())+'.'+(new Date(booksData[i].deadline*1000).getMonth()+1)+'.'+new Date(booksData[i].deadline*1000).getDate()+")";

                        }

                        text+='\n\n <a href="'+config.site.url+'/book">点击查看详情或续借</a>' +
                            '\n\n最后更新时间:'+(new Date(parseInt(books.data.updateAt)*1000).getMonth()+1)+"月"+(new Date(parseInt(books.data.updateAt)*1000).getDate())+"日 "+new Date(parseInt(books.data.updateAt)*1000).getHours()+":"+new Date(parseInt(books.data.updateAt)*1000).getMinutes() ;
                        res.reply(text);
                        return;

                    }else{
                        dbs.getWechatText({
                            name:"noBooks"
                        },function(eee,rrrr){
                            if(eee){
                                res.reply(JSON.stringify(eee));
                                return;
                            }
                            //console.log(rrrr);
                            res.reply(rrrr);
                            return;
                        });
                    }
                    return;


                }else if(books.code==2012){

                    dbs.getWechatNews({
                        name:"deanPasswordError"
                    },function(eee,rrrr){
                        if(eee){
                            res.reply(JSON.stringify(eee));
                            return;
                        }
                        //console.log(rrrr);
                        res.reply(rrrr);

                    });

                    return;

                }else if(books.code==2010 || books.code==2011 ||books.code==2029){
                    dbs.getWechatText({
                        name:"getBookLater"
                    },function(eee,rrrr){
                        if(eee){
                            res.reply(JSON.stringify(eee));
                            return;
                        }
                        //console.log(rrrr);
                        res.reply(rrrr);
                        return;

                    });

                    return;

                }
                res.reply(books.code+":"+books.message);
                return;



            });

    });

};


user.major = function(msg,req,res,next){
    user.valid(msg,req,res,function(e,r){
        //console.log(e,r);
        if(e){


            if(e.code == 2020){

                bind.register(msg.FromUserName,function(ee,rr){

                    if(ee){
                        res.reply(JSON.stringify(ee));
                        return;
                    }
                    dbs.getWechatNews({
                        name:"notBindDean"
                    },function(eee,rrrr){
                        if(eee){
                            res.reply(JSON.stringify(eee));
                            return;
                        }
                        //console.log(rrrr);
                        res.reply(rrrr);

                    });
                    return;

                });

                return;
            }


            if(e.code == 2021){
                dbs.getWechatNews({
                    name:"notBindDean"
                },function(eee,rrrr){
                    if(eee){
                        res.reply(JSON.stringify(eee));
                        return;
                    }
                    //console.log(rrrr);
                    res.reply(rrrr);

                });

                return;
            }



            res.reply(e.message);
            return;
        }
        request.get(
            {
                url:config.api.baseUrl+"/api/major?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r.studentId+"&password="+ r.password
            },function(eeeee,rrrrr,body){

                //console.log(eeeee,body);
                if(eeeee){
                    res.reply(code.requestError.message);
                    return;
                }

                try{
                    var majors = JSON.parse(body);
                }catch(e){
                    var majors= {};
                }
                //console.log(majors);
                //console.log(majors.code);
                if(majors.code==200){
                    //console.log(majors);
                    var majorsData=majors.data.majors;
                    //console.log(JSON.stringify(majorsData));
                    if(majorsData.length>0){
                        var currentDay;
                        if(common.getWeek()==0){
                            currentDay=7;
                        }else{
                            currentDay=common.getWeek();
                        }

                        var text='今天是教学周第'+majors.data.currentWeek+'周,'+config.week[currentDay]+'，你今天的课表如下:';
                        var lessonCount=0;
                        for(var i=0;i<majorsData.length;i++){
                            if(majorsData[i].week==currentDay) {
                                lessonCount++;
                                var isCurrentWeek = majorsData[i].weekHasLesson.split(',').indexOf(""+majors.data.currentWeek);
                                text += '\n\n第'+majorsData[i].lesson+'小节\n'+majorsData[i].name+"["+majorsData[i].teacherName+"]" + "\n" + majorsData[i].building+majorsData[i].classroom +"\n"+((isCurrentWeek==-1)?"本周不上":"本周要上");
                            }


                        }

                        if(lessonCount==0){

                            text+="\n\n咦，今天没课^_^"
                        }

                        text+='\n\n <a href="'+config.site.url+'/major">点击查看全部课表</a>' +
                            '\n\n课表最后更新时间:'+(new Date(parseInt(majors.data.updateAt)*1000).getMonth()+1)+"月"+(new Date(parseInt(majors.data.updateAt)*1000).getDate())+"日 "+new Date(parseInt(majors.data.updateAt)*1000).getHours()+":"+new Date(parseInt(majors.data.updateAt)*1000).getMinutes() ;
                        res.reply(text);
                        return;

                    }else{
                        dbs.getWechatText({
                            name:"noMajors"
                        },function(eee,rrrr){
                            if(eee){
                                res.reply(JSON.stringify(eee));
                                return;
                            }
                            //console.log(rrrr);
                            res.reply(rrrr);
                            return;
                        });
                    }
                    return;


                }else if(majors.code==2012){

                    dbs.getWechatNews({
                        name:"deanPasswordError"
                    },function(eee,rrrr){
                        if(eee){
                            res.reply(JSON.stringify(eee));
                            return;
                        }
                        //console.log(rrrr);
                        res.reply(rrrr);

                    });

                    return;

                }else if(majors.code==2010 || majors.code==2011){
                    dbs.getWechatText({
                        name:"getMajorLater"
                    },function(eee,rrrr){
                        if(eee){
                            res.reply(JSON.stringify(eee));
                            return;
                        }
                        //console.log(rrrr);
                        res.reply(rrrr);
                        return;

                    });

                    return;

                }
                res.reply(majors.code+":"+majors.message);
                return;



            });

    });

};



user.exam = function(msg,req,res,next){
    user.valid(msg,req,res,function(e,r){
        //console.log(e,r);
        if(e){


            if(e.code == 2020){

                bind.register(msg.FromUserName,function(ee,rr){

                    if(ee){
                        res.reply(JSON.stringify(ee));
                        return;
                    }
                    dbs.getWechatNews({
                        name:"notBindDean"
                    },function(eee,rrrr){
                        if(eee){
                            res.reply(JSON.stringify(eee));
                            return;
                        }
                        //console.log(rrrr);
                        res.reply(rrrr);

                    });
                    return;

                });

                return;
            }


            if(e.code == 2021){
                dbs.getWechatNews({
                    name:"notBindDean"
                },function(eee,rrrr){
                    if(eee){
                        res.reply(JSON.stringify(eee));
                        return;
                    }
                    //console.log(rrrr);
                    res.reply(rrrr);

                });

                return;
            }



            res.reply(e.message);
            return;
        }
        //console.log(config.api.baseUrl+"/api/exam?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r.studentId+"&password="+ r.password);
        request.get(
            {
                url:config.api.baseUrl+"/api/exam?appId="+ config.api.appId+"&appSecret="+config.api.appSecret+"&debug=1&studentId="+ r.studentId+"&password="+ r.password
            },function(eeeee,rrrrr,body){

                if(eeeee){
                    res.reply(code.requestError.message);
                    return;
                }

                try{
                    var exams = JSON.parse(body);
                }catch(e){
                    var exams= {};
                }

                if(exams.code==200){
                    var examsData=exams.data.exams;
                    if(examsData.length>0){
                        function sortByTime(a,b){
                            if(parseInt(a.start)> parseInt(b.start)){
                                return 1;
                            }else{
                                return -1;
                            }

                        }

                        examsData.sort(sortByTime);
                        var text="你的本次考试时间地点如下：";

                        for(var i=0;i<examsData.length;i++){
                            if(examsData[i].examName=='期末考试') {
                                text += "\n\n["+(((new Date().getTime()/1000)>examsData[i].end)?"已完成":"未完成")+"]"+examsData[i].name + "\n" + common.dateChina(examsData[i].start*1000)+'~'+common.hour(examsData[i].end*1000) + "";
                            }
                        }

                        text+='\n\n <a href="'+config.site.url+'/exam">点击生成你的专属考试页面或更新</a>' +
                            '\n\n最后更新时间:'+common.dateChina(exams.data.updateAt*1000) ;
                        res.reply(text);
                        return;

                    }else{
                        dbs.getWechatText({
                            name:"noExams"
                        },function(eee,rrrr){
                            if(eee){
                                res.reply(JSON.stringify(eee));
                                return;
                            }
                            //console.log(rrrr);
                            res.reply(rrrr.replace("\n","\n"));
                            return;
                        });
                    }
                    return;


                }else if(exams.code==2012){

                    dbs.getWechatNews({
                        name:"deanPasswordError"
                    },function(eee,rrrr){
                        if(eee){
                            res.reply(JSON.stringify(eee));
                            return;
                        }
                        //console.log(rrrr);
                        res.reply(rrrr);

                    });

                    return;

                }else if(exams.code==2010 || exams.code==2011){
                    dbs.getWechatText({
                        name:"getExamLater"
                    },function(eee,rrrr){
                        if(eee){
                            res.reply(JSON.stringify(eee));
                            return;
                        }
                        //console.log(rrrr);
                        res.reply(rrrr);
                        return;

                    });

                    return;

                }
                res.reply(exams.code+":"+exams.message);
                return;



            });

    });

};

module.exports = user;