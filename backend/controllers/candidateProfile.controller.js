import CandidateProfileModel from "../models/candidateProfile.model.js";
import UserModel from "../models/user.module.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



export const submitCandidateProfile = asyncHandler(async (req,res) => {
    const { user_id ,fullname , phone , address , college , skills , experience , linkedinProfile , githubProfile , bio } = req.body;

    if(!user_id || !fullname || !phone || !address ) {
        throw new ApiError(400 , "Required fields are missing");
    }

    console.log(req.files);

    let profilePhotoLocalPath = "";
    let resumeLocalPath ="";


    if (req.files && Array.isArray(req.files.profilePhoto) && req.files.profilePhoto.length > 0) {
        profilePhotoLocalPath = req.files.profilePhoto[0].path
    }

    if (req.files && Array.isArray(req.files.resume) && req.files.resume.length > 0) {
        resumeLocalPath = req.files.resume[0].path
    }
    // console.log(profilePhotoLocalPath , resumeLocalPath);

    let urlProfilePhoto; 
    let urlResume;

    if (profilePhotoLocalPath){
        urlProfilePhoto = await uploadOnCloudinary(profilePhotoLocalPath);
    }

    if (resumeLocalPath) {
        urlResume = await uploadOnCloudinary(resumeLocalPath);
    }

    const createdProfile = await CandidateProfileModel.create({
        user_id,
        fullname,
        phone,
        address,
        college,
        skills: skills || [],
        experience: experience ? Number(experience) : 0,
        linkedInProfile: linkedinProfile || "",
        githubProfile: githubProfile || "",
        bio: bio || "",
        profilePhoto: urlProfilePhoto || "",
        resume: urlResume || ""
    });


    if (!createdProfile) {
        throw new ApiError(500, "Failed to create candidate profile");
    }

    const newUpdatedUser = await UserModel.findByIdAndUpdate(user_id, {
        isProfileComplete: true
    }, { new: true }).select("-password -refreshToken");

    if (!newUpdatedUser) {
        throw new ApiError(500, "Failed to update user profile completion status");
    }

    return res.status(201)
    .json(new ApiResponse(201, "Candidate profile created successfully", {createdProfile , newUpdatedUser}))




})