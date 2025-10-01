import InterviewModel from "../models/interview.model.js";
import ApplicationModel from "../models/application.model.js";
import JobModel from "../models/jobs.model.js";
import UserModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const scheduleInterview = asyncHandler(async (req, res) => {
  const {
    job,
    candidateSelected,
    interviewerAssigned,
    interviewType,
    scheduledAt,
    notes
  } = req.body;

  // Validate required fields
  if (!job || !candidateSelected || !interviewerAssigned || !interviewType || !scheduledAt) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Check if job exists
  const jobExists = await JobModel.findById(job);
  if (!jobExists) {
    throw new ApiError(404, "Job not found");
  }

  // Check if candidate exists and has applied for this job
  const application = await ApplicationModel.findOne({
    job: job,
    candidateApplied: candidateSelected
  });

  if (!application) {
    throw new ApiError(404, "Application not found for this candidate and job");
  }



  // Check if interviewer exists and is available
  const interviewer = await UserModel.findById(interviewerAssigned);
  if (!interviewer || !['recruiter', 'admin'].includes(interviewer.role)) {
    throw new ApiError(404, "Interviewer not found or not authorized");
  }

  // Validate interview type
  if (!['frontend', 'backend', 'fullstack'].includes(interviewType)) {
    throw new ApiError(400, "Invalid interview type");
  }

  // Validate scheduled time is in the future
  const scheduledTime = new Date(scheduledAt);
  if (scheduledTime <= new Date()) {
    throw new ApiError(400, "Scheduled time must be in the future");
  }

  // Create interview
  const interview = await InterviewModel.create({
    job,
    candidateSelected,
    interviewerAssigned,
    interviewType,
    scheduledAt: scheduledTime,
    notes: notes || ""
  });

  if (!interview) {
    throw new ApiError(500, "Failed to schedule interview");
  }

  // Update application status to 'interview-scheduled'
  await ApplicationModel.findByIdAndUpdate(
    application._id,
    { status: 'interview-scheduled' },
    { new: true }
  );

  return res
    .status(201)
    .json(new ApiResponse(201, "Interview scheduled successfully"));
});



export const getAllInterviews = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, status = "all", interviewType = "all", jobId } = req.query;

  page = parseInt(page) < 1 ? 1 : parseInt(page);
  limit = parseInt(limit) < 1 ? 10 : parseInt(limit);
  jobId = new mongoose.Types.ObjectId(jobId);
  const skip = (page - 1) * limit;

 
  const matchCriteria = {};
  if (status && status !== 'all') {
    matchCriteria.status = status;
  }
  if (interviewType && interviewType !== 'all') {
    matchCriteria.interviewType = interviewType;
  }
  if (jobId) {
    matchCriteria.job = jobId;
  }

  

  const interviews = await InterviewModel.aggregate([
    { $match: matchCriteria },
    {
      $lookup: {
        from: 'usermodels',
        localField: 'candidateSelected',
        foreignField: '_id',
        as: 'candidate'
      }
    },
    {
      $lookup: {
        from: 'usermodels',
        localField: 'interviewerAssigned',
        foreignField: '_id',
        as: 'interviewer'
      }
    },
    {
      $lookup: {
        from: 'jobmodels',
        localField: 'job',
        foreignField: '_id',
        as: 'jobDetails'
      }
    },
    {
      $lookup: {
        from: 'candidateprofilemodels',
        localField: 'candidateSelected',
        foreignField: 'user_id',
        as: 'candidateProfile'
      }
    },
    {
      $unwind: '$candidate'
    },
    {
      $unwind: '$interviewer'
    },
    {
      $unwind: '$jobDetails'
    },
    {
      $unwind: {
        path: '$candidateProfile',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        interviewType: 1,
        scheduledAt: 1,
        status: 1,
        currentlyRunning: 1,
        createdAt: 1,
        notes: 1,
        'candidate._id': 1,
        'candidate.username': 1,
        'candidate.email': 1,
        'candidate.profilePhoto': '$candidateProfile.profilePhoto',
        'candidate.phone': '$candidateProfile.phone',
        'interviewer._id': 1,
        'interviewer.username': 1,
        'interviewer.email': 1,
        'interviewer.role': 1,
        'interviewer.profilePhoto': 1,
        'jobDetails.title': 1,
        'jobDetails.department': 1
      }
    },
    { $sort: { scheduledAt: -1 } },
    { $skip: skip },
    { $limit: parseInt(limit) }
  ]);

  console.log(interviews)

  const totalInterviews = await InterviewModel.countDocuments(matchCriteria);
  const totalPages = Math.ceil(totalInterviews / parseInt(limit));

  return res
    .status(200)
    .json(new ApiResponse(200, "Interviews fetched successfully", {
      interviews,
      totalInterviews,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit)
    }));
});

export const updateInterviewStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, currentlyRunning } = req.body;

  if (!id) {
    throw new ApiError(400, "Interview ID is required");
  }

  if (status && !['scheduled', 'completed', 'cancelled'].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const interview = await InterviewModel.findById(id);
  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  const updateData = {};
  if (status) updateData.status = status;
  if (typeof currentlyRunning === 'boolean') updateData.currentlyRunning = currentlyRunning;

  const updatedInterview = await InterviewModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  ).populate('candidateSelected', 'username email')
   .populate('interviewerAssigned', 'username email')
   .populate('job', 'title department');

  // If interview is completed, update application status
  if (status === 'completed') {
    await ApplicationModel.findOneAndUpdate(
      { 
        job: interview.job,
        candidateApplied: interview.candidateSelected
      },
      { status: 'interview-completed' }
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Interview updated successfully", updatedInterview));
});

export const getInterviewById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Interview ID is required");
  }

  const interview = await InterviewModel.findById(id)
    .populate('candidateSelected', 'username email')
    .populate('interviewerAssigned', 'username email')
    .populate('job', 'title department description skillsRequired');

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Interview fetched successfully", interview));
});