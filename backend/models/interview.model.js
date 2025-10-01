import mongoose from "mongoose";

const interviewSchema = mongoose.Schema({

   job : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'JobModel',
    required : true,
   },

   candidateSelected : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'UserModel',
    required : true,
   },

   interviewerAssigned : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'UserModel',
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

   notes : {
      type : String,
      default : "",
      
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