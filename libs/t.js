function LateBloomer() {
    this.petalCount = Math.ceil(Math.random() * 12) + 1;
}

// 1 秒后声明 bloom
LateBloomer.prototype.bloom = function() {
    setTimeout(this.declare.bind(this), 1000);
};

LateBloomer.prototype.declare = function() {
    console.log('I am a beautiful flower with ' +
        this.petalCount + ' petals!');
};

var flower = new LateBloomer();
flower.bloom();  // 1 秒钟后，调用 declare 方法