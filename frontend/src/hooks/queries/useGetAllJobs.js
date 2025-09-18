
import { getAllJobs } from "@/api/jobs/getAllJobs";
import { useQuery } from "@tanstack/react-query";



export const useGetAllJobs = ({page , limit , search , jobType , experienceLevel  , department , state , appliedJobs}) => {
    console.log(appliedJobs)
    return useQuery({
        queryKey : ['Jobs' , {page , limit , search ,jobType , experienceLevel, department , state , appliedJobs }],
        queryFn : () => getAllJobs({page , limit , search ,jobType , experienceLevel, department , state , appliedJobs}),
        staleTime: 2 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        keepPreviousData : true,
    });
}