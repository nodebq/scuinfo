
(function(bom,dom,$){

function reloadModules(m)
{
    if(!(m instanceof Array)){console.warn('reloadModules func parameters should be an Array.');return;}
    var modules = m || [];
    $.each(modules, function(i, m) {
        var module = $.AMUI[m];
        module && module.init && module.init();
    })
}


$.get('/api/score',function(r){
    $("#loading").css('display','none');
    if(r.code==200){
        var content=[];

        var score = r.data.scores;
        var credit = 0;
        for(var i=0;i<score.length;i++){


            credit+=score[i].credit;
            content[i]={
                title: score[i].name+ "["+score[i].score+"分]",
                content: '学期:'+score[i].term+"" +
                "<br>课程号:"+score[i].courseId+"" +
                "<br>课序号:"+score[i].orderId+"" +
                "<br>属性:"+score[i].property+"" +
                "<br>学分:"+score[i].credit+"" +
                "<br>英文名:"+score[i].EnglishName

            }
        }
        $("#credit").text(credit);
        $("#courseCount").text(r.data.count);
        var $tpl = $('#score'),
            tpl = $tpl.text(),
            template = Handlebars.compile(tpl),
            data = {
                accordionData: {
                    "theme": "gapped",
                    "content": content
                }
            },
            html = template(data);

        $tpl.before(html);
        reloadModules(['accordion']);
        return;



    }else if(r.code ==2001 || r.code==2021 || r.code==2012){
alert(r.message);
        location.href="/bind/dean";

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



    $(".container").on('click','.refresh',function() {

        $(this).children().addClass('am-icon-spin');

        var refreshButton=$(this).children();
        $.post('/api/update', {type: "score"}, function (data) {

            refreshButton.removeClass('am-icon-spin');

            if(data.code==200){

                $("#modalTips").modal('open');
                setTimeout(function(){
                    $("#modalTips").modal('close');

                },2000);

            }else if(data.code==2021 || data.code==2012 || data.code ==2031){
                location.href="/bind/dean";

            }else{
                alert(data.message)
            }

        }).fail(function(){
            refreshButton.removeClass('am-icon-spin');
            alert('请求错误');
        });

    });

})(self,self.document,self.jQuery);
