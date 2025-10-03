import { getAllInterviews } from "@/api/interviews/getAllInterviews";
import { useQuery } from "@tanstack/react-query";

export const useGetAllInterviews = ({ page, limit, status, interviewType } = {}) => {
    return useQuery({
        queryKey: ['allInterviews', { page, limit, status, interviewType }],
        queryFn: () => getAllInterviews({ page, limit, status, interviewType }),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes cache time
        keepPreviousData: true,
    });
}