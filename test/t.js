var x= 'https://open.weixin.qq.com/connect/qrconnect?appid=wx8f8d7578a5a3023b&redirect_uri=http%3a%2f%2fscuinfo.com%2fauth%2flucky&response_type=code&scope=snsapi_login&state=%7B%22r%22%3A%22http%3A%2F%2Flocalhost%3A3000%2F%22%7D#wechat_redirec';


var stat = encodeURIComponent(JSON.stringify({r:"http://localhost:3000/"}));

console.log(stat);

console.log(x);