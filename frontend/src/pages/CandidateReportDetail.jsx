import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Brain,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  FileStack,
  Loader2,
  Mail,
  MessageSquareText,
  Sparkles,
  User2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCandidateReportDetail } from '@/hooks/queries/useGetCandidateReportDetail';

const formatDateTime = (value) => {
  if (!value) return 'Not available';

  try {
    return format(parseISO(value), 'MMM dd, yyyy • hh:mm a');
  } catch {
    return 'Not available';
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

const ScoreCard = ({ label, value, subtitle }) => (
  <Card className="border-slate-200 shadow-sm">
    <CardContent className="p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <Badge className={`${scoreTone(value)} border`}>{Math.round(value || 0)}%</Badge>
        <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7209b7] to-indigo-500"
            style={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }}
          />
        </div>
      </div>
      {subtitle ? <p className="mt-2 text-xs text-slate-500">{subtitle}</p> : null}
    </CardContent>
  </Card>
);

const CandidateReportDetail = () => {
  const { reportId } = useParams();
  const { data, isLoading, error, refetch, isRefetching } = useGetCandidateReportDetail(reportId);

  const report = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 space-y-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-5 w-[32rem] max-w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>

          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-6 md:px-6 md:py-10">
          <Card className="border-rose-200 bg-rose-50/40">
            <CardContent className="py-10 text-center">
              <AlertCircle className="h-10 w-10 text-rose-600 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-slate-900">Unable to load detailed report</h2>
              <p className="text-slate-600 mt-1 mb-4">{error.message || 'Something went wrong.'}</p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => refetch()}>
                  {isRefetching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Retry
                </Button>
                <Button asChild className="bg-[#7209b7] hover:bg-[#5f0899]">
                  <Link to="/candidate/results">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Reports
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-6 md:px-6 md:py-10">
          <Card>
            <CardContent className="py-10 text-center">
              <FileStack className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-slate-900">No report data found</h2>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/candidate/results">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Reports
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const aiItems = report.aiEvaluations || [];
  const interviewerEval = report.interviewerEvaluation;
  const job = report.job || {};
  const interview = report.interview || {};
  const candidate = report.candidate || {};
  const interviewer = report.interviewer || {};

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 space-y-6">
        <section className="rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge className="mb-2 bg-[#7209b7] hover:bg-[#5f0899] text-white">Detailed Evaluation Report</Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{job.title || 'Interview Report'}</h1>
              <p className="mt-1 text-sm md:text-base text-slate-600">
                Report ID: {reportId} • Generated on {formatDateTime(report.createdAt)}
              </p>
            </div>
            <Button asChild variant="outline" className="w-full md:w-auto">
              <Link to="/candidate/results">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Reports
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ScoreCard label="Final Score" value={report.finalScore || 0} subtitle="Combined AI and interviewer performance" />
          <ScoreCard label="AI Score" value={report.aiScorePercentage || 0} subtitle="Based on question-wise AI evaluation" />
          <ScoreCard label="Interviewer Score" value={report.interviewerScorePercentage || 0} subtitle="Based on recruiter/interviewer rubric" />
        </section>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full md:w-auto bg-violet-100/70">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="interviewer">Interviewer Feedback</TabsTrigger>
            <TabsTrigger value="ai">AI Question Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <Card className="xl:col-span-2 border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-slate-900 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-[#7209b7]" /> Job & Interview Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-200 p-3 bg-white">
                      <p className="text-xs text-slate-500">Role</p>
                      <p className="font-semibold text-slate-900">{job.title || 'Not available'}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-3 bg-white">
                      <p className="text-xs text-slate-500">Department</p>
                      <p className="font-semibold text-slate-900 capitalize">{job.department || 'Not available'}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-3 bg-white">
                      <p className="text-xs text-slate-500">Interview Type</p>
                      <p className="font-semibold text-slate-900 capitalize">{interview.interviewType || 'Not available'}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-3 bg-white">
                      <p className="text-xs text-slate-500">Scheduled At</p>
                      <p className="font-semibold text-slate-900">{formatDateTime(interview.scheduledAt)}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">Compensation</p>
                    <p className="font-medium text-slate-900">
                      {formatCurrency(job.salaryOffered, job.salaryCurrency)} / {job.salaryPeriod || 'period not specified'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">Skills Required</p>
                    <div className="flex flex-wrap gap-2">
                      {(job.skillsRequired || []).length ? (
                        job.skillsRequired.map((skill) => (
                          <Badge key={skill} variant="outline" className="border-violet-200 text-slate-700">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">No skills listed</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">Job Description</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{job.description || 'Description not available'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-slate-900 flex items-center gap-2">
                    <User2 className="h-4 w-4 text-[#7209b7]" /> Participants
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="rounded-lg border border-slate-200 p-3 bg-white">
                    <p className="text-xs text-slate-500">Candidate</p>
                    <p className="font-semibold text-slate-900">{candidate.username || 'Not available'}</p>
                    <p className="text-slate-600 text-xs mt-1 flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" /> {candidate.email || 'Not available'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-3 bg-white">
                    <p className="text-xs text-slate-500">Interviewer</p>
                    <p className="font-semibold text-slate-900">{interviewer.username || 'Not available'}</p>
                    <p className="text-slate-600 text-xs mt-1 flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" /> {interviewer.email || 'Not available'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-3 bg-white">
                    <p className="text-xs text-slate-500 mb-2">Interview Flags</p>
                    <div className="space-y-2 text-xs text-slate-700">
                      <p className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Score Submitted: {interview.isScoreGiven ? 'Yes' : 'No'}
                      </p>
                      <p className="flex items-center gap-2">
                        <CircleDot className="h-3.5 w-3.5 text-[#7209b7]" />
                        Interviewer Joined: {interview.isInterviewerJoined ? 'Yes' : 'No'}
                      </p>
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-indigo-600" />
                        Status: {interview.status || 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interviewer" className="space-y-4">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base text-slate-900 flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-[#7209b7]" /> Interviewer Evaluation Breakdown
                </CardTitle>
                <CardDescription>
                  Human evaluation scores and recommendation captured after interview completion.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {interviewerEval ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                      {[
                        { label: 'Problem Solving', value: interviewerEval.problemSolving, max: 10 },
                        { label: 'Communication', value: interviewerEval.communication, max: 10 },
                        { label: 'Technical Knowledge', value: interviewerEval.technicalKnowledge, max: 10 },
                        { label: 'Confidence', value: interviewerEval.confidence, max: 10 },
                        { label: 'Overall Impression', value: interviewerEval.overallImpression, max: 10 },
                        { label: 'Total Score', value: interviewerEval.totalScore, max: 50 },
                      ].map((item) => {
                        const percent = item.max ? Math.round(((item.value || 0) / item.max) * 100) : 0;
                        return (
                          <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-3">
                            <p className="text-xs text-slate-500">{item.label}</p>
                            <p className="mt-1 text-lg font-semibold text-slate-900">{item.value ?? 0} / {item.max}</p>
                            <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#7209b7] to-indigo-500" style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900 mb-1">Recommendation Note</p>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {interviewerEval.recommendationNote || 'No recommendation note was added.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <MessageSquareText className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-700 font-medium">Interviewer evaluation is not available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base text-slate-900 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-[#7209b7]" /> AI Question-by-Question Evaluation
                </CardTitle>
                <CardDescription>
                  Includes question, your answer, dimension-wise scoring, and improvement suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiItems.length ? (
                  aiItems.map((item, index) => (
                    <div key={item._id || `${item.question}-${index}`} className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Badge variant="outline" className="border-violet-200 text-[#7209b7]">Question {index + 1}</Badge>
                        <div className="flex items-center gap-2">
                          <Badge className={`${scoreTone(((item.totalScore || 0) / 40) * 100)} border`}>
                            Score: {item.totalScore || 0} / 40
                          </Badge>
                          <Badge variant="outline" className="capitalize">{item.difficulty || 'N/A'}</Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-500">Question</p>
                        <p className="text-sm text-slate-800 leading-relaxed">{item.question || 'Question not available'}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-500">Candidate Answer</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{item.candidateAnswer || 'Answer not available'}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          { key: 'accuracy', label: 'Accuracy' },
                          { key: 'depth', label: 'Depth' },
                          { key: 'clarity', label: 'Clarity' },
                          { key: 'confidence', label: 'Confidence' },
                        ].map((metric) => {
                          const value = item[metric.key] || 0;
                          return (
                            <div key={metric.key} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                              <p className="text-[11px] text-slate-500">{metric.label}</p>
                              <p className="text-sm font-semibold text-slate-900">{value} / 10</p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="rounded-lg border border-violet-100 bg-violet-50/60 p-3">
                        <p className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-[#7209b7]" /> Improvement Suggestions
                        </p>
                        {(item.improvements || []).length ? (
                          <ul className="space-y-1.5">
                            {item.improvements.map((tip, tipIndex) => (
                              <li key={`${item._id || index}-tip-${tipIndex}`} className="text-sm text-slate-700 flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#7209b7]" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-600">No improvements provided.</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <Brain className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-700 font-medium">AI evaluation details are not available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CandidateReportDetail;
