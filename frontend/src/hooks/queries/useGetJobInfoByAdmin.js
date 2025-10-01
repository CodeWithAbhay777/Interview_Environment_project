import { getJobInfoByAdmin } from "@/api/jobs/getJobInfoByAdmin";
import { useQuery } from "@tanstack/react-query";

export const useGetJobInfoByAdmin = ({ jobID, status, page, limit }) => {
    return useQuery({
        queryKey: ['adminJobInfo', { jobID, status, page, limit }],
        queryFn: () => getJobInfoByAdmin({ status, page, limit }, jobID),
        staleTime: 2 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        keepPreviousData: true,
        enabled: !!jobID
    });
}