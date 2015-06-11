var common = {
    'name':"公共函数"
};
/**
 * 获取当天的星期数
 */
common.getWeek = function()
{
return new Date().getDay();
};
common.time = function(){
  return parseInt(new Date().getTime()/1000);
};


common.date = function (time) {
    if(time){
        return new Date(time).getFullYear().toString()+"-"+(new Date(time).getMonth()+1).toString()+"-"+new Date(time).getDate(time).toString()+" "+new Date(time).getHours().toString()+":"+new Date(time).getMinutes().toString()

    }
    return new Date().getFullYear().toString()+"-"+(new Date().getMonth()+1).toString()+"-"+new Date().getDate().toString()+" "+new Date().getHours().toString()+":"+new Date().getMinutes().toString()
};

//console.log(common.time());
/**
 * 输出格式化的json
 * @param code
 * @param message
 * @param data
 * @returns Json
 */

common.format = function (code, message, data) {
    var o = {};
    o.code = code;
    if (message) {
        o.message = message;
    }
    if (data) {
        o.data = data;
    }
    return JSON.stringify(o);
};

module.exports = common;