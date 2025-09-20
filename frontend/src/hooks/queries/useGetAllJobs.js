
import { getAllJobs } from "@/api/jobs/getAllJobs";
import { useQuery } from "@tanstack/react-query";



export const useGetAllJobs = ({page , limit , search , jobType , experienceLevel  , department , state , candidateId , appliedJobs}) => {
    
    return useQuery({
        queryKey : ['Jobs' , {page , limit , search ,jobType , experienceLevel, department , state , candidateId , appliedJobs }],
        queryFn : () => getAllJobs({page , limit , search ,jobType , experienceLevel, department , state , candidateId , appliedJobs}),
        staleTime: 30 * 1000, // 30 seconds - more frequent updates for real-time feel
        gcTime: 5 * 60 * 1000, // 5 minutes cache time (renamed from cacheTime in newer versions)
        keepPreviousData : true,
    });
}