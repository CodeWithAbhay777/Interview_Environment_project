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

   scheduledAt : {
    type : String,
    required : true,
   },

   status : {
    type : String,
    enum : ['scheduled' , 'completed' ,, 'cancelled'],
    default : 'scheduled',
   },

   currentlyRunning : {
    type : Boolean,
    default : false,
   },
   
   createdAt : {
    type : String,
    required : true,
   }
});

const interviewModel = mongoose.model("interviewModel", interviewSchema);

export default interviewModel;