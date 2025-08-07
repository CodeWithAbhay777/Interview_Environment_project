import mongoose from "mongoose";

const interviewSchema = mongoose.Schema({

   job : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'jobModel',
    required : true,
   },

   candidateSelected : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'userModel',
    required : true,
   },

   interviewerAssigned : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'userModel',
    required : true,
   },
   interviewType : {
    type : String,
    enum : ['frontend', 'backend', 'fullstack'],
    required : true,
   },
   scheduledAt : {
    type : Date,
    required : true,
    default: Date.now(),
   },

   status : {
    type : String,
    enum : ['scheduled' , 'completed' , 'cancelled'],
    default : 'scheduled',
   },

   currentlyRunning : {
    type : Boolean,
    default : false,
   },
   
});

const InterviewModel = mongoose.model("InterviewModel", interviewSchema);

export default InterviewModel;