import mongoose from "mongoose";

const jobSchema = mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true,

  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['job', 'internship'],
    default: "job",
    required: true,
  },
  salaryOffered: {
    type: Number,
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
  description: {
    type: String,
    required: true,
  },
  department: {
    type : String,
    enum: ["software engineer", "backend developer", "frontend developer", "fullstack developer"],
    default: "software engineer",
    required: true,
  },
  skillsRequired: {
    type: [String]
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

  isOpen: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const JobModel = mongoose.model("JobModel", jobSchema);

export default JobModel;