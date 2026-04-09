import { useQuery } from '@tanstack/react-query';
import { getCandidateReportDetail } from '@/api/report/getCandidateReportDetail';

export const useGetCandidateReportDetail = (reportId) => {
  return useQuery({
    queryKey: ['candidateReportDetail', reportId],
    queryFn: () => getCandidateReportDetail(reportId),
    enabled: Boolean(reportId),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
