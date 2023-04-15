const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        // unique:true
        unique:false

    
    }
    ,
    password:{
        type:String,
        required:true,
        // unique:true
        unique:false

    },
    date:{
        type:Date,
        default:Date.now
    }

    

});
// const User = mongoose.model()
const user =mongoose.model('userModel',UserSchema);
user.createIndexes();
module.exports=  user

