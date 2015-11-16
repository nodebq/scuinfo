var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var AuthSchema = new Schema({
    access_token:String,
    user_id:String,
    update_at:Number
});


mongoose.model('Auth', AuthSchema);