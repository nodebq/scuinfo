(function(bom,dom,$) {
    dom.getElementById('date').valueAsDate = new Date();

    var campus = {
        "01": {
            "name": "望江",
            "buildings": [
                {
                    "id": "101",
                    "name": "一教"
                },
                {
                    "id": "102",
                    "name": "二教"
                },
                {
                    "id": "103",
                    "name": "三教"
                },
                {
                    "id": "104",
                    "name": "基教楼A座"
                },
                {
                    "id": "105",
                    "name": "基教楼C座"
                },
                {
                    "id": "106",
                    "name": "五教"
                },
                {
                    "id": "130",
                    "name": "实验室"
                },
                {
                    "id": "131",
                    "name": "体育馆"
                },
                {
                    "id": "132",
                    "name": "文华活动中心"
                },
                {
                    "id": "150",
                    "name": "管理楼"
                },
                {
                    "id": "151",
                    "name": "经管楼"
                },
                {
                    "id": "152",
                    "name": "纺工楼B楼"
                },
                {
                    "id": "153",
                    "name": "外文楼"
                },
                {
                    "id": "154",
                    "name": "纺工楼A座"
                },
                {
                    "id": "155",
                    "name": "四教"
                },
                {
                    "id": "156",
                    "name": "生命学院"
                },
                {
                    "id": "157",
                    "name": "公共管理学院"
                },
                {
                    "id": "158",
                    "name": "藏学研究所"
                },
                {
                    "id": "160",
                    "name": "高分子学院"
                },
                {
                    "id": "161",
                    "name": "水电学院"
                },
                {
                    "id": "166",
                    "name": "皮革楼"
                },
                {
                    "id": "168",
                    "name": "文理图书馆"
                },
                {
                    "id": "169",
                    "name": "数学学院"
                },
                {
                    "id": "170",
                    "name": "物理馆"
                },
                {
                    "id": "171",
                    "name": "体育学院"
                },
                {
                    "id": "172",
                    "name": "滨江楼"
                }
            ]
        },
        "02": {
            "name": "华西",
            "buildings": [
                {
                    "id": "201",
                    "name": "临医楼"
                },
                {
                    "id": "202",
                    "name": "二教"
                },
                {
                    "id": "203",
                    "name": "三教"
                },
                {
                    "id": "204",
                    "name": "体育场"
                },
                {
                    "id": "205",
                    "name": "卫新"
                },
                {
                    "id": "206",
                    "name": "卫阶"
                },
                {
                    "id": "207",
                    "name": "四教"
                },
                {
                    "id": "208",
                    "name": "八教"
                },
                {
                    "id": "209",
                    "name": "九教"
                },
                {
                    "id": "210",
                    "name": "十教"
                },
                {
                    "id": "211",
                    "name": "实验室"
                },
                {
                    "id": "212",
                    "name": "华西"
                },
                {
                    "id": "213",
                    "name": "口腔教学楼"
                },
                {
                    "id": "214",
                    "name": "图书馆"
                },
                {
                    "id": "215",
                    "name": "基法学院"
                },
                {
                    "id": "216",
                    "name": "五教"
                },
                {
                    "id": "217",
                    "name": "第三住院大楼1"
                }
            ]
        },
        "03": {
            "name": "江安",
            "buildings": [
                {
                    "id": "301",
                    "name": "一教A座"
                },
                {
                    "id": "302",
                    "name": "一教B座"
                },
                {
                    "id": "303",
                    "name": "一教C座"
                },
                {
                    "id": "304",
                    "name": "一教D座"
                },
                {
                    "id": "305",
                    "name": "综合楼B座"
                },
                {
                    "id": "306",
                    "name": "综合楼C座"
                },
                {
                    "id": "330",
                    "name": "艺术大楼"
                },
                {
                    "id": "331",
                    "name": "建环大楼"
                },
                {
                    "id": "332",
                    "name": "体育场"
                },
                {
                    "id": "333",
                    "name": "实验室"
                },
                {
                    "id": "334",
                    "name": "二基楼B座"
                },
                {
                    "id": "335",
                    "name": "工程训练中心"
                },
                {
                    "id": "336",
                    "name": "法学大楼主楼"
                },
                {
                    "id": "338",
                    "name": "法学大楼附楼"
                },
                {
                    "id": "340",
                    "name": "文科楼一区"
                },
                {
                    "id": "341",
                    "name": "文科楼一区附楼"
                },
                {
                    "id": "342",
                    "name": "建环学院"
                },
                {
                    "id": "347",
                    "name": "文科楼二区"
                },
                {
                    "id": "348",
                    "name": "文科楼二区附楼"
                },
                {
                    "id": "350",
                    "name": "灾后重建与管理学院C区"
                },
                {
                    "id": "351",
                    "name": "水电学院"
                },
                {
                    "id": "352",
                    "name": "匹兹堡学院"
                }
            ]
        }
    };


    var selectCampus = $("#campus option:selected").val();
    var buildingOption;
    for(var i=0;i<campus[selectCampus].buildings.length;i++){

        buildingOption+='<option value="'+campus[selectCampus].buildings[i].id+'">'+campus[selectCampus].buildings[i].name+'</option>';
    }

    $("#building").append(buildingOption);

    $("#campus").change(function(){
        $("#building").empty();
        var buildingOption="<option value='0'>教学楼:不限</option>";

        var selectCampus = $("#campus option:selected").val();

        for(var i=0;i<campus[selectCampus].buildings.length;i++){
            buildingOption+='<option value="'+campus[selectCampus].buildings[i].id+'">'+campus[selectCampus].buildings[i].name+'</option>';
        }
        $("#building").append(buildingOption);

    });
    
    function datetimeToTimestamp(datetime) {
        var d = datetime.split("-");
        var date = new Date();
        date.setFullYear(d[0],(d[1] - 1),d[2]);
        date.setHours(0,0,0,0);

        return date.getTime()/1000;
    }



var currentPage = 1;
    $("#queryClassroom").on("click",function(){
        var $submitButton=$(this);
        $submitButton.button('loading');
var url;

        var selectBuilding = $("#building option:selected").val();

        var apiBase = "http://api.fyscu.com";
        if(selectBuilding=="0"){
            url = apiBase+"/classroom?start="+datetimeToTimestamp($("#date").val())+"&end="+(parseInt(datetimeToTimestamp($("#date").val()))+24*60*60)+"&campusId="+$("#campus").val();
        }else{
            url = apiBase+"/classroom?start="+datetimeToTimestamp($("#date").val())+"&end="+(parseInt(datetimeToTimestamp($("#date").val()))+24*60*60)+"&campusId="+$("#campus").val()+"&buildingId="+selectBuilding;

        }
        $.get(url,function(data){
                $submitButton.button('reset');
                if(data.code=='200'){
                    
                    //console.log(data);
                    var capmpusHash = {
                        "01":"望江",
                        "02":"华西",
                        "03":"江安"
                    };

                    if(data.data.length>0){
                        var content="<div style='line-height:3'>下面为是没课的教室：</div>";
                        for(var i=0;i<data.data.length;i++){
                            content+="<li>"+capmpusHash[data.data[i].campusId]+data.data[i].building+data.data[i].classroom+"</li>"
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

        var selectBuilding = $("#building option:selected").val();

        var apiBase = "http://api.fyscu.com";
        if(selectBuilding=="0"){
            url = apiBase+"/classroom?start="+datetimeToTimestamp($("#date").val())+"&end="+(parseInt(datetimeToTimestamp($("#date").val()))+24*60*60)+"&campusId="+$("#campus").val()+"&page="+(currentPage+1);
        }else{
            url = apiBase+"/classroom?start="+datetimeToTimestamp($("#date").val())+"&end="+(parseInt(datetimeToTimestamp($("#date").val()))+24*60*60)+"&campusId="+$("#campus").val()+"&buildingId="+selectBuilding+"&page="+(currentPage+1);

        }
        
        console.log(url);
        
        $.get(url,function(data){
                console.log(data);
                $loadButton.button('reset');
                if(data.code=='200'){
                    $("#loadMore").css('display','none');

                    //console.log(data);
                    var capmpusHash = {
                        "01":"望江",
                        "02":"华西",
                        "03":"江安"
                    };

                    if(data.data.length>0){
                        var content="";
                        for(var i=0;i<data.data.length;i++){
                            content+="<li>"+capmpusHash[data.data[i].campusId]+data.data[i].building+data.data[i].classroom+"</li>"
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

    });


    $(bom).scroll(function() {
        //console.log(morePosts);
        if(($(bom).scrollTop()  >( $(dom).height() - $(bom).height() - 30 )) ){

            var url;

            var selectBuilding = $("#building option:selected").val();

            var apiBase = "http://api.fyscu.com";
            if(selectBuilding=="0"){
                url = apiBase+"/classroom?start="+datetimeToTimestamp($("#date").val())+"&end="+(parseInt(datetimeToTimestamp($("#date").val()))+24*60*60)+"&campusId="+$("#campus").val()+"&page="+(currentPage+1);
            }else{
                url = apiBase+"/classroom?start="+datetimeToTimestamp($("#date").val())+"&end="+(parseInt(datetimeToTimestamp($("#date").val()))+24*60*60)+"&campusId="+$("#campus").val()+"&buildingId="+selectBuilding+"&page="+(currentPage+1);

            }

            console.log(url);

            $.get(url,function(data){
                    if(data.code=='200'){
                        $("#loadMore").css('display','none');

                        //console.log(data);
                        var capmpusHash = {
                            "01":"望江",
                            "02":"华西",
                            "03":"江安"
                        };

                        if(data.data.length>0){
                            var content="";
                            for(var i=0;i<data.data.length;i++){
                                content+="<li>"+capmpusHash[data.data[i].campusId]+data.data[i].building+data.data[i].classroom+"</li>"
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
    });

})(self,self.document,self.jQuery);
