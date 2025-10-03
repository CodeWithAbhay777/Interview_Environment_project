import { useQuery } from "@tanstack/react-query";
import { getRecruiterInterviews } from "../../api/interviews/getRecruiterInterviews";

export const useGetRecruiterInterviews = ({ status = "all" }) => {
  return useQuery({
    queryKey: ["recruiterInterviews", status],
    queryFn: () => getRecruiterInterviews({ status }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};