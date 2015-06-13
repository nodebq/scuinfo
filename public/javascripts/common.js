(function(bom,dom,$){

    var baseUrl="http://scuinfo.com";

    /**
     * 输出格式化的时间
     * @param time
     * @returns {string}
     */
    bom.date = function (time) {
        if(time){
            return new Date(time).getFullYear().toString()+"年"+(new Date(time).getMonth()+1).toString()+"月"+new Date(time).getDate(time).toString()+"日 "+new Date(time).getHours().toString()+":"+((new Date(time).getMinutes()<10)?"0":"")+(new Date(time).getMinutes()).toString()

        }
        return new Date().getFullYear().toString()+"年"+(new Date().getMonth()+1).toString()+"月"+new Date().getDate().toString()+"日 "+new Date().getHours().toString()+":"+((new Date(time).getMinutes()<10)?"0":"")+new Date().getMinutes().toString()
    };

    /**
     * 输出格式化的时间
     * @param time
     * @returns {string}
     */
    bom.day = function (time) {
        if(time){
            return new Date(time).getFullYear().toString()+"年"+(new Date(time).getMonth()+1).toString()+"月"+new Date(time).getDate(time).toString()+"日";

        }
        return new Date().getFullYear().toString()+"年"+(new Date().getMonth()+1).toString()+"月"+new Date().getDate().toString()+"日"
    };

    /**
     * 输出格式化的小时:分钟
     * @param time
     * @returns {string}
     */
    bom.hour = function (time) {
        if(time){
            return new Date(time).getHours().toString()+":"+((new Date(time).getMinutes()<10)?"0":"")+new Date(time).getMinutes().toString()

        }
        return new Date().getHours().toString()+":"+((new Date(time).getMinutes()<10)?"0":"")+new Date().getMinutes().toString()
    };
    /**
     * 获取当天的星期数
     */
    bom.getWeek = function()
    {
        return new Date().getDay();
    };

   bom.randomColor = function() {
       var colors = ["#64C0E5", "#98D261", "#E296B4", "#90DAA3", "#F09E9C", "#8CA9E9", "#F5AB8A","#FDAD8B","#F6C86A","#7AC0A4"];
       var rand = Math.floor(Math.random() * colors.length);
       return colors[rand];
   };
    bom.getWechatImg = function(o){

        return 'http://img5q.duitang.com/uploads/blog/201504/03/20150403214054_nekQt.jpeg';
    };
    bom.isWeixin = function(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            return true;
        } else {
            return false;
        }
    };


    var weixinBrowser = isWeixin();
    var wechatTitle=$('title').text(),wechatLink=$("#url").val(),wechatImg="http://ww2.sinaimg.cn/large/d9f8fd81gw1e9nzda6i7kj20rs0rs75i.jpg",wechatDesc="";
    //todo 默认的图片

bom.getDateDiff = function(dateTimeStamp) {
//JavaScript函数：

    var minute =  60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var year = day * 365;
    var now = parseInt(new Date().getTime()/1000);
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        //若日期不符则弹出窗口告之
        //alert("结束日期不能小于开始日期！");
    }
    var yearC = diffValue / year;
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;

    if (yearC >= 1) {
        result = "" + parseInt(monthC) + "年前";
    } else if (monthC >= 1) {
        result = "" + parseInt(monthC) + "个月前";
    }
    else if (weekC >= 1) {
        result = "" + parseInt(weekC) + "周前";
    }
    else if (dayC >= 1) {
        result = "" + parseInt(dayC) + "天前";
    }
    else if (hourC >= 1) {
        result = "" + parseInt(hourC) + "个小时前";
    }
    else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
    } else
        result = "刚刚";
    return result;
};
    bom.insert=function(content,index,value)
    {
        var str1 = content.substring(0,index);
        var str2 = content.substring(index);
        return str1+value+str2;
    };


    /**
     * 检测标签
     * @param o
     * @returns {} or false
     */
    bom.checkTag = function(o){
        if(!o.content){
            return false;
        }
        //console.log(o.content);
        var index = o.content.indexOf("#", (o.index>=0)?o.index:0);
       //console.log(index);
        if(index>=0) {
            var nextIndex = o.content.indexOf("#", (index + 2));
            
            //console.log('next'+nextIndex);
            if (nextIndex >= (index + 2)) {

                var name = o.content.substring((index + 1), nextIndex);


                if(name.indexOf(" ")>=0 || name.indexOf("\n")>=0 || name.indexOf("\r")>=0 || name.indexOf("#")>=0){
                   // console.log(name);
                    return {
                        nextIndex:index+1,
                        content: o.content,
                        absoluteNextIndex:index+1+ (o.offset? o.offset:0),
                        code:3002 //非法的#,跳过
                    }

                }

//console.log(index);
//                console.log(nextIndex+1+ (o.offset? o.offset:0));

                return {
                    index:index,
                    nextIndex:nextIndex+1,
                    absoluteIndex:index+ (o.offset? o.offset:0),
                    absoluteNextIndex:nextIndex+1+ (o.offset? o.offset:0),
                    content: o.content,
                    name:name,
                    code:200 //正常

                };
            }
            return false;
        }

        return false;
    };

    /**
     * 组装这个文章里的所有tag
     * @param o
     * @return array []
     */
    bom.tag = function(o){
        var tags = [];
        //console.log(o);
        var initTag = bom.checkTag(o);
        //console.log(initTag);
        if(initTag){
            if(initTag.code==200) {
                tags.push({name:initTag.name,
                absoluteIndex:initTag.absoluteIndex,
                absoluteNextIndex:initTag.absoluteNextIndex});
            }
            var tag = bom.checkTag({
                content: initTag.content.substr(initTag.nextIndex),
                offset:initTag.absoluteNextIndex
            });
            //console.log(tag);

            while(tag){
                if(tag.code==200) {
                    tags.push({name:tag.name,
                    absoluteIndex:tag.absoluteIndex,
                    absoluteNextIndex:tag.absoluteNextIndex});
                }
                if(tag.content.substr(tag.nextIndex)) {
                    tag = bom.checkTag({
                        content: tag.content.substr(tag.nextIndex),
                        offset:tag.absoluteNextIndex
                    });
                    //console.log(tag);
                }else{
                    tag = false;
                    //console.log(tag);
                }
            }

        }
        return tags;
    };

    bom.cssTag = function(o){
        var tags =  bom.tag({content: o.content});
//console.log(tags);
        var first,second;
        for(var i=0;i<tags.length;i++){
            //console.log(o.content);
            //console.log(tags[i].absoluteIndex);
            //console.log(tags[i].absoluteNextIndex);
            ////todo
            first = tags[i].absoluteIndex+i*25;
            second = tags[i].absoluteNextIndex+i*25+18;
            //console.log(first);
            //console.log(second);

            o.content = bom.insert(o.content,first,'<span class="tag">');
            o.content =  bom.insert(o.content,second,'</span>');
            //console.log(o.content);
        }
        return o.content;

    };

    bom.subTitle = function(o){
        if(o.more){
            try{
               var title = o.title.substr(0,140)
            }catch(e){
               var title =""
            }



      return bom.cssTag({content:title})+'...';
            }
        try{
            var title = o.title.substr(0,140)
        }catch(e){
            var title =""
        }

        return bom.cssTag({content:title});
    };

    bom.getWechatTitle = function(o){

        try{
            var title = o.title.substr(0,29)
        }catch(e){
            var title =""
        }
       // console.log(o);
        if(o.title.length>29) {
            return title+'...';
        }else{
            return title;
        }
    };


    bom.getWeiboTitle = function(o){

        try{
            var title = o.title.substr(0,120)
        }catch(e){
            var title =""
        }
        // console.log(o);
        if(o.title.length>120) {
            return title+'...';
        }else{
            return title;
        }
    };
//mark
    bom.getPostHref = function(o){

        return baseUrl+'/p/'+ o.id;
    };

//mark
    bom.getBookHref = function(o){

        return baseUrl+'/share/book/?userId='+ o.id;
    };
//mark
    bom.getExamHref = function(o){

        return baseUrl+'/share/exam/?userId='+ o.id;
    };
    bom.getMajorHref = function(o){

        return baseUrl+'/share/major?userId='+ o.id;
    };

    /**
     * 检测提交文章的参数
     * @param o
     * @param cb
     */
    bom.check = function (o,cb){
        //console.log(o);
        if(!o.id){
            cb({
                code:3007,
                message:"缺少id参数"
            });
            return;
        }
        cb(null,{
            id: o.id
        });


    };

    /**
     *
     * @param o
     * @param cb
     */
    bom.delete = function(o,cb){

        bom.check(o,function(e,r){
            if(e){
                cb(e);
                return;
            }

            //console.log(r);
            $.ajax({
                type: 'DELETE',
                url: '/api/post',
                data: JSON.stringify(r),
                success: function(data) { //alert('data: ' + data);
                    cb(data);
                },
                contentType: "application/json",
                dataType: 'json'
            });
        })

    };
    bom.checkPost = function(o,cb){
        if(!o.id){
            cb({
                code:3004,
                message:"请传入id"
            });
            return;
        }



        cb(null, o);
    };
    bom.postLike = function(o,cb){
        bom.checkPost(o,function(e,r){
            if(e){
                cb(e.message);
                return;
            }
            //console.log('2');
            $.ajax({
                type: o.method?o.method:"POST",
                url: '/api/like/post',
                data: JSON.stringify(r),
                success: function(data) { //alert('data: ' + data);
                    console.log(data);
                    cb(null,data);
                },
                contentType: "application/json",
                dataType: 'json'
            });
        });
    };

    $("#posts").on('click','.posts-footer-like-area',function(){
        var id =  $(this).parent().parent().attr('id') ;
        var $icon =$($(this).children()[0]);
        var $iconCount =$($(this).children()[1]);
        if($icon.hasClass("posts-footer-icon-active")){

            $icon.removeClass("posts-footer-icon-active");
            if((parseInt($iconCount.text())-1)>=0) {
                $iconCount.text((parseInt($iconCount.text()) - 1));
            }
            bom.postLike({
                id:id,
                method:"DELETE"
            },function(e,r){
                if(e){
                        $iconCount.text((parseInt($iconCount.text()) +1));
                    $icon.addClass("posts-footer-icon-active");
                    console.log(e);
                    alert(e.message);
                    return;
                }

                if(r.code!=200){
                        $iconCount.text((parseInt($iconCount.text()) +1));
                    $icon.addClass("posts-footer-icon-active");
                    console.log(r);
                    alert(r.message);
                    return;
                }



            });
        }else{

            $icon.addClass("posts-footer-icon-active");
            $iconCount.text((parseInt($iconCount.text())+1));
            bom.postLike({
                id:id
            },function(e,r){
                if(e){
                    console.log(e);
                    $icon.removeClass("posts-footer-icon-active");
                    $iconCount.text((parseInt($iconCount.text())-1));

                    alert(e.message);

                    return;
                }
                if(r.code!=200) {
                    console.log(r);
                    $icon.removeClass("posts-footer-icon-active");
                    $iconCount.text((parseInt($iconCount.text())-1));

                    alert(r.message);

                    if(r.code == 2015) {
                        location.href = baseUrl+'/signin?redirect=' +$("#url").val()
                    }

                    return;
                }

            });
        }


    });



    $("#posts").on('click','.posts-header-share',function() {



        if(weixinBrowser) {
            $("#wechatShareTips").css('display', "block");
            var id = $(this).parent('article').attr('id');
            wechatTitle = $(this).parents('article').attr('wechatTitle');
            wechatDesc = $(this).parents('article').attr('weiboTitle');
            wechatLink = $(this).parents('article').attr('href');
            wechatImg = $(this).parents('article').attr('img');
            //console.log(wechatLink);
            wx.onMenuShareTimeline({
                title: wechatTitle,
                link: wechatLink,
                imgUrl: wechatImg,
                trigger: function (res) {
                    // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                    //alert('用户点击分享到朋友圈');
                },
                success: function (res) {
                    //alert('已分享');
                    $("#wechatShareTips").css('display', "none");

                },
                cancel: function (res) {
                    $("#wechatShareTips").css('display', "none");

                },
                fail: function (res) {
                    $("#wechatShareTips").css('display', "none");
                    alert(JSON.stringify(res));
                }
            });


            wx.onMenuShareAppMessage({
                title: wechatTitle, // 分享标题
                desc: wechatDesc, // 分享描述
                link: wechatLink, // 分享链接
                imgUrl: wechatImg, // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    $("#wechatShareTips").css('display', "none");

                },
                cancel: function () {
                    $("#wechatShareTips").css('display', "none");

                }
            });



            wx.onMenuShareQQ({
                title: wechatTitle, // 分享标题
                desc: wechatDesc, // 分享描述
                link: wechatLink, // 分享链接
                imgUrl: wechatImg, // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    $("#wechatShareTips").css('display', "none");

                },
                cancel: function () {
                    $("#wechatShareTips").css('display', "none");

                }
            });

            // });
        }else{

            article = $(this).parent().parent().parent();
                wbUrl			= encodeURIComponent(article.attr('href')),
                wbAppkey		= $("#weiboAppKey").val(),
                wbTitle			= encodeURIComponent(article.attr('weiboTitle')),
                wbRalateUid	= $("#weiboUid").val(),
                wbPic			= "",
                wbLanguage	= "zh_cn";
            location.href = "http://service.weibo.com/share/share.php?url="+wbUrl+"&appkey="+wbAppkey+"&title="+wbTitle+"&pic="+wbPic+"&ralateUid="+wbRalateUid+"&language="+wbLanguage+"";

        }

    });

    $("#wechatShareTips").on('click',function(){
        $("#wechatShareTips").css('display','none') ;
    });
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: $("#wechatAppId").val(), // 必填，公众号的唯一标识
        timestamp: $("#wechatTimestamp").val(), // 必填，生成签名的时间戳
        nonceStr: $("#wechatNonceStr").val(), // 必填，生成签名的随机串
        signature: $("#wechatSignature").val(),// 必填，签名，见附录1
        jsApiList: ['checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ'
            //'onMenuShareWeibo',
            //'hideMenuItems',
            //'showMenuItems',
            //'hideAllNonBaseMenuItem',
            //'showAllNonBaseMenuItem',
            //'translateVoice',
            //'startRecord',
            //'stopRecord',
            //'onRecordEnd',
            //'playVoice',
            //'pauseVoice',
            //'stopVoice',
            //'uploadVoice',
            //'downloadVoice',
            //'chooseImage',
            //'previewImage',
            //'uploadImage',
            //'downloadImage',
            //'getNetworkType',
            //'openLocation',
            //'getLocation',
            //'hideOptionMenu',
            //'showOptionMenu',
            //'closeWindow',
            //'scanQRCode',
            //'chooseWXPay',
            //'openProductSpecificView',
            //'addCard',
            //'chooseCard',
            //'openCard'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    $("#posts").on('click','.tag', function(ev){
        //console.log($(this).parents('article'));
        location.href = '/tag/'+$(this).text().substr(1,$(this).text().length-2);
        ev.stopPropagation();
    });

    //$("#posts").hammer({
    //    domEvents:true,
    //    threshold:1,
    //    velocity:0.8
    //}).on('swiperight','.posts-body', function(ev){
    //
    //    // alert('滑动')
    //    // console.log($(this));
    //    var like = $($(this).children()[0]);
    //    like.css('display','block');
    //    var id =  $(this).parent().attr('id') ;
    //    var likeIcon = $($($($(this).parent().children()[2]).children()[1]).children()[0]);
    //    var likeCount = $($($($(this).parent().children()[2]).children()[1]).children()[1]);
    //    if(likeIcon.hasClass("posts-footer-icon-active")){
    //        like.removeClass("posts-footer-icon-active");
    //        likeIcon.removeClass("posts-footer-icon-active");
    //        if((parseInt(likeCount.text())-1)>=0) {
    //            likeCount.text((parseInt(likeCount.text()) - 1));
    //        }
    //        bom.postLike({
    //            id:id,
    //            method:"DELETE"
    //        },function(e,r){
    //            if(e){
    //                like.addClass("posts-footer-icon-active");
    //                likeIcon.addClass("posts-footer-icon-active");
    //                    likeCount.text((parseInt(likeCount.text()) + 1));
    //                alert(e.message);
    //
    //                console.log(e);
    //                return;
    //            }
    //
    //            if(r.code!=200){
    //                alert(r.message);
    //                like.addClass("posts-footer-icon-active");
    //                likeIcon.addClass("posts-footer-icon-active");
    //                likeCount.text((parseInt(likeCount.text()) + 1));
    //            }
    //
    //        });
    //    }else{
    //        like.addClass("posts-footer-icon-active");
    //        likeIcon.addClass("posts-footer-icon-active");
    //        likeCount.text((parseInt(likeCount.text()) + 1));
    //        bom.postLike({
    //            id:id
    //        },function(e,r){
    //            if(e){
    //                like.removeClass("posts-footer-icon-active");
    //                likeIcon.removeClass("posts-footer-icon-active");
    //                likeCount.text((parseInt(likeCount.text()) - 1));
    //                console.log(e);
    //                alert(e.message);
    //                return;
    //            }
    //
    //            if(r.code!=200){
    //                like.removeClass("posts-footer-icon-active");
    //                likeIcon.removeClass("posts-footer-icon-active");
    //                likeCount.text((parseInt(likeCount.text()) - 1));
    //                console.log(e);
    //                alert(e.message);
    //                return;
    //            }
    //
    //        });
    //    }
    //    setTimeout(function(){
    //        like.css('display','none');
    //    },1000);
    //
    //});

    $("#posts").on('click','.posts-footer-more',function(){

            var x=$(this).parents('article').attr('level');
            console.log(x);
             console.log($(this).parents('article').attr('author'));//return;
            if($(this).parents('article').attr('author')==0  && $(this).parents('article').attr('level')!=1){
                $($(this).next().children()[1]).remove();
            }

            $(this).parent().on('open.dropdown.amui', function (e) {

                $("#posts").off('click','.posts-body');

            });



            $(this).parent().on('close.dropdown.amui', function (e) {
                $("#posts").on('click','.posts-body', function(ev){
                    location.href = '/p/'+$(this).parents('article').attr('id');
                });
                //console.log('open event triggered');
            });
            $(this).parent().dropdown('toggle');


        }
    );




    $("#posts").on('click','.shareToWeibo',function(){
        var weibo = $($(this).children()[0]);
        var article = $(this).parents('article');
        wbUrl			= article.attr('href'),
            wbAppkey		= $("#weiboAppKey").val(),
            wbTitle			= encodeURIComponent(article.attr('weiboTitle')),
            wbRalateUid	= $("#weiboUid").val(),
            wbPic			= "",
            wbLanguage	= "zh_cn";
        weibo.attr("href","http://service.weibo.com/share/share.php?url="+wbUrl+"&appkey="+wbAppkey+"&title="+wbTitle+"&pic="+wbPic+"&ralateUid="+wbRalateUid+"&language="+wbLanguage+"");
    });


    $("#posts").on('click','.posts-header-user',function(){
        if($(this).parents('article').attr('userId')=='0'){

        }else {
            location.href = '/u/'+$(this).parent().parent().parent().attr('userId');
        }
    });
    
    $("#title").on('dblclick',function(){

        window.scrollTo(0,0);
    });


})(self,self.document,self.jQuery);