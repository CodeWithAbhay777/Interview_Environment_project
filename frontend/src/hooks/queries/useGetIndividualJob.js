import { getIndividualJob } from "@/api/jobs/getIndividualJob";
import { useQuery } from "@tanstack/react-query";


    
export const useGetIndividualJob = (id) => {
    
    return useQuery({
        queryKey : ['Jobs' , id],
        queryFn : () => getIndividualJob(id),
        staleTime: 2 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        keepPreviousData : true,
    });
}