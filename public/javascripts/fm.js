(function(bom,dom,$){

    bom.loadTagPostsCount = function(o,cb){
        $.get('/api/tag/count?name='+ o.name,function(data){
            cb(data);
            });
    };

   $("#shareFm").on('click',function(){
       $("#wechatShareTips").css('display', "block");

   });
    bom.loadTagPostsCount({
        name:"海螺"
    },function(r){
        console.log(r);
        if(r.code==200){
           $("#postsCountLoadIcon").text(r.data.postsCount);
        }else{
            $("#postsCountLoadIcon").text('0');
        }
    });
    wx.ready(function(){


    var wechatTitle = '「神奇海螺」Vo.1  from 川大';
    var wechatDesc = '为什么不去问问神奇的海螺呢？';
    var wechatLink = 'http://music.163.com/#/dj?id=9628137';
    var wechatImg = 'http://p4.music.126.net/80JdXF2ROe-WNLsaFCY53w==/2904909721756247.jpg?param=140y140';
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
    })



})(self,self.document,self.jQuery);