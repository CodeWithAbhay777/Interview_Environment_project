import { getAdminJobs } from "@/api/jobs/getAdminJobs";
import { useQuery } from "@tanstack/react-query";



export const useGetAdminJobs = ({page , limit , search , department , state}) => {
    return useQuery({
        queryKey : ['adminJobs' , {page , limit , search , department , state}],
        queryFn : () => getAdminJobs({page , limit , search , department , state}),
        staleTime: 2 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        keepPreviousData : true,
    });
}