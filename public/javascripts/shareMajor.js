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
    $.get('/api/share/major?userId='+$('#userId').val()+"&type=book",function(r){
        console.log(r);
        $("#loading").css('display','none');
        if(r.code==200){

            var lessonCount=0;
            for (var i=0;i< r.data.majors.length;i++){
                var lesson= r.data.majors[i].lesson.split(',');
                if(lesson[0]) {
                    lessonCount += lesson.length;
                }
            }
            console.log(lessonCount);

            $("#shareTheBookList").attr('wechatTitle', r.data.nickname+"下学期的共要上"+(lessonCount*17)+"小时的课").clone();
            $("#shareTheBookList").attr('wechatDesc','点击查看').clone();
            $("#shareTheBookList").attr('wechatImg', r.data.avatar).clone();
            $("#shareTheBookList").attr('wechatUrl',getBookHref({id: r.data.userId})).clone();
            $("#shareAvatar").html("<img src='"+ r.data.avatar+"'>");
            $("#shareDescription").text('「'+r.data.nickname+'的课单」');
            //$("#profile-like-count").text(r.data.likePostsCount);
            var data = r.data.majors;
            if(data.length>0){
                var html="";
                for (var i=0;i<data.length;i++){
                    html+='<article class="shareBody" id="shareBody"><div class="shareInfo"><div class="shareOrder">'+
                        '<button class="am-btn am-btn-default am-round shareOrderButton">'+(i+1)+'</button>'+
                        '</div><div class="shareContent">'+
                        '<div class="shareTitle">'+data[i].name+'</div>'+
                    '<span class="shareAuthor">'+data[i].teacherName+'·'+data[i].property+'</span>'+
                    '</div></div></article>';

                }
                console.log(html);
                $("#shareSection").html(html).clone();

            }else{
                //没有图书

                $("#shareSection").html('^_^ta当前没有课');



            }

            $("#findMyBook").html('<a href="/major" type="button" class="am-btn am-btn-default am-radius am-btn-block hrefNone"><i class="am-icon-book"></i> 查看我的课单</a>').clone();
            $("#shareTheBookList").html('<a  class="am-btn am-btn-default am-btn-block hrefNone" id="shareBook"><i class="am-icon-wechat"></i>分享此课单</a>').clone();

            return;



        }else if(r.code==2021 || r.code==2012 || r.code ==2031){
            alert(r.message);
            //location.href="/bind/library";

        }else{
            alert(r.message);
        }
    });

    $("#shareTheBookList").on('click',function() {
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

/*

    $.get('/api/book',function(r){
        $("#loading").css('display','none');
        if(r.code==200){

            console.log($("#shreBook"));
            $("#shareBook").attr('wechatTitle', r.data.nickname+"在川大图书馆借的书单("+ r.data.count+"本)").clone();
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
                        '<span class="renewButton"><button type="button" '+(((data[i].deadline-parseInt(new Date().getTime()/1000))>0)?"":'')+' class="am-btn am-btn-'+(((data[i].deadline-parseInt(new Date().getTime()/1000))>0)?"success":'default')+' am-round renew">续</button></span>'+
                        '</article>'+
                        '</div>'

                }
                $("#book").html(html).clone();

                return;
            }else{
                //没有图书

                $("#book").html('^_^ 当前没有借书');



            }





            return;



        }else if(r.code==2021 || r.code==2012 || r.code ==2031){

            location.href="/bind/library";

        }else{
            alert(r.message);
        }
    });
    */

})(self,self.document,self.jQuery);