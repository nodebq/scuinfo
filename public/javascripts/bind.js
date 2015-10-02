(function(bom,dom,$){

        /**
         * 检测提交文章的参数
         * @param o
         * @param cb
         */
        bom.check = function (o,cb){
            //console.log(o);
            if(!o.studentId){
                cb({
                    code:3001,
                    message:"学号不能为空"
                });
                return;
            }

            if(!o.password){
                cb({
                    code:3002,
                    message:"密码不能为空"
                });
                return;
            }

            if(!o.type){
                cb({
                    code:3003,
                    message:"类型不能为空"
                })
            }

            cb(null,{
                studentId: o.studentId,
                password: o.password,
                type: o.type
            })


        };

        /**
         *
         * @param o
         * @param cb
         */
        bom.bind = function(o,cb){

            bom.check(o,function(e,r){
                if(e){
                    cb(e);
                    return;
                }

                $.ajax({
                    type: 'POST',
                    url: '/api/bind/accounts',
                    data: JSON.stringify(r),
                    success: function(data) { //alert('data: ' + data);
                        cb(data);
                    },
                    contentType: "application/json",
                    dataType: 'json'
                });
            })

        };

        $(dom).ready(function(){

            $("#bindButton").on(
                'click',function(){
                    var $submitButton=$(this);
                    $submitButton.button('loading');
                    var o={};
                    o.studentId = $("#studentId").val();
                    o.password = $("#password").val();
                    o.type=$("#pageType").val();
                    bom.bind(o,function(r){
                        if(r.code==200) {
                            alert('绑定成功');
                            $submitButton.button('reset');
                            console.log('success');
                            //跳转到前一页
                            location.href = '/u';
                        }else{
                            $submitButton.button('reset');
                            alert(r.message);
                        }


                    })
                }
            );
        });

    })(self,self.document,self.jQuery);
