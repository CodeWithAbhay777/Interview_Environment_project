import { MessagesSquare ,UsersRound , BriefcaseBusiness } from "lucide-react";



export const USER_API_END_POINT = "http://localhost:8000/api/v1/user";
export const JOB_API_END_POINT = "http://localhost:8000/api/v1/job";
export const APPLICATION_API_END_POINT =
  "http://localhost:8000/api/v1/application";
export const COMPANY_API_END_POINT = "http://localhost:8000/api/v1/company";

export const DASHBOARD_MENU_ITEMS = [
  {
    title: "Manage Jobs",
    url: "/admin/dashboard/jobs",
    icon: BriefcaseBusiness,
  },
  {
    title: "Manage Interviews",
    url: "/admin/dashboard/interviews",
    icon: UsersRound,
  },
  {
    title: "Feedbacks",
    url: "/admin/dashboard/feedbacks",
    icon: MessagesSquare,
  },

];

export const JOB_TYPES=['job','internship']
export const JOB_DEPARTMENTS=["software engineer" , "backend developer" , "frontend developer" , "fullstack developer"]
export const JOB_EXPERIENCE_LEVELS=["fresher", "junior", "mid", "senior", "lead"]
export const JOB_SALARY_CURRENCIES=["INR", "USD", "EUR", "GBP"]
export const JOB_SALARY_PERIODS=["monthly", "yearly", "hourly"]