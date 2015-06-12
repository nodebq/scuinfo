
(function(bom,dom,$){
    $(".container").on('click','.refresh',function() {

        $(this).children().addClass('am-icon-spin');

        var refreshButton=$(this).children();
        $.post('/api/update', {type: "book"}, function (data) {

            refreshButton.removeClass('am-icon-spin');

            if(data.code==200){

                $("#modalUpdateTips").modal('open');
                setTimeout(function(){
                    $("#modalUpdateTips").modal('close');

                },2000);

            }else if(data.code==2021 || data.code==2015 || data.code==2012 || data.code ==2031){
                location.href="/bind/library";

            }else{
                alert(data.message)
            }

        }).fail(function(){
            refreshButton.removeClass('am-icon-spin');
            alert('请求错误');
        });

    });
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

$.get('/api/book',function(r){
    $("#loading").css('display','none');
    if(r.code==200){

        console.log($("#shreBook"));
        $("#shareBook").attr('wechatTitle', r.data.nickname+"的川大在借书单("+ r.data.count+"本)").clone();
        $("#shareBook").attr('wechatDesc','点击查看').clone();
        $("#shareBook").attr('wechatImg', r.data.avatar).clone();
        $("#shareBook").attr('wechatUrl',getBookHref({id: r.data.userId})).clone();
        $("#userAvatar").html("<img src='"+ r.data.avatar+"'>");
        $("#nickname").text(r.data.nickname);
        $("#profile-post-count").text(r.data.count);
        //$("#profile-like-count").text(r.data.likePostsCount);
        var data = r.data.books;

        if(data.length>0){
            var html="";
            for (var i=0;i<data.length;i++){
                html+='<div class="am-panel am-panel-default">'+
                    '<article class="am-panel-bd book-body" xc="'+data[i].xc+'" barcode="'+data[i].barcode+'" borId="'+data[i].borId+'"><div class="bookInfo">'
                    +(((data[i].deadline-parseInt(new Date().getTime()/1000))>0)?"还有":"已超期")+'<span class="left '+(((data[i].deadline-parseInt(new Date().getTime()/1000))>0)?"":"over")+'">'+Math.abs(parseInt((data[i].deadline-parseInt(new Date().getTime()/1000))/3600/24))+'</span>天（'+(new Date(data[i].deadline*1000).getFullYear())+'.'+(new Date(data[i].deadline*1000).getMonth()+1)+'.'+new Date(data[i].deadline*1000).getDate()+')'+
            '<br><span class="bookTitle">《'+data[i].name+'》</span></div>'+
                '<span class="renewButton"><button type="button" '+(((data[i].deadline-parseInt(new Date().getTime()/1000))>0)?"":'disabled=disabled')+' class="am-btn am-btn-'+(((data[i].deadline-parseInt(new Date().getTime()/1000))>0)?"success":'default')+' am-round renew">续</button></span>'+
                '</article>'+
                '</div>'

            }
            $("#book").html(html).clone();

            return;
        }else{
            //没有图书

            $(".container").html('<div style="margin-top:30px;color:rgba(0,0,0,0.4);text-align:center"><p>^_^当前并没有借书</p><p>最后更新时间:'+ date(r.data.updateAt*1000)+'</p> </div><div class="radiusButton refresh"><i class="am-icon-refresh"></i></div>');



        }





        return;



    }else if(r.code==2021 || r.code == 2015 || r.code==2012 || r.code ==2031){
        alert(r.message);
        location.href="/bind/library";

    }else if(r.code==2010 || r.code ==2029 || r.code == 2028 || r.code == 2032){
        $(".container").html('<div style="margin-top:30px;color:rgba(0,0,0,0.4);text-align:center">^_^请稍后回来查看结果</div>');
        alert('首次查询，系统需要花大约3分钟来更新你的数据，更新结果稍后将会在微信scuinfo通知你。');

    }else if(r.code==2011 || r.code==2033){
        alert('你的密码有更改，系统需要花大约3分钟来更新你的最新数据，更新结果稍后将会在微信scuinfo通知你。');

        $(".container").html('<div style="margin-top:30px;color:rgba(0,0,0,0.4);text-align:center">^_^请稍后回来查看结果</div>');

    }else{
        $(".container").html('<div style="margin-top:30px;color:rgba(0,0,0,0.4);text-align:center">^_^请稍后回来查看结果 </div>');
        alert(r.message);
    }
});


    $(".container").on('click','.setLibrary',function(){
        location.href = "/bind/library";
    });
    $("#book").on('click','.renew',function(){
       var renewButton=$(this);
        $(this).html('<i class="am-icon-refresh am-icon-spin"></i>');
        var book = $(this).parents('article');
        $.post("/api/renew",{xc:book.attr('xc'),barcode:book.attr('barcode'),borId:book.attr('borId')},function(r){
console.log(r);

            if(r.code==200){


                $("#modalTips").modal('open');
                setTimeout(function(){
                    $("#modalTips").modal('close');

                },2000);
            }else if(r.code==2021 || r.code==2012){

                location.href="/bind/library";


            }else{
                alert(r.message);
            }
            renewButton.html("续");

        })


    });
    $("#shareBook").on('click',function() {

        wechatTitle = $(this).attr('wechatTitle');
        wechatDesc = $(this).attr('wechatDesc');
        wechatLink = $(this).attr('wechatUrl');
        wechatImg = $(this).attr('wechatImg');
        console.log($("#userId").val());
        $.post('/api/share',{
            userId:$("#userId").val(),
            type:"book",
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
