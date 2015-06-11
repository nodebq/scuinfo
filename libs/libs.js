var config = require('../config.js')
var libs = {

    name:"项目公共函数"
};

libs.random = function random(min,max){
    return Math.floor(min+Math.random()*(max-min));
};

/**
 * 生成随机头像
 * @type {{return}}
 */

libs.randomAvatar = function(o){

    //var avatar = '/images/' + libs.random(1,49)+ '.png';//头像数目
//var avatar = 'http://www.qqzhi.com/uploadpic/2014-05-05/013834909.jpg';
   // return avatar;




    var avatarF = [
        'http://ww2.sinaimg.cn/mw690/a958717cgw1erw710tlblj20fs0fswfp.jpg',
        'http://ww1.sinaimg.cn/mw690/a958717cgw1erw6zm4z9qj20fs0fs0tx.jpg',
        'http://ww4.sinaimg.cn/mw690/a958717cgw1erw6x85xecj20fs0fsmy8.jpg',
        'http://ww4.sinaimg.cn/mw690/a958717cgw1erw6vqa7hbj20fs0fsq3y.jpg',
        'http://ww4.sinaimg.cn/mw690/a958717cgw1erw6uu1dt6j20fs0fsmyj.jpg',
        'http://ww4.sinaimg.cn/mw690/a958717cjw8erw6r4cahyj20u00u00u0.jpg',
        'http://ww1.sinaimg.cn/mw690/a958717cjw8erw6pftqsrj20u00u00ty.jpg',
        'http://ww2.sinaimg.cn/mw690/a958717cjw8erw6obxxs8j20u00u00u1.jpg'

    ];

    var avatarM = [
'http://ww4.sinaimg.cn/mw690/a958717cgw1erw70ntdhuj20fs0fsdh9.jpg',
        'http://ww3.sinaimg.cn/mw690/a958717cgw1erw707c5h4j20fs0fsdh3.jpg',
        'http://ww3.sinaimg.cn/mw690/a958717cgw1erw6z87przj20fs0fs0u5.jpg',
        'http://ww3.sinaimg.cn/mw690/a958717cgw1erw6xvhywjj20fs0fsq48.jpg',
        'http://ww4.sinaimg.cn/mw690/a958717cgw1erw6ww64emj20fs0fs75n.jpg',
        'http://ww4.sinaimg.cn/mw690/a958717cgw1erw6vbcfjej20fs0fs403.jpg',
        'http://ww4.sinaimg.cn/mw690/a958717cgw1erw6ueyjnnj20fs0fst9x.jpg',
        'http://ww4.sinaimg.cn/mw690/a958717cjw8erw6rn3q4wj20u00u0ta5.jpg'

    ];
    var t;
    if(o.gender==2){
        t=libs.random(0,7);
        return avatarF[t];
    }else{
        t=libs.random(0,7);
        return avatarM[t];
    }


};


/**
 * 生成匿名的昵称
 * 目前为「某同学」
 */
//todo 期待封装
libs.randomNickname = function(){
    return '某同学';
};

module.exports = libs;