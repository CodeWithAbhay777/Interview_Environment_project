import UserModel from '../models/user.module.js';
import redis from '../libs/redisConnection.js';
import { sendVerificationEmail } from '../templates/emailVerificationCode.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const sendVerificationCode = asyncHandler(async (req, res) => {
    console.log("query ", req.query , "params ",req.params );
    const { email } = req.query;
    
    if (!email) {
        throw new ApiError(400, "Email is required");
    }
    
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("VERIFICATION CODE IS : ", verificationCode);

    // Save to Redis
    await redis.set(`verificationCode:${email}`, verificationCode, 'EX', 120);
    
    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationCode);
    
    if (!emailSent) {
        throw new ApiError(500, "Failed to send verification code email");
    }

    return res.status(200).json(
        new ApiResponse(200, "Verification code sent successfully")
    );
});

export const verifyEmailCode = asyncHandler(async (req, res) => {
    const { email, code, id } = req.body;
    
    if (!email || !code || !id) {
        throw new ApiError(400, "Email and code are required");
    }

    // Retrieve from Redis
    const storedCode = await redis.get(`verificationCode:${email}`);

    if (!storedCode) {
        throw new ApiError(400, "Verification code has expired or does not exist");
    }

    if (storedCode !== code) {
        throw new ApiError(400, "Invalid verification code");
    }

    // Delete the code from Redis after successful verification
    await redis.del(`verificationCode:${email}`);
    
    // Update user's email verification status
    await UserModel.findByIdAndUpdate(id, { isEmailVerified: true });

    return res.status(200).json(
        new ApiResponse(200, "Email verified successfully")
    );
});