
import { getUserProfile } from "@/api/auth/getUserProfile";
import { useQuery } from "@tanstack/react-query"

export const useGetProfileQuery = ( id , role , options = {}) => {
    return useQuery({
        queryKey : ['userProfile' , id],
        queryFn : () => getUserProfile(id , role),
        staleTime: 4 * 60 * 1000,
        cacheTime: 15 * 60 * 1000,
        ...options,

    });
}