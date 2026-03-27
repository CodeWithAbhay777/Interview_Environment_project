import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import evaluateAnswersByAI from "../utils/AI_Evaluation.js";
import AIEvaluation from "../models/AIEvaluation.model.js";

export const evaluateCandidateAnswer = asyncHandler(async (req, res) => {
    const { question, candidateAnswer, difficulty , interviewId } = req.body;

    if (!question || !candidateAnswer || !difficulty) {
        throw new ApiError(400, "Question, candidate answer, and difficulty are required");
    }

    const ai_res = await evaluateAnswersByAI({ question, candidateAnswer, difficulty });

    if (!ai_res.success) {
        throw new ApiError(500, ai_res.error || "Failed to evaluate the candidate's answer");
    }

    const aiEvaluationData = {
        interview_Id: interviewId,
        question,
        candidateAnswer,
        difficulty,
        accuracy: parseInt(ai_res.response.accuracy),
        depth: parseInt(ai_res.response.depth),
        clarity: parseInt(ai_res.response.clarity),
        confidence: parseInt(ai_res.response.confidence),
        totalScore: parseInt(ai_res.response.totalScore),
        improvements: ai_res.response.improvements
    };

    const aiEvaluation = new AIEvaluation(aiEvaluationData);
    await aiEvaluation.save();
    res.status(200).json(new ApiResponse(200 , "Candidate answer evaluated successfully"));


})



