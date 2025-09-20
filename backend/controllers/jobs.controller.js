import moment from "moment";
import JobModel from "../models/jobs.model.js";
import ApplicationModel from "../models/application.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createJob = asyncHandler(async(req , res) => {
    const postJob = await JobModel.create(req.body);
    if (!postJob) throw new ApiError(500 , "Posting job : Something went wrong!");
    res.status(201).
    json(new ApiResponse(201 , "Job posted successfully!"));
});

export const getAllJobsByAdmin = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  
  const { search = "", department, state } = req.query;

  
  const matchStage = {};
  if (department) matchStage.department = department;
  if (state !== "all" && state !== undefined && state === "open") matchStage.isOpen = true;
  if (state !== "all" && state !== undefined && state === "closed") matchStage.isOpen = false;  
  
  
  if (search) matchStage.title = { $regex: search, $options: "i" };

  const jobs = await JobModel.aggregate([
    { $match: matchStage },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },

    
    {
      $lookup: {
        from: "applicationmodels",
        localField: "_id",
        foreignField: "job",
        as: "applications",
      },
    },

    // Add applicantsCount field
    {
      $addFields: {
        applicantsCount: { $size: "$applications" },
      },
    },

    // Select only required fields
    {
      $project: {
        title: 1,
        type: 1,
        department: 1,
        experienceLevel: 1,
        salaryOffered: 1,
        isOpen: 1,
        salaryCurrency: 1,
        applicantsCount: 1,
      },
    },
  ]);

  // Total count (for pagination metadata)
  
  const totalJobs = await JobModel.countDocuments(matchStage);


  res.status(200).
  json(new ApiResponse(200 , "Jobs fetched successfully!" , {jobs , page , limit , totalJobs , totalPages : Math.ceil(totalJobs/limit)}));
  
});


//FOR ALL CANDIDATES

export const getJobsForCandidates = asyncHandler(async (req, res) => {
 
  
  
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const { search = "", department, state, jobType, experienceLevel, candidateId, appliedJobs = "false" } = req.query;

  // ---------- Base filters ----------
  const matchStage = {};
  if (department) matchStage.department = department;
  if (state !== "all" && state !== undefined && state === "open") matchStage.isOpen = true;
  if (state !== "all" && state !== undefined && state === "closed") matchStage.isOpen = false;
  if (jobType && jobType !== "none") matchStage.type = jobType;
  if (experienceLevel && experienceLevel !== "none") matchStage.experienceLevel = experienceLevel;
  if (search) matchStage.title = { $regex: search, $options: "i" };

  // ---------- Aggregate pipeline ----------
  const pipeline = [
    { $match: matchStage },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },

    // Lookup all applications for counting
    {
      $lookup: {
        from: "applicationmodels",
        localField: "_id",
        foreignField: "job",
        as: "allApplications",
      },
    },

    // Add applicants count
    {
      $addFields: {
        applicantsCount: { $size: "$allApplications" },
      },
    },

    // Project only required fields (we'll add hasApplied later)
    {
      $project: {
        title: 1,
        type: 1,
        department: 1,
        experienceLevel: 1,
        salaryOffered: 1,
        salaryCurrency: 1,
        salaryPeriod: 1,
        isOpen: 1,
        applicantsCount: 1,
        createdAt: 1,
      },
    },
  ];

  const jobsResult = await JobModel.aggregate(pipeline);

  // Get user's applications to determine hasApplied status
  const userApplications = await ApplicationModel.find({ 
    candidateApplied: candidateId 
  }).select('job');
  
  
  
  const appliedJobIds = new Set(userApplications.map(app => app.job.toString()));
  
  
  
  // Add hasApplied field to each job
  const jobsWithAppliedStatus = jobsResult.map(job => ({
    ...job,
    hasApplied: appliedJobIds.has(job._id.toString())
  }));

  // Filter based on appliedJobs parameter
  let filteredJobs = jobsWithAppliedStatus;
  
  
  if (appliedJobs === "true") {
    filteredJobs = jobsWithAppliedStatus.filter(job => job.hasApplied === true);
   
  } else if (appliedJobs === "false") {
    filteredJobs = jobsWithAppliedStatus.filter(job => job.hasApplied === false);
    
  }

  // Format dates for the final result
  const formattedJobs = filteredJobs.map((job) => ({
    ...job,
    createdAtRelative: moment(job.createdAt).fromNow(),
    createdAtFormatted: moment(job.createdAt).format("D MMM YYYY"),
  }));

  // For pagination (note: this count might not be exact after filtering, but it's close enough)
  const totalJobs = await JobModel.countDocuments(matchStage);

  res.status(200).json(
    new ApiResponse(200, "Jobs fetched successfully!", {
      jobs: formattedJobs,
      page,
      limit,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
    })
  );
});


export const getIndividualJob = asyncHandler(async (req, res) => {
  const jobId = req.params?.id;
  const userID = req.id;
  let isAlreadyApplied = false;

  const isApplicationPresent = await ApplicationModel.findOne({ job : jobId , candidateApplied : userID });

  if (isApplicationPresent) isAlreadyApplied = true;

  const job = await JobModel.findById(jobId);

  if (!job) throw new ApiError(404, "Job not found!");

  res.status(200).json(new ApiResponse(200, "Job fetched successfully!", { job , isAlreadyApplied }));

})

