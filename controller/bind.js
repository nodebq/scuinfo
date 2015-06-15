var bindLibs = require('../libs/bind.js');
var code =require('../libs/code.js')
var bind = {

};






bind.accounts = function(req,res){
    console.log(req.body);
    //console.log(req.session);
var sql ={
    library:"secret_library",
    dean:"secret_account"
};
    bindLibs.accounts(
        {
            sqlName:sql[req.body.type],
            userId:req.session.userId,
            studentId:req.body.studentId,
            password:req.body.password
        },function(e,r){

            if(e){
                res.end(JSON.stringify(e));
                return;
            }
            //console.log(r);

            res.end(JSON.stringify(code.ok));
        }
    )

};


module.exports = bind;