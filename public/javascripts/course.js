(function(bom,dom,$) {



var currentPage = 1;
    $("#queryClassroom").on("click",function(){
        var $submitButton=$(this);
        $submitButton.button('loading');
var url;
        //var apiBase = "http://api.fyscu.com";

        var apiBase = "http://localhost:9231";


        url = apiBase+"/course?name="+$("#teacherName").val();


        $.get(url,function(data){
                $submitButton.button('reset');
                if(data.code=='200'){

                    if(data.data.length>0){
                        var content="<div style='line-height:3'>下面为是为您查询到的课程：</div>";
                        for(var i=0;i<data.data.length;i++){
                            content+="<li>"+data.data[i].name+"</li>"
                        }
                        $("#data").html(content);
                        $("#noMore").css("display",'none');
                        $("#loadMore").css('display','block');
                        $("#noData").css("display",'none');


                    }else{
                        $("#data").html("");
                        $("#loadMore").css('display','none');

                        $("#noData").css("display",'block');
                    }

                }else{
                    alert(data.message);
                }

            }
        );

    });


    $("#loadMore").on("click",function(){

        var $loadButton=$(this);
        $loadButton.button('loading');
        var url;

        var apiBase = "http://localhost:9231";


        url = apiBase+"/course?name="+$("#teacherName").val();
        $("#noMore").css("display",'block');
        $("#loadMore").css('display','none');
        /*
        console.log(url);
        
        $.get(url,function(data){
                console.log(data);
                $loadButton.button('reset');
                if(data.code=='200'){
                    $("#loadMore").css('display','none');



                    if(data.data.length>0){

                        var content="";
                        for(var i=0;i<data.data.length;i++){
                            content+="<li>"+data.data[i].name+"</li>"
                        }
                        $("#data").append(content);
                        currentPage++;

                        $("#loadMore").css('display','block');
                        $("#noData").css("display",'none');
                        $("#noMore").css("display",'none');



                    }else{
                        $("#noMore").css("display",'block');
                        $("#loadMore").css('display','none');
                    }

                }else{
                    alert(data.message);
                }

            }
        );
        */

    });


    $(bom).scroll(function() {
        /*
        //console.log(morePosts);
        if(($(bom).scrollTop()  >( $(dom).height() - $(bom).height() - 30 )) ){

            var url;


            var apiBase = "http://localhost:9231";


            url = apiBase+"/course?name="+$("#teacherName").val();

            console.log(url);

            $.get(url,function(data){
                    if(data.code=='200'){
                        $("#loadMore").css('display','none');
                        if(data.data.length>0){
                            var content="";
                            for(var i=0;i<data.data.length;i++){
                                content+="<li>"+data.data[i].name+"</li>"
                            }
                            $("#data").append(content);
                            currentPage++;

                            $("#loadMore").css('display','block');
                            $("#noData").css("display",'none');
                            $("#noMore").css("display",'none');



                        }else{
                            $("#noMore").css("display",'block');
                            $("#loadMore").css('display','none');
                        }

                    }else{
                        alert(data.message);
                    }

                }
            );
        }
        */
    });

})(self,self.document,self.jQuery);
