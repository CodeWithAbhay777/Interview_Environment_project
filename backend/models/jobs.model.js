import mongoose from "mongoose";

const jobSchema = mongoose.Schema({

    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true,
    },
    department : {
        enum: ["software engineer" , "backend developer" , "frontend developer" , "fullstack developer"],
        default : "software engineer",
        required : true,
    },
    skillsRequired : {
        type : [String]
    },
    createdAt : {
        type : String,
        required : true,
        
    },
    isOpen : {
        type : Boolean,
        default : true
    }
});

const jobModel = mongoose.model("jobModel", jobSchema);

export default jobModel;