import { getCandidateInterviews } from "@/api/interviews/getCandidateInterviews";
import { useQuery } from "@tanstack/react-query";

export const useGetCandidateInterviews = ({ status } = {}) => {
    return useQuery({
        queryKey: ['candidateInterviews', { status }],
        queryFn: () => getCandidateInterviews({ status }),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes cache time
        keepPreviousData: true,
    });
}