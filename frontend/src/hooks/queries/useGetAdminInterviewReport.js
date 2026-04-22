import { useQuery } from '@tanstack/react-query';
import { getAdminInterviewReport } from '@/api/report/getAdminInterviewReport';

export const useGetAdminInterviewReport = (interviewId) => {
  return useQuery({
    queryKey: ['adminInterviewReport', interviewId],
    queryFn: () => getAdminInterviewReport(interviewId),
    enabled: Boolean(interviewId),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
