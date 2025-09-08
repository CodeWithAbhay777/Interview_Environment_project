import JobModel from "../models/jobs.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createJob = asyncHandler(async(req , res) => {
    const postJob = await JobModel.create(req.body);
    if (!postJob) throw new ApiError(500 , "Posting job : Something went wrong!");
    res.status(201).
    json(new ApiResponse(201 , "Job posted successfully!"));
})
