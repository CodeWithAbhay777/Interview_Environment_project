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
