import mongoose from "mongoose";

const applicationSchema = mongoose.Schema({

   job : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'JobModel',
    required : true,
   },

   candidateApplied : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'UserModel',
    required : true,
   },

   status : {
    type : String,
    enum : ['applied' , 'interview-scheduled' , 'rejected' , 'interview-completed'],
    default : 'applied'
   },

   coverLetter : {
      type : String,
      default : '',
      required : false,
   },

   applicationResume : {
      type : String,
      default : '',
      required : false,
   }

   
},{timestamps: true});

const ApplicationModel = mongoose.model("ApplicationModel", applicationSchema);

export default ApplicationModel;