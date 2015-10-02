var cheerio = require('cheerio');
var common  = require('./common.js');
var pages = {

};
pages.currentScore = function(html){
    var $ = cheerio.load(html);
    var item={};
    var data=[];

    for(var m = 1;m<($("table.displayTag").find('tr').length);m++){
        item={
            'courseId':$($($($("table.displayTag")).find('tr')[m]).find('td')[0]).text().trim(),
            'orderId':$($($($("table.displayTag")).find('tr')[m]).find('td')[1]).text().trim(),
            'score':$($($($("table.displayTag")).find('tr')[m]).find('td')[6]).text().trim(),
            'englishName':common.mysqlEscape($($($($("table.displayTag")).find('tr')[m]).find('td')[3]).text().trim()),
            'property':$($($($("table.displayTag")).find('tr')[m]).find('td')[5]).text().trim(),
            'credit':$($($($("table.displayTag")).find('tr')[m]).find('td')[4]).text().trim(),
            "name":common.mysqlEscape($($($($("table.displayTag")).find('tr')[m]).find('td')[2]).text().trim())
        };
        data.push(item);
    }
    return data;


};

module.exports = pages;