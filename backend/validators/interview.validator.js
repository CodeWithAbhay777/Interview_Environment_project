import { z } from "zod";
import { objectIdValidator } from "./objectId.validator.js";

export const scheduleInterviewSchema = z.object({
  job: objectIdValidator,
  
  candidateSelected: objectIdValidator,
  
  interviewerAssigned: objectIdValidator,
  
  interviewType: z.enum(["frontend", "backend", "fullstack"], {
    errorMap: () => ({ message: "Interview type must be frontend, backend, or fullstack" }),
  }),
  
  scheduledAt: z.preprocess(
    (val) => new Date(val),
    z.date().min(new Date(), "Scheduled time must be in the future")
  ),
  
  notes: z.string().optional()
});