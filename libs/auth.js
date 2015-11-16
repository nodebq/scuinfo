'use strict';

var crypto = require('crypto');
var common = require('./common.js');
var mongoose = require('mongoose');
var AuthModel = mongoose.model('Auth');
let Auth = {

};


Auth.generate = function(uid,cb){
    var name= uid+common.time()+"dsgygb";
    var md5 = crypto.createHash('md5').update(name).digest('hex');

    console.log(md5);
    AuthModel.findOneAndUpdate({user_id:uid},{access_token:md5,update_at:common.time()},function(e,r){
        console.log('1',e, r);
        
    if(e){
        cb(e);
    }else{
        if(r){
            r.access_token = md5;
            console.log(e,r);
            cb(e,r);
        }else{
            console.log(md5);
            var user = new AuthModel({access_token:md5,user_id:uid,update_at:common.time()});
user.save(function(ee,rr){
    cb(ee,rr);
    console.log(rr);
})
        }
    }
});

};


Auth.checkAuth = function(req,res,next){
    var update_at = common.time()-300;
    if(req.body.access_token && req.body.user_id){
        AuthModel.findOneAndUpdate({access_token:req.body.access_token,user_id:req.body.user_id,"update_at":{$gt:update_at}},{$inc:{update_at:300}},function(e,r){
            if(e){
                res.status(401).json({
                    type:"auth",
                    message:"没有权限",
                    code:"auth_error",//错误代码
                    url:""});
            }else{
                if(r){
                    next();
                }else{
                    res.status(401).json({
                        type:"auth",
                        message:"没有权限",
                        code:"auth_error",//错误代码
                        url:""});
                }
            }
        });





    }else{
        res.status(401).json({
            type:"auth",
            message:"没有权限",
            code:"auth_error",//错误代码
            url:""});
    }
};

module.exports = Auth;