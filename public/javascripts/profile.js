(function(bom,dom,$){

    bom.loadProfile = function(o,cb){
        $.get('/api/profile?userId='+ o.userId,function(data){
            cb(data);
            });
    };
    bom.loadProfile({
        userId:$("#pageUserId").val()
    },function(r){

        if(r.code == 200){

            $("#avatar").append("<img src='"+ r.data.avatar+"'>");
            $("#nickname").text(r.data.nickname);
            $("#profile-post-count").text(r.data.postsCount);
            $("#profile-like-count").text(r.data.likePostsCount);
        }else{

            alert(r.message);
            location.href = '/';

        }
    });

})(self,self.document,self.jQuery);