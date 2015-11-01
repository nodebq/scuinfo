"use strict";

var a='s',b='c';

var c = {
    a,b
};


console.log(c);



//var d = JSON.stringify("x");
var d = '"x"'
console.log(d);

var e = JSON.parse(d);

console.log(typeof e);