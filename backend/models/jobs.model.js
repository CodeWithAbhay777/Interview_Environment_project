import mongoose from "mongoose";

const jobSchema = mongoose.Schema({

    title : {
        type : String,
        required : true
    },
    type :  {
        enum: ['job' , 'internship'],
        default : "job",
        required : true,
    },
    salaryOffered : {
        type : Number,
        required: true,
    },
    salaryPeriod: {
      type: String,
      enum: ["monthly", "yearly", "hourly"],
      default: "yearly",
    },
    salaryCurrency: {
      type: String,
      enum: ["INR", "USD", "EUR", "GBP"],
      default: "INR",
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
    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior", "lead"],
      default: "fresher",
    },
    openings: {
      type: Number,
      default: 1,
    },
    applicationDeadline: {
      type: Date,
    },
    
    isOpen : {
        type : Boolean,
        default : true
    }
},{timestamps: true});

const JobModel = mongoose.model("JobModel", jobSchema);

export default JobModel;