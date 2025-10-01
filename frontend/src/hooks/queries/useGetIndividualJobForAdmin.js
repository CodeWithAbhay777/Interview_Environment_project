import { getIndividualJobForAdmin } from "@/api/jobs/getIndividualJobForAdmin";
import { useQuery } from "@tanstack/react-query";

export const useGetIndividualJobForAdmin = (jobID) => {
    return useQuery({
        queryKey: ['adminJobDetails', jobID],
        queryFn: () => getIndividualJobForAdmin(jobID),
        staleTime: 2 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        enabled: !!jobID
    });
}