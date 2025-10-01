
import { getIndividualAdminJob } from "@/api/jobs/getIndividualAdminJob";
import { useQuery } from "@tanstack/react-query";




export const useGetIndividualAdminJob = ({jobID , status , page , limit} ) => {
    return useQuery({
        queryKey : ['adminJob' , {jobID , status , page , limit}],
        queryFn : () => getIndividualAdminJob({status , page , limit} , jobID),
        staleTime: 2 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        keepPreviousData : true,
    });
}   