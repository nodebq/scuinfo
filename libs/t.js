

var conn = require("./mysql.js");


conn.query(
    
    {
        sql:"select * from scu_college"
    },function(e,r){
        console.log(e,r);
        var val = "";
        for(var i=0;i< r.length;i++){
            val+='<option value="'+r[i].collegeId+'">'+r[i].name+"</option>"
        }
        console.log(val);
    }
)