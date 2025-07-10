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
    enum : ['applied' , 'interview_scheduled' , 'rejected' , 'interview-completed'],
    default : 'applied'
   },

   appliedAt : {
    type : String,
   }
});

const applicationModel = mongoose.model("applicationModel", applicationSchema);

export default applicationModel;