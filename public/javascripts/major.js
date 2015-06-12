
(function(bom,dom,$){

    var currentDay=undefined;
    if(getWeek()==0){
        currentDay=7;
    }else{
        currentDay=getWeek();
    }

    console.log($($("table tr th")[currentDay]).css('color','rgba(26, 188, 156,1.0)'));


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

$.get('/api/major',function(r){
    $("#loading").css('display','none');
    console.log(r);
    if(r.code==200){
        var lessonCount=0;
        for (var i=0;i< r.data.majors.length;i++){
            var lesson= r.data.majors[i].lesson.split(',');
            if(lesson[0]) {
                lessonCount += lesson.length;
            }
        }
        $("#shareMajor").attr('wechatTitle', "我下学期的共要上"+(lessonCount*17)+"小时的课").clone();
        $("#shareMajor").attr('wechatDesc','点击查看').clone();
        $("#shareMajor").attr('wechatImg', r.data.avatar).clone();
        $("#shareMajor").attr('wechatUrl',getMajorHref({id: r.data.userId})).clone();
        $("#userAvatar").html("<img src='"+ r.data.avatar+"'>");
        $("#nickname").text(r.data.nickname);
        $("#profile-post-count").text(r.data.count);
        var majorsData = r.data.majors;
        var creditCount=0;
        for (var i=0;i< majorsData.length;i++){
            creditCount+=parseInt(majorsData[i].credit);
        }

        $("#profile-credit-count").text(creditCount);
        var data = r.data.majors;

        if(data.length>0){
            var html="";
            var flags=[];

            for(var k=0;k<13;k++){
                flags[k]=[];

            }

            for(var k=0;k<13;k++) {

                for (var j = 0; j < 7; j++) {
                    flags[k][j] =false;
                }
            }

            for(var k=0;k<13;k++){

                html+='<tr><td style="color:rgba(0,0,0,0.4)">'+(k+1)+'</td>';

                for(var j=0;j<7;j++){

                    var flag=false;
                    for (var i=0;i<data.length;i++){
                        var isCurrentWeek = data[i].weekHasLesson.split(',').indexOf(""+ r.data.currentWeek);
                        var lesson=data[i].lesson.split(',');
                    if(data[i].week==(j+1)){


                        if(flags[k][j]){
                            flag=true;
                        }else{
                            if(lesson[0]==(k+1)){

                                for(var l=0;l<lesson.length-1;l++){
                                    var one=parseInt(lesson[l+1]-1);
                                    var two=parseInt(j);
                                    flags[one][two]=true;
                                }
                                flag=true;
                                console.log(isCurrentWeek);
                                console.log('222');
                                html+='<td style="background-color:'+((isCurrentWeek!=-1)?randomColor():"rgba(0,0,0,0.1")+'" rowspan="'+lesson.length+'">'+'<div class="major-content"><div class="major-name" style="'+((isCurrentWeek!=-1)?"":"color:rgba(0,0,0,0.4)")+'">'+data[i].name+'@'+data[i].building+data[i].classroom+'</div></div>'+'</td>';
                            }else{
                            }
                        }



                    }


                }

                    if(flag==false){
                        html+='<td></td>';
                    }


            }
            html+='</tr>';

            }
            $("#majorData").html(html).clone();

            return;
        }else{
            //没有课

            //$("#majorData").html('<tr><td colspan="8" style="color:rgba(0,0,0,0.4)">^_^当前没有课</td> </tr>>');
            $(".container").html('<div style="margin-top:30px;color:rgba(0,0,0,0.4);text-align:center"><p>^_^当前并没有课</p><p>最后更新时间:'+ date(r.data.updateAt*1000)+'</p> </div><div class="radiusButton refresh"><i class="am-icon-refresh"></i></div>');



        }





        return;



    }else if(r.code==2021 || r.code==2012 || r.code ==2031){

        location.href="/bind/dean";

    }else if(r.code==2010 || r.code ==2029 || r.code == 2028 || r.code == 2032){
        $(".container").html('<div style="margin-top:30px;color:rgba(0,0,0,0.4);text-align:center">^_^请稍后回来查看结果</div>');
        alert('首次查询，系统需要花大约3分钟来更新你的数据，更新结果稍后将会在微信scuinfo通知你。');

    }else if(r.code==2011 || r.code==2033){
        alert('你的密码有更改，系统需要花大约3分钟来更新你的最新数据，更新结果稍后将会在微信scuinfo通知你。');

        $(".container").html('<div style="margin-top:30px;color:rgba(0,0,0,0.4);text-align:center">^_^请稍后回来查看结果</div>');

    }else{
        alert(r.message);
        $(".container").html('<div style="margin-top:30px;color:rgba(0,0,0,0.4);text-align:center">^_^请稍后回来查看结果 </div>');


    }
});

    $(".container").on('click','.setDean',function(){
        location.href = "/bind/dean";
    });

    $(".container").on('click','.refresh',function() {

        $(this).children().addClass('am-icon-spin');

        var refreshButton=$(this).children();
        $.post('/api/update', {type: "major"}, function (data) {

            refreshButton.removeClass('am-icon-spin');

            if(data.code==200){

                $("#modalTips").modal('open');
                setTimeout(function(){
                    $("#modalTips").modal('close');

                },2000);

            }else if(data.code ==2001|| data.code==2021 || data.code==2012 || data.code ==2031){
                alert(data.message);
                location.href="/bind/dean";

            }else{
                alert(data.message)
            }

        }).fail(function(){
            refreshButton.removeClass('am-icon-spin');
            alert('请求错误');
        });

    });

    $("#shareMajor").on('click',function() {

        wechatTitle = $(this).attr('wechatTitle');
        wechatDesc = $(this).attr('wechatDesc');
        wechatLink = $(this).attr('wechatUrl');
        wechatImg = $(this).attr('wechatImg');
        console.log($("#userId").val());
        $.post('/api/share',{
            userId:$("#userId").val(),
            type:"major",
            avatar:wechatImg,
            nickname:$("#nickname").text()
        },function(data){
            console.log(data);
        });



        if(weixinBrowser) {
            $("#wechatShareTips").css('display', "block");

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
                    //插入分享表

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

            article=$(this);
            wbUrl			= encodeURIComponent(article.attr('wechatUrl')),
                wbAppkey		= $("#weiboAppKey").val(),
                wbTitle			= encodeURIComponent(article.attr('wechatTitle')),
                wbRalateUid	= $("#weiboUid").val(),
                wbPic			= "",
                wbLanguage	= "zh_cn";
            location.href = "http://service.weibo.com/share/share.php?url="+wbUrl+"&appkey="+wbAppkey+"&title="+wbTitle+"&pic="+wbPic+"&ralateUid="+wbRalateUid+"&language="+wbLanguage+"";

        }

    });


})(self,self.document,self.jQuery);
