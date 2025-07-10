import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    
    username: {
        type: String,
        unique : true,
        required : true,
    },
    fullname: {
        type:String,
        required:true,
    },
    email:{
        type: String,
        required : true,
        unique : true,
        
    },
    
    password: {
        type : String,
        required: true,
    },
    role:{
        type:String,
        enum: ["admin" , "candidate" , "interviewer"],
        default : "candidate",
        required : true,
    }
});

const userModel = mongoose.model("userModel", userSchema);

export default userModel;