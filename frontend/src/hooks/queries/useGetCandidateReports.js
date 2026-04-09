import { useQuery } from '@tanstack/react-query';
import { getCandidateReports } from '@/api/report/getCandidateReports';

export const useGetCandidateReports = () => {
  return useQuery({
    queryKey: ['candidateReports'],
    queryFn: getCandidateReports,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
