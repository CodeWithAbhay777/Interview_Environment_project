import moment from "moment";
import JobModel from "../models/jobs.model.js";
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
  const candidateId = req.id;
  
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const { search = "", department, state, jobType, experienceLevel, appliedJobs = "false"} = req.query;

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

    // Lookup applications for this job
    {
      $lookup: {
        from: "applicationmodels",
        let: { jobId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$job", "$$jobId"] } } },
          { $project: { candidateApplied: 1 } },
        ],
        as: "applications",
      },
    },

    // Count applicants
    {
      $addFields: {
        applicantsCount: { $size: "$applications" },
        hasApplied: {
          $in: [{ $toObjectId: candidateId }, "$applications.candidateApplied"],
        },
      },
    },
  ];

  // ---------- Handle appliedJobs filter ----------
  if (appliedJobs === "true") {
    pipeline.push({ $match: { hasApplied: true } });
  } else if (appliedJobs === "false") {
    pipeline.push({ $match: { hasApplied: false } });
  }

  // ---------- Project only required fields ----------
  pipeline.push({
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
      hasApplied: 1,
      createdAt: 1,
    },
  });

  const jobs = await JobModel.aggregate(pipeline);

  // Format dates
  const formattedJobs = jobs.map((job) => ({
    ...job,
    createdAtRelative: moment(job.createdAt).fromNow(),
    createdAtFormatted: moment(job.createdAt).format("D MMM YYYY"),
  }));

  // For pagination
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

