import { getInterviewsByJob } from "@/api/interviews/getInterviewsByJob";
import { useQuery } from "@tanstack/react-query";

export const useGetInterviewsByJob = ({ jobId, status, interviewType, page, limit }) => {
    return useQuery({
        queryKey: ['jobInterviews', { jobId, status, interviewType, page, limit }],
        queryFn: () => getInterviewsByJob({ status, interviewType, page, limit }, jobId),
        staleTime: 2 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        keepPreviousData: true,
        enabled: !!jobId
    });
}