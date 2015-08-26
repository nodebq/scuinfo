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
    $.get('/api/examAgain',function(r){
        console.log(r);
        $("#loading").css('display','none');
        if(r.code==200){

            var lessonCount=0;

            $("#shareAvatar").html("<img src='"+ r.data.avatar+"'>");
            $("#shareDescription").text('「'+r.data.nickname+'的考表」');
            $("#nickname").val(r.data.nickname);
            //$("#profile-like-count").text(r.data.likePostsCount);
            var data=[];
            for (var i=0;i<r.data.exams.length;i++){
                    data.push(r.data.exams[i]);

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
                var word='';
                var gender=(r.data.gender==1)?"他":"她";

                if(data.length>=4){
                    word='，你们别再找'+gender+'玩了'
                }else{
                    word='';
                }
                var html='<li><time class="cbp_tmtime" datetime="'+data[0].start*1000+'"><span>'+(day(data[0].start*1000))+'</span> <span>开考</span></time>'+
                '<div class="cbp_tmicon refresh"><i class="am-icon-refresh"></i></div>'+
                '<div class="cbp_tmlabel"><h2>共有'+data.length+'门考试</h2><p>从'+date(data[0].start*1000)+'起</p>'+
                '<p>到'+date(data[data.length-1].end*1000)+'止 </p></div></li>';
                //$("#shareTheBookList").html('<a  class="am-btn am-btn-default am-btn-block hrefNone" id="shareBook"><i class="am-icon-wechat"></i>分享我的考表</a>').clone();


                for (var i=0;i<data.length;i++){
                    console.log(data[i]);


                    html+='<li><time class="cbp_tmtime" datetime="'+data[i].start*1000+'"><span>'+(day(data[i].start*1000))+'</span> <span>'+hour(data[i].start*1000)+'</span></time>'+
                        '<div wechatTitle="'+ r.data.nickname+'开学有'+data.length+'门试要考'+word+'" wechatDesc="点击查看考表" wechatImg="'+ r.data.avatar+'" wechatUrl="'+getExamAgainHref({id: r.data.userId})+'" class="cbp_tmicon shareTheBookList"><i class="am-icon-external-link"></i></div>'+
                        '<div class="cbp_tmlabel"><h2>'+(((new Date().getTime()/1000)>data[i].end)?'<span class="am-icon-check-square-o"></span> ':"")+data[i].name+'</h2><p><span class="am-icon-clock-o"></span> '+date(data[i].start*1000)+(data[i].start?'~':"")+hour(data[i].end*1000)+'</p><p><span class="am-icon-location-arrow"></span> '+(data[i].campus+data[i].building?"校区":"")+data[i].building+data[i].classroom+'</p></div></li>';

                }
                $("#shareSection").html(html).clone();
                $("#shareTips").html('<a type="button" wechatTitle="'+ r.data.nickname+'开学有'+data.length+'门试要考'+word+'" wechatDesc="点击查看考表" wechatImg="'+ r.data.avatar+'" wechatUrl="'+getExamAgainHref({id: r.data.userId})+'" class="am-btn am-btn-default am-radius am-btn-block hrefNone shareTheBookList"><i class="am-icon-wechat"></i> 分享我的考表</a>').clone();


            }else{
                //没有图书

                $(".main").html('<div style="margin-top:30px;color:rgba(0,0,0,0.4);text-align:center"><p>^_^当前没有补缓考</p><p>最后更新时间:'+ date(r.data.updateAt*1000)+'</p> </div><div class="radiusButton refresh"><i class="am-icon-refresh"></i></div>');



            }

            return;



        }else if(r.code ==2001 || r.code==2021 || r.code==2012 || r.code ==2031){
            alert(r.message);
            location.href="/bind/dean";

        }else if(r.code==2010 || r.code ==2029 || r.code == 2028 || r.code == 2032){
            $(".main").html('<div style="margin-top:30px;color:rgba(0,0,0,0.4);text-align:center">^_^请稍后回来查看结果</div>');
   alert('首次查询，系统需要花大约3分钟来更新你的数据，更新结果稍后将会在微信scuinfo通知你。');

        }else if(r.code==2011 || r.code==2033){
            alert('你的密码有更改，系统需要花大约3分钟来更新你的最新数据，更新结果稍后将会在微信scuinfo通知你。');

            $(".main").html('<div style="margin-top:30px;color:rgba(0,0,0,0.4);text-align:center">^_^请稍后回来查看结果</div>');

        }else{
            $(".main").html('<div style="margin-top:30px;color:rgba(0,0,0,0.4);text-align:center">^_^请稍后回来查看结果</div>');

            alert(r.message);
        }
    });


    $(".container").on('click','.setDean',function(){
        location.href = "/bind/dean";
    });

    $(".main").on('click','.refresh',function() {
        
        console.log($(this).children());
        $(this).children().addClass('am-icon-spin');

        var refreshButton=$(this).children();
        $.post('/api/update', {type: "exam"}, function (data) {

            refreshButton.removeClass('am-icon-spin');

            if(data.code==200){

                $("#modalTips").modal('open');
                setTimeout(function(){
                    $("#modalTips").modal('close');

                },2000);

            }else if(data.code==2021 || data.code==2012 || data.code ==2031){
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

    $("#shareSection").on('click','.shareTheBookList',function() {

        wechatTitle = $(this).attr('wechatTitle');
        wechatDesc = $(this).attr('wechatDesc');
        wechatLink = $(this).attr('wechatUrl');
        wechatImg = $(this).attr('wechatImg');
        $.post('/api/share',{
            userId:$("#userId").val(),
            type:"examAgain",
            avatar:wechatImg,
            nickname:$("#nickname").val(),
            gender:$("#gender").val()
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

    $("#shareTips").on('click','.shareTheBookList',function() {
        wechatTitle = $(this).attr('wechatTitle');
        wechatDesc = $(this).attr('wechatDesc');
        wechatLink = $(this).attr('wechatUrl');
        wechatImg = $(this).attr('wechatImg');
        $.post('/api/share',{
            userId:$("#userId").val(),
            type:"examAgain",
            avatar:wechatImg,
            nickname:$("#nickname").val(),
            gender:$("#gender").val()
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


            article=$(this);
            wbUrl			= encodeURIComponent(article.attr('wechatUrl')),
                wbAppkey		= $("#weiboAppKey").val(),
                wbTitle			= encodeURIComponent(article.attr('wechatTitle')),
                wbRalateUid	= $("#weiboUid").val(),
                wbPic			= "",
                wbLanguage	= "zh_cn";
            //console.log('2222');
            //console.log(wbTitle);
            location.href = "http://service.weibo.com/share/share.php?url="+wbUrl+"&appkey="+wbAppkey+"&title="+wbTitle+"&pic="+wbPic+"&ralateUid="+wbRalateUid+"&language="+wbLanguage+"";

        }

    });

})(self,self.document,self.jQuery);