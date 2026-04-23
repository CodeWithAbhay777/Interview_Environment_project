import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  BarChart3,
  Briefcase,
  CalendarDays,
  ChevronRight,
  FileText,
  Loader2,
  Sparkles,
  Target,
  Wallet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCandidateReports } from '@/hooks/queries/useGetCandidateReports';
import { formatUtcToIstDate } from '@/utils/dateTime';

const formatDate = (value) => {
  if (!value) return 'Date unavailable';

  try {
    return formatUtcToIstDate(value, 'Date unavailable');
  } catch {
    return 'Date unavailable';
  }
};

const formatCurrency = (amount, currency = 'INR') => {
  if (typeof amount !== 'number') return 'Not specified';

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount}`;
  }
};

const scoreTone = (score) => {
  if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-rose-700 bg-rose-50 border-rose-200';
};

const scoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  return 'Needs Improvement';
};

const CandidateResults = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch, isRefetching } = useGetCandidateReports();

  const reports = data?.data || [];

  const averageScore = reports.length
    ? Math.round(reports.reduce((acc, item) => acc + (item.finalScore || 0), 0) / reports.length)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 space-y-6">
          <div className="rounded-2xl border border-violet-200/60 bg-gradient-to-r from-violet-100/70 to-indigo-100/70 p-6 md:p-8 space-y-3">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-5 w-[32rem] max-w-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Card key={idx} className="shadow-sm border-slate-200 overflow-hidden">
                <CardContent className="p-5 space-y-4">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_5%_15%,rgba(114,9,183,0.08),transparent_38%),radial-gradient(circle_at_95%_5%,rgba(79,70,229,0.1),transparent_38%),#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-violet-300/70 bg-gradient-to-r from-violet-100 to-indigo-100 p-5 md:p-7">
          <div className="pointer-events-none absolute -top-16 -right-14 h-44 w-44 rounded-full bg-[#7209b7]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge className="mb-3 bg-[#7209b7] hover:bg-[#5f0899] text-white">Candidate Dashboard</Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Interview Reports</h1>
              <p className="mt-1 text-sm md:text-base text-slate-700 max-w-2xl">
                Review all completed interview results and open detailed reports when needed.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              <Card className="shadow-none border-violet-200 bg-white/90">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                    <FileText className="h-3.5 w-3.5 text-[#7209b7]" /> Total Reports
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">{reports.length}</p>
                </CardContent>
              </Card>
              <Card className="shadow-none border-violet-200 bg-white/90">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                    <Target className="h-3.5 w-3.5 text-[#7209b7]" /> Avg. Score
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">{averageScore}%</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {error ? (
          <Card className="border-rose-200 bg-rose-50/40">
            <CardContent className="py-10 text-center">
              <AlertCircle className="h-10 w-10 text-rose-600 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-slate-900">Unable to fetch reports</h2>
              <p className="text-slate-600 mt-1 mb-4">{error.message || 'Something went wrong while loading reports.'}</p>
              <Button variant="outline" onClick={() => refetch()}>
                {isRefetching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : reports.length === 0 ? (
          <Card>
            <CardContent className="py-14 text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-slate-900">No reports available yet</h2>
              <p className="text-slate-600 mt-1">
                Your interview reports will appear here once evaluations are completed.
              </p>
            </CardContent>
          </Card>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {reports.map((report) => {
              const title = report.job?.title || 'Role not available';
              const department = report.job?.department || 'Department not specified';
              const type = report.job?.type || 'job';
              const salaryText = formatCurrency(report.job?.salaryOffered, report.job?.salaryCurrency);
              const score = Math.round(report.finalScore || 0);

              return (
                <Card
                  key={report._id}
                  className="overflow-hidden border-slate-200 shadow-sm"
                >
                  <CardHeader className="pb-3 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base md:text-lg text-slate-900 leading-tight">
                          {title}
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-600 mt-1">{department}</CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="capitalize border-violet-200 text-[#7209b7] bg-violet-50 shrink-0"
                      >
                        {type}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-3.5">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <p className="text-xs font-medium text-slate-600">Final Score</p>
                        <Badge className={`${scoreTone(score)} border`}>{scoreLabel(score)}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center rounded-md border px-2 py-1 text-sm font-semibold ${scoreTone(score)}`}>
                          <BarChart3 className="h-3.5 w-3.5 mr-1" />
                          {score}%
                        </div>
                        <div className="h-2 flex-1 rounded-full bg-violet-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#7209b7] to-indigo-500"
                            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg border border-slate-200 bg-white p-3">
                        <div className="flex items-center gap-2 text-slate-700 mb-1">
                          <CalendarDays className="h-4 w-4 text-[#7209b7]" />
                          <span className="font-medium">Interviewed On</span>
                        </div>
                        <p className="text-slate-600">{formatDate(report.createdAt)}</p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white p-3">
                        <div className="flex items-center gap-2 text-slate-700 mb-1">
                          <Sparkles className="h-4 w-4 text-[#7209b7]" />
                          <span className="font-medium">Report Status</span>
                        </div>
                        <p className="text-slate-600">Generated</p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-700 mb-1">
                        <Wallet className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">Compensation</span>
                      </div>
                      <p className="text-slate-600">{salaryText} / {report.job?.salaryPeriod || 'period not specified'}</p>
                    </div>

                    <Button
                      className="w-full bg-[#7209b7] hover:bg-[#5f0899] text-white"
                      onClick={() => navigate(`/candidate/results/${report._id}`)}
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Show Detailed Report
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
};

export default CandidateResults;