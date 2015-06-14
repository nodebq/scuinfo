(function(bom,dom,$){
    $(dom).ready(function(){
        var floor=0;
        bom.loadComment= function(o,cb){
            // console.log(o);
            if(o.action=='loadMore'){
                $("#loadMoreButton").button('loading');
            }

            var url = "/api/comments?postId="+$("#postId").val();
            o.pageSize = o.pageSize?o.pageSize:15;
            if(o.userId && o.fromId){
                url+='&pageSize='+ o.pageSize+'&fromId='+ o.fromId+'&userId='+ o.userId;
            }else if(o.userId){
                url+='&pageSize='+ o.pageSize+'&userId='+ o.userId;
            }else if(o.fromId){
                url+='&pageSize='+ o.pageSize+'&fromId='+ o.fromId;
            }else{
                url+='&pageSize='+ o.pageSize;
            }

            $.get(url,function(data){



                    if(o.action == 'init'){
                        $("#comments-loading").css('display','none');}
                   // console.log(data);
                    if(data.code==200) {
                        // console.log(data.data.length);
                        if(data.data.length == 0){
                            if(o.action == 'init'){
                                $("#noData").css('display','block');
                            }else {
                                $("#loadMore").css('display', 'none');
                                $("#noMore").css('display', 'block');
                            }
                            $("#loadMoreButton").button('reset');
                            cb({
                                code:3003,
                                message:"没有更多内容了"
                            });//todo
                            return;
                        }

                        var comments="";

                        for (var i = 0; i < data.data.length;i++) {
                            floor++;
                            comments+='<article class="comment" id="'+data.data[i].id+'"><div class="comment-body"><div class="comment-left">'+
                                '<a href="/u/'+data.data[i].userId+'"><img src="'+data.data[i].avatar+'" /></a></div>'+
                                '<div class="comment-content">'+data.data[i].content+'</div>'+
                                '<div class="comment-right">'+
                                '<span class="am-icon-heart-o am-icon-sm comment-like '+(data.data[i].like?"comment-like-active":"")+'"></span></div></div>'+
                                '<footer class="comment-footer">'+
                                '<span class="comment-floor">「'+(floor)+'楼」</span><span class="comment-time">'+getDateDiff(data.data[i].date)+'</span>'+
                                '•<span class="am-icon-heart am-icon-sm comment-footer-like"></span><span class="comment-footer-like-count">'+data.data[i].likeCount+'</span></footer></article>';
                        }

                        $('#comments .comments').append(comments.replace(/\n/g,"<br>")).clone(true);
                        $("#comments #myComments").html("");



                        //console.log(data.data.length);
                        //console.log(o.pageSize);
                        if(data.data.length< o.pageSize){
                            $("#noMore").css('display', 'block');

                        }else{
                            $("#loadMore").css('display','block');}
                       var fromId = data.data.pop().id;

                        $("#loadMore").attr('fromid',fromId).clone(true);
                        $("#loadMoreButton").button('reset');
 
                        


                        if(store.enabled){
                            store.set('fromId',fromId);
                            store.set('comments',(store.get('comments')?store.get('comments'):"")+comments);

                        }
                        cb(null);

                    }else{
                        alert(data.message);
                    }
            },'json');

        };

        bom.loadPost = function(o,cb){
            var url = '/api/post?id='+ o.id;
            var gender={
                '0':"girl",
                '1':"boy"
            };
            $.get(url,function(data){
                var post ='<article class="posts '+gender[data.data.gender]+'" id="'+data.data.id+'" href="'+
                getPostHref({id:data.data.id})+'" userId="'+data.data.userId+'" img="'+data.data.avatar+'" wechatTitle="'+getWechatTitle({title:data.data.title})+'" weiboTitle="'+getWeiboTitle({title:data.data.title})+'" level="'+data.data.level+'" author="'+data.data.author+'">'+
                '<header class="posts-header">' +
                '<div class="am-text-truncate posts-header-left "><span class="posts-header-user">'+
                '<img src="'+data.data.avatar+'" />'+
                data.data.nickname+
                '</span></div>'+
                '<span class="posts-header-right">' +
                '<span class="am-icon-external-link am-icon-md posts-header-icon posts-header-share"></span>' +
                '</span>' +
                '</header>' +
                '<div class="posts-body posts-detail-body">' +
                '<span class="am-icon-heart am-icon-md am-animation-scale-up posts-body-like"></span>' +
                '<p class="posts-body-content">' +
                cssTag({
                    content: data.data.content
                })+'</p></div>' +
                '<footer class="posts-footer">' +
                '<span class="posts-footer-left posts-detail-footer-left">'+getDateDiff(data.data.date)+'</span>' +
                '<span class="posts-footer-right posts-footer-like-area">' +
                '<span class="am-icon-heart am-icon-md posts-footer-icon posts-footer-like '+(data.data.like?'posts-footer-icon-active':'')+'"></span>' +
                '<span class="posts-footer-count posts-footer-like-count">'+(data.data.likeCount)+'</span></span>' +
                '<span class="posts-footer-right posts-comment posts-detail-comments">' +
                '<span class="am-icon-comment am-icon-md posts-footer-icon posts-footer-comment posts-detail-footer-comment"></span>' +
                '<span class="posts-footer-count posts-footer-comment-count">'+data.data.commentCount+'</span></span>' +
                '<span class="posts-footer-right">'+
                '<div class="am-dropdown am-dropdown-up more-dropdown">'+
                '<span class="am-icon-ellipsis-h am-icon-md posts-footer-icon posts-footer-more"></span>'+
                '<ul class="am-dropdown-content">'+
                '<li class="shareToWeibo"><a href="#"><span class="am-icon-weibo"></span> 分享到微博</a></li>'+
                '<li class="posts-delete"><a href="#"><span class="am-icon-trash"></span> 删除</a></li>'+
                '</ul> </div> </span></footer> </article>';
                $("#posts").html(post.replace(/\n/g,"<br>"));
                $("#loading").css('display','none');

        });
        };

        bom.loadPost(
            {
                id:$("#postId").val()
            }
        );

        var store = $.AMUI.store;
        var historyTimestamp = $("#timestamp").val();
       // console.log(historyTimestamp);
        if(store.enabled){

            if(historyTimestamp == store.get('timestamp')){
              //  console.log(2);
               if(store.get('comments')){
                   $("#comments").html(
                      store.get('comments')
                   ).clone(true);
                   setTimeout(function() {window.scrollTo(0,store.get('y'));},1);
                   $("#loadMore").attr('fromid',store.get('fromId'));
                   $("#loadMoreButton").button('reset');
                   $("#loadMore").css('display','block');
                   $(dom).scroll(function () {
                       store.set('y', $(dom).scrollTop());
                   });
               }

            }else {
              //  console.log('2');
                store.clear();
                store.set('timestamp', historyTimestamp);

                bom.loadComment({
                    action:"init"
                },function(){

                });
            }
        }


        var flag=false,count= 0,max=100;

        $(bom).scroll(function() {
            
            console.log($("#loadMore").css('display'));
       if($("#loadMore").css('display')=='block'){
            if(($(bom).scrollTop()  >( $(dom).height() - $(bom).height() - 10 )) && count<max && !flag) {
                flag = true;
                bom.loadComment({
                    action: "loadMore",
                    fromId: $("#loadMore").attr('fromid')
                }, function () {
                    flag = false;
                    count++;
                });
            }
            }
        });
        $("#loadMoreButton").on('click',function(){
            bom.loadComment({
                action:"loadMore",
                fromId:$("#loadMore").attr('fromid')
            },function(){

            });
        });


        $("#wechatShareTips").on('click',function(){
           $("#wechatShareTips").css('display','none') ;
        });


        $("#posts").on('click','.posts-delete',function(){

            var article = $(this).parent().parent().parent().parent().parent();
            bom.delete({
                id:article.attr('id')
            },function(data){
                if(data.code == 200){
                    $("#tips .tips-alert p").text("删除成功");
                    $("#tips").css('display','block');
                    location.href = "/";
                }else{
                    alert(data.message);
                }
            });

        });

        /**
         * 检测提交文章的参数
         * @param o
         * @param cb
         */
        bom.checkComment = function (o,cb){
            //console.log(o);
            if(!o.content){
                cb({
                    code:3001,
                    message:"内容不能为空"
                });
                return;
            }
            var secret=0;
            cb(null,{
                content: o.content,
                secret: secret,
                postId: o.postId,
                parentId: o.parentId? o.parentId:0
            })


        };

        /**
         *
         * @param o
         * @param cb
         */
        bom.postComment = function(o,cb){
            bom.checkComment(o,function(e,r){
                if(e){
                    cb(e);
                    return;
                }

                console.log(r);
                
                $.ajax({
                    type: 'POST',
                    url: '/api/comment',
                    data: JSON.stringify(r),
                    success: function(data) { //alert('data: ' + data);
                    // console.log(data);
                    //    data.data.content = r.content;
                    //    console.log(22);
                        cb(data);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            })

        };


        $("#comment-post-content").on('focus',function(){

            if($("#userStatus").val()!='login'){

                location.href = '/signin?redirect='+$("#url").val();
            }

        });



       var commentSendFlug = true;
        $("#comment-post-send").on('click',function(){
            if(!commentSendFlug){
                return;
            }
            commentSendFlug = false;
            var $commentSend = $(this);
            $commentSend.css('color','rgba(0,0,0,0.4)');
            $("#comment-post-content").attr('disabled',"true");
            var o={};
            o.content = $("#comment-post-content").val();
            o.postId = $('#postId').val();
            //console.log(o);
            bom.postComment(o,function(data){
                if(data.code==200) {

                    $commentSend.css('color','#333');
                   // $(this).css('color','#333');
                    $("#comment-post-content").removeAttr('disabled');
                        $("#comment-post-content").val("");
                    console.log('success');

                        var comment ='<article class="comment" id="'+data.data.id+'"><div class="comment-body"><div class="comment-left">'+
                        '<a href="/u/'+data.data.userId+'"><img src="'+data.data.avatar+'" /></a></div>'+
                        '<div class="comment-content">'+o.content+'</div>'+
                        '<div class="comment-right">'+
                        '<span class="am-icon-heart-o am-icon-sm comment-like"></span></div></div>'+
                        '<footer class="comment-footer">'+
                        '<span class="comment-floor">「'+(data.data.commentCount)+'楼」</span><span class="comment-time">'+getDateDiff(parseInt(new Date()/1000))+'</span>'+
                        '•<span class="am-icon-heart am-icon-sm comment-footer-like"></span><span class="comment-footer-like-count">0</span></footer></article>';
/*
                        if($("#noMore").css('display')=='none' && $("#noData").css('display')=='none'){
                            $("#comments .comments").
                        }
                        */
                        $("#noMore").css('display','none');
                        $("#noData").css('display','none');
                        $("#myComments").append(comment);
                        commentSendFlug=true;
                }else{
                    alert(data.message);

                    if(data.code==2015){

                        location.href = '/signin?redirect='+$("#url").val();
                    }




                    $commentSend.css('color','#333');
                    // $(this).css('color','#333');
                    $("#comment-post-content").removeAttr('disabled');
                    commentSendFlug=true;
                }




            })
        });

        bom.checkCommentLike = function(o,cb){
            if(!o.id){
                cb({
                    code:3004,
                    message:"请传入评论id"
                });
                return;
            }



            cb(null, o);
        };
        bom.commentLike = function(o,cb){
            bom.checkCommentLike(o,function(e,r){
                if(e){
                    cb({code: e.code,
                        message:e.message});
                    return;
                }
                //console.log('2');
                $.ajax({
                    type: o.method?o.method:"POST",
                    url: '/api/like/comment',
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

        $("#comments").on('click','.comment-like',function(){
            //console.log('li');

            $commentLikeIcon = $(this);
            
            $commentLikeCount = $(this).parents('article').find("footer .comment-footer-like-count");
            //console.log($commentLikeCount);
            if($commentLikeIcon.hasClass('comment-like-active')){
                $commentLikeIcon.removeClass('comment-like-active');
                $commentLikeCount.text(parseInt($commentLikeCount.text())-1);
                bom.commentLike(
                    {
                        method:'delete',
                        id:$commentLikeIcon.parents('article').attr('id')
                    },function(e,r){
                        if(e){
                            $commentLikeIcon.addClass('comment-like-active');
                            $commentLikeCount.text(parseInt($commentLikeCount.text())+1);
                            alert(e.message);
                            console.log(e);
                            return;
                        }

                        if(r.code!=200){
                            $commentLikeIcon.addClass('comment-like-active');
                            $commentLikeCount.text(parseInt($commentLikeCount.text())+1);

                            alert(r.message)
                            return;

                        }

                    }
                );

            }else{

                $commentLikeIcon.addClass("comment-like-active");
                $commentLikeCount.text(parseInt($commentLikeCount.text())+1);

                bom.commentLike(
                    {
                        id:$commentLikeIcon.parents('article').attr('id')
                    },function(e,r){
                        if(e){
                            $commentLikeCount.text(parseInt($commentLikeCount.text())-1);
                            $commentLikeIcon.removeClass("comment-like-active");

                            alert(e.message);
                            console.log(e);
                            return;
                        }
                        if(r.code!=200){
                            $commentLikeCount.text(parseInt($commentLikeCount.text())-1);
                            $commentLikeIcon.removeClass("comment-like-active");
                            alert(r.message)

                        }

                    }
                );


            }

        })

    });

})(self,self.document,self.jQuery);