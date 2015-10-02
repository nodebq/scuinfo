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

common.dateChina = function(time){
    if(time){
        return new Date(time).getFullYear().toString()+"年"+(new Date(time).getMonth()+1).toString()+"月"+new Date(time).getDate(time).toString()+"日 "+new Date(time).getHours().toString()+":"+((new Date(time).getMinutes()<10)?"0":"")+(new Date(time).getMinutes()).toString()

    }
    return new Date().getFullYear().toString()+"年"+(new Date().getMonth()+1).toString()+"月"+new Date().getDate().toString()+"日 "+new Date().getHours().toString()+":"+((new Date(time).getMinutes()<10)?"0":"")+new Date().getMinutes().toString()
};
/**
 * 输出格式化的时间
 * @param time
 * @returns {string}
 */
common.day = function (time) {
    if(time){
        return new Date(time).getFullYear().toString()+"年"+(new Date(time).getMonth()+1).toString()+"月"+new Date(time).getDate(time).toString()+"日";

    }
    return new Date().getFullYear().toString()+"年"+(new Date().getMonth()+1).toString()+"月"+new Date().getDate().toString()+"日"
};


common.dayWeibo = function (time) {
    if(time){
        return new Date(time).getFullYear().toString()+"."+(new Date(time).getMonth()+1).toString()+"."+new Date(time).getDate(time).toString();

    }
    return new Date().getFullYear().toString()+"."+(new Date().getMonth()+1).toString()+"."+new Date().getDate().toString()
};

/**
 * 输出格式化的小时:分钟
 * @param time
 * @returns {string}
 */
common.hour = function (time) {
    if(time){
        return new Date(time).getHours().toString()+":"+((new Date(time).getMinutes()<10)?"0":"")+new Date(time).getMinutes().toString()

    }
    return new Date().getHours().toString()+":"+((new Date(time).getMinutes()<10)?"0":"")+new Date().getMinutes().toString()
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
common.mysqlEscape = function  (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
};
module.exports = common;