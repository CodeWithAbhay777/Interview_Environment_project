import mongoose from "mongoose";

const applicationSchema = mongoose.Schema({

   job : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'jobModel',
    required : true,
   },

   candidateApplied : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'userModel',
    required : true,
   },

   status : {
    type : String,
    enum : ['applied' , 'interview-scheduled' , 'rejected' , 'interview-completed'],
    default : 'applied'
   },

   
},{timestamps: true});

const ApplicationModel = mongoose.model("ApplicationModel", applicationSchema);

export default ApplicationModel;