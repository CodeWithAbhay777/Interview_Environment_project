import mongoose from "mongoose";

const profileSchema = mongoose.Schema({

    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref : 'userModel',
        required:true 
    },

    fullname:{
        type:String,
        required : true
    },
    
    phone :{
        type:String,
        required : true
    },
    address : {
        type : String
    },
    college : {
        type : String
    },
    skills :{
        type : [String]
    },
    experience : {
        type : Number,
        default : 0
    },
    resume : {
        type : String,
        default : ""
    },
    bio : {
        type : String,
    },
    profilePhoto : {
        type : String,
        default: "",
    }
});

const profileModel = mongoose.model("profileModel", profileSchema);

export default profileModel;