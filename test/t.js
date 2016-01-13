var request = require('request');
var fs = require('fs');
var FormData = require('form-data');
var conn = require('../libs/mysql.js')
var weiboToken = {

};

conn.query(
    {
        sql:"select * from secret_weibo_query where status=0 limit 0,1"
    },function(e,r) {
        if (e) {
            console.log(e + new Date());
            return;
        }
        //console.log(r);
        if (r.length > 0) {

            conn.query(

                {
                    sql:"select * from secret_post where id="+r[0].postId
                },function(ee,rr){
                    console.log(rr[0].content);


                    var x = rr[0].content.split("\n");
                    console.log(x.join("\n "));
                }
            )
        }


    });





//fs.readFile('../token/weibo_token.txt', 'utf8', function (err, txt) {
//    //console.log(err,txt);//return;
//    if (err) {
//        console.log(err+new Date());
//        console.log('微博初始化失败');
//        return;
//    }
////console.log(txt);
//    try{
//        weiboToken=JSON.parse(txt);
//        //console.log('初始化微博分享');
//    }catch(e){
//        weiboToken={}
//    }
//
//});
//
//var form = new FormData();
//
//form.append('status', 'test2');
//form.append('visible',1);
//form.append('access_token','2.00juRUzDLyE8QB019f190654bwq3eC');
//form.append('pic', request('http://static.scuinfo.com/uploads/0245f1ffa15a9a687405c880464ccf05.jpg'));
//
//form.submit('https://upload.api.weibo.com/2/statuses/upload.json', function(err, res,body) {
//    // res – response object (http.IncomingMessage)  //
//    res.resume();
//
//    var body = '';
//    res.on('data', function(chunk) {
//        //console.log(chunk);
//        body += chunk;
//    });
//    res.on('end', function() {
//        console.log(body);
//    });
//
//
//});



//request.get({
//    encoding:null,
//    url:'http://static.scuinfo.com/uploads/0ac57d9148058221d3e98fa876642bbe.jpg',
//    //url:"http://static.scuinfo.com/uploads/0245f1ffa15a9a687405c880464ccf05.jpg"
//},function(err,response,body){
//fs.writeFile('test.jpg',body,function(e,r){
//    console.log(err,body);
//    var formData = {
//        // Pass a simple key-value pair
//        status: encodeURIComponent('test'),
//        access_token: weiboToken.access_token,
//        // Pass data via Buffers
//        pic: fs.createReadStream(__dirname + '/test.jpg'),
//
//
//    };
//request.post(
//    {
//        //url:"http://localhost:4150/test",
//        url:"https://upload.api.weibo.com/2/statuses/upload.json",
//        formData:formData
//    },function(eee,rrr,bbb){
//        console.log(eee,bbb);
//
//
//
//    });
//
//});
//});