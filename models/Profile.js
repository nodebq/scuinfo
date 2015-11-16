var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ProfileSchema = new Schema({
    activity_id:Number,
    group:[
        {
            user_id:String,
            nickname:String,
            avatar:String,
            lucky_id:Number,
            create_at:Number,
            primaried:Boolean,
            status:String
        }
    ],
    create_at:Number,
    gender:Number,
    avatar:String,
    nickname:String,
    open_id:String,
    union_id:String
});


mongoose.model('Profile', ProfileSchema);