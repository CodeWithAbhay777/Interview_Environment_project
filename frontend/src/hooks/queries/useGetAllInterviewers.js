import { getAllInterviewers } from "@/api/users/getAllInterviewers";
import { useQuery } from "@tanstack/react-query";

export const useGetAllInterviewers = () => {
    return useQuery({
        queryKey: ['interviewers'],
        queryFn: getAllInterviewers,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });
};