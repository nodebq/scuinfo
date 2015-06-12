(function(bom,dom,$){

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
    $.get('/api/share/exam?userId='+$('#userId').val()+"&type=exam",function(r){
        console.log(r);
        $("#loading").css('display','none');
        if(r.code==200){
            $("#shareAvatar").html("<img src='"+ r.data.avatar+"'>");
            $("#shareDescription").text('「'+r.data.nickname+'的考表」');
            $("#nickname").val(r.data.nickname);
            //$("#profile-like-count").text(r.data.likePostsCount);
            var data=[];
            for (var i=0;i<r.data.exams.length;i++){
                if(r.data.exams[i].examName=='期末考试') {
                    data.push(r.data.exams[i]);
                }

            }
            if(data.length>0){
                function sortByTime(a,b){
                    if(parseInt(a.start)> parseInt(b.start)){
                        return 1;
                    }else{
                        return -1;
                    }

                }

                data.sort(sortByTime);
                var word=''
                var gender=(r.data.gender==1)?"他":"她";

                if(data.length>=4){
                    word='，你们别再找'+gender+'玩了'
                }else{
                    word='';
                }

                var html='<li><time class="cbp_tmtime" datetime="2015-06-28 16:30"><span>2015.6.28</span> <span>开考</span></time>'+
                    '<div class="cbp_tmicon refresh"><i class="am-icon-calendar-o"></i></div>'+
                    '<div class="cbp_tmlabel"><h2>共有'+data.length+'门考试</h2><p>从'+date(data[0].start*1000)+'起</p>'+
                    '<p>到'+date(data[data.length-1].end*1000)+'止 </p></div></li>';

                for (var i=0;i<data.length;i++){

                    html+='<li><time class="cbp_tmtime" datetime="'+data[i].start*1000+'"><span>'+day(data[i].start*1000)+'</span> <span>'+hour(data[i].start*1000)+'</span></time>'+
                        '<div wechatTitle="'+ r.data.nickname+'期末有'+data.length+'门试要考'+word+'" wechatDesc="点击查看考表" wechatImg="'+ r.data.avatar+'" wechatUrl="'+getExamHref({id: r.data.userId})+'" class="cbp_tmicon shareTheBookList"><i class="am-icon-external-link"></i></div>'+
                        '<div class="cbp_tmlabel"><h2>'+(((new Date().getTime()/1000)>data[i].end)?'<span class="am-icon-check-square-o"></span> ':"")+data[i].name+'</h2><p><span class="am-icon-clock-o"></span> '+date(data[i].start*1000)+'~'+hour(data[i].end*1000)+'</p><p><span class="am-icon-location-arrow"></span> '+data[i].campus+"校区"+data[i].building+data[i].classroom+'</p></div></li>';

                }
                $("#shareSection").html(html).clone();

                $("#findMyBook").html('<a href="/exam" type="button" class="am-btn am-btn-default am-radius am-btn-block hrefNone"><i class="am-icon-calendar"></i> 查看我的考表</a>').clone();


            }else{
                //没有图书

                $("#shareSection").html('^_^当前没有考试');



            }

            return;



        }else if(r.code==2021 || r.code==2012 || r.code ==2031){
            location.href="/bind/dean";

        }else{
            alert(r.message);
        }
    });



    $("#shareSection").on('click','.refresh',function() {
        location.href="/exam";
    });

    $("#shareSection").on('click','.shareTheBookList',function() {
        wechatTitle = $(this).attr('wechatTitle');
        wechatDesc = $(this).attr('wechatDesc');
        wechatLink = $(this).attr('wechatUrl');
        wechatImg = $(this).attr('wechatImg');

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