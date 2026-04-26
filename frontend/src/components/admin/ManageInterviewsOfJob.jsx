import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetInterviewsByJob } from '@/hooks/queries/useGetInterviewsByJob';
import { useGetIndividualJobForAdmin } from '@/hooks/queries/useGetIndividualJobForAdmin';
import { useGetAllInterviewers } from '@/hooks/queries/useGetAllInterviewers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateInterviewCandidateSelection } from '@/api/interviews/updateInterviewCandidateSelection';
import { updateInterviewDetails } from '@/api/interviews/updateInterviewDetails';
import { useGetAdminInterviewReport } from '@/hooks/queries/useGetAdminInterviewReport';
import {
  formatUtcToIstDate,
  formatUtcToIstFullDateTime,
  formatUtcToIstTime,
  toIstInputDate,
  toIstInputTime,
} from '@/utils/dateTime';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Icons
import { 
  ArrowLeft, 
  Briefcase, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Building2,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  Eye,
  Video,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
  FileText,
  Calendar,
  User2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BadgeCheck,
  Brain,
  CircleDot,
  Sparkles,
  FileStack
} from 'lucide-react';

const scoreTone = (score) => {
  if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-rose-700 bg-rose-50 border-rose-200';
};

const ReportScoreCard = ({ label, value, subtitle }) => (
  <Card className="border-slate-200 shadow-sm">
    <CardContent className="p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <Badge className={`${scoreTone(value)} border`}>{Math.round(value || 0)}%</Badge>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
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

const ReportMetricCard = ({ label, value, max }) => {
  const percent = max ? Math.round(((value || 0) / max) * 100) : 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">
        {value ?? 0} / {max}
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full bg-gradient-to-r from-[#7209b7] to-indigo-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

const ReportDialogSkeleton = () => (
  <div className="space-y-6 p-4 md:p-6">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
          <div className="flex flex-wrap gap-2 pt-1">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-28 rounded-2xl" />
    </div>

    <Skeleton className="h-10 w-full max-w-md rounded-xl" />
    <div className="space-y-4">
      <Skeleton className="h-56 rounded-2xl" />
      <Skeleton className="h-56 rounded-2xl" />
    </div>
  </div>
);

const ManageInterviewsOfJob = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('all');
  const [interviewType, setInterviewType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [selectionByInterviewId, setSelectionByInterviewId] = useState({});
  const [updatingSelectionByInterviewId, setUpdatingSelectionByInterviewId] = useState({});
  const [selectionConfirmOpen, setSelectionConfirmOpen] = useState(false);
  const [pendingSelectionAction, setPendingSelectionAction] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editInterviewDate, setEditInterviewDate] = useState('');
  const [editInterviewTime, setEditInterviewTime] = useState('');
  const [editInterviewerAssigned, setEditInterviewerAssigned] = useState('');
  const [editInterviewType, setEditInterviewType] = useState('');
  const [editInterviewNotes, setEditInterviewNotes] = useState('');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedReportInterviewId, setSelectedReportInterviewId] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // API Calls
  const { data: jobData, isLoading: jobLoading } = useGetIndividualJobForAdmin(id);
  const { 
    data: interviewsData, 
    isLoading: interviewsLoading, 
    refetch,
    isError,
    error 
  } = useGetInterviewsByJob({ 
    jobId: id, 
    status: status === 'all' ? undefined : status,
    interviewType: interviewType === 'all' ? undefined : interviewType,
    page, 
    limit 
  });
  const { data: interviewersData, isLoading: interviewersLoading } = useGetAllInterviewers();
  const {
    data: reportData,
    isLoading: reportLoading,
    isError: reportIsError,
    error: reportError,
    refetch: refetchReport,
    isRefetching: reportIsRefetching,
  } = useGetAdminInterviewReport(selectedReportInterviewId);

  const job = jobData?.data;
  const interviews = interviewsData?.data?.interviews || [];
  const totalInterviews = interviewsData?.data?.totalInterviews || 0;
  const totalPages = interviewsData?.data?.totalPages || 1;
  const availableInterviewers = interviewersData?.data || [];
  const report = reportData?.data;

  useEffect(() => {
    const mappedSelections = interviews.reduce((acc, interview) => {
      acc[interview._id] = interview?.isCandidateSelected === 'selected';
      return acc;
    }, {});

    setSelectionByInterviewId(mappedSelections);
  }, [interviews]);

  const selectionMutation = useMutation({
    mutationFn: ({ interviewId, isSelected }) =>
      updateInterviewCandidateSelection(interviewId, isSelected),
    onSuccess: (_data, variables) => {
      setUpdatingSelectionByInterviewId((prev) => ({
        ...prev,
        [variables.interviewId]: false
      }));

      toast.success(
        variables.isSelected
          ? 'Candidate shortlisted successfully. Selection email will be sent.'
          : 'Candidate selection reset to pending.'
      );

      queryClient.invalidateQueries({ queryKey: ['jobInterviews'] });
    },
    onError: (error, variables) => {
      setUpdatingSelectionByInterviewId((prev) => ({
        ...prev,
        [variables.interviewId]: false
      }));

      // Revert optimistic switch state when API call fails
      setSelectionByInterviewId((prev) => ({
        ...prev,
        [variables.interviewId]: variables.previousSelected
      }));

      toast.error(error?.response?.data?.message || error?.message || 'Failed to update candidate selection status');
      refetch();
    }
  });

  const editInterviewMutation = useMutation({
    mutationFn: ({ interviewId, interviewData }) => updateInterviewDetails(interviewId, interviewData),
    onSuccess: (data) => {
      toast.success(data?.message || 'Interview updated successfully');
      setEditDialogOpen(false);
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['jobInterviews'] });
      queryClient.invalidateQueries({ queryKey: ['candidateInterviews'] });
      queryClient.invalidateQueries({ queryKey: ['recruiterInterviews'] });
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update interview');
    }
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getInterviewTypeIcon = (type) => {
    switch (type) {
      case 'frontend': return <Eye className="h-4 w-4" />;
      case 'backend': return <MessageSquare className="h-4 w-4" />;
      case 'fullstack': return <Users className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      return formatUtcToIstDate(dateString, 'Invalid date');
    } catch {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString) => {
    try {
      return formatUtcToIstTime(dateString, 'Invalid time');
    } catch {
      return 'Invalid time';
    }
  };

  const formatDateTime = (dateString) => {
    try {
      return formatUtcToIstFullDateTime(dateString, 'Invalid date');
    } catch {
      return 'Invalid date';
    }
  };

  const openInterviewDialog = (interview) => {
    setSelectedInterview(interview);
    setDialogOpen(true);
  };

  const openReportDialog = (interview) => {
    if (!interview?._id) return;

    setSelectedReportInterviewId(interview._id);
    setReportDialogOpen(true);
  };

  const closeReportDialog = () => {
    setReportDialogOpen(false);
    setSelectedReportInterviewId('');
  };

  const toInputDate = (dateValue) => {
    if (!dateValue) return '';
    return toIstInputDate(dateValue);
  };

  const toInputTime = (dateValue) => {
    if (!dateValue) return '';
    return toIstInputTime(dateValue);
  };

  const openEditInterviewDialog = (interview) => {
    if (!interview) return;

    setEditInterviewerAssigned(interview?.interviewer?._id || '');
    setEditInterviewType(interview?.interviewType || '');
    setEditInterviewNotes(interview?.notes || '');
    setEditInterviewDate(toInputDate(interview?.scheduledAt));
    setEditInterviewTime(toInputTime(interview?.scheduledAt));
    setEditDialogOpen(true);
  };

  const closeEditInterviewDialog = () => {
    setEditDialogOpen(false);
    setEditInterviewerAssigned('');
    setEditInterviewType('');
    setEditInterviewNotes('');
    setEditInterviewDate('');
    setEditInterviewTime('');
  };

  const handleEditInterviewSubmit = () => {
    if (!selectedInterview?._id) {
      toast.error('No interview selected to update');
      return;
    }

    if (!editInterviewerAssigned || !editInterviewType || !editInterviewDate || !editInterviewTime) {
      toast.error('Please fill all required fields');
      return;
    }

    const payload = {};
    const currentInterviewerId = selectedInterview?.interviewer?._id;
    const currentInterviewType = selectedInterview?.interviewType;
    const currentNotes = selectedInterview?.notes || '';
    const currentScheduledAt = new Date(selectedInterview?.scheduledAt);

    if (editInterviewerAssigned !== currentInterviewerId) {
      payload.interviewerAssigned = editInterviewerAssigned;
    }

    if (editInterviewType !== currentInterviewType) {
      payload.interviewType = editInterviewType;
    }

    if (editInterviewNotes !== currentNotes) {
      payload.notes = editInterviewNotes;
    }

    const updatedSchedule = new Date(editInterviewDate);
    const [hours, minutes] = editInterviewTime.split(':');
    updatedSchedule.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    if (Number.isNaN(updatedSchedule.getTime())) {
      toast.error('Please provide a valid date and time');
      return;
    }

    if (updatedSchedule.getTime() !== currentScheduledAt.getTime()) {
      payload.scheduledAt = updatedSchedule;
    }

    if (Object.keys(payload).length === 0) {
      toast.info('No changes detected to update');
      return;
    }

    editInterviewMutation.mutate({
      interviewId: selectedInterview._id,
      interviewData: payload
    });
  };

  const closeInterviewDialog = () => {
    setDialogOpen(false);
    setSelectedInterview(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getInterviewScoreInfo = (interview) => {
    const finalScore = interview?.result?.finalResult ?? interview?.finalReport?.finalScore;
    const interviewerScore = interview?.interviewerEvaluation?.percentage ?? interview?.finalReport?.interviewerScorePercentage;
    const aiScore = interview?.finalReport?.aiScorePercentage;

    return {
      finalScore,
      interviewerScore,
      aiScore
    };
  };

  const formatScoreValue = (score) => {
    if (typeof score !== 'number' || Number.isNaN(score)) {
      return 'N/A';
    }

    return `${Math.round(score)}%`;
  };

  const hasFinalReport = (interview) => Boolean(interview?.finalReport?._id || interview?.result?.finalResult !== undefined);

  const canViewFullReport = (interview) => interview?.status === 'completed' && hasFinalReport(interview);

  const triggerSelectionUpdate = useCallback((interviewId, isSelected) => {
    const previousSelected = selectionByInterviewId[interviewId] ?? false;

    setSelectionByInterviewId((prev) => ({
      ...prev,
      [interviewId]: isSelected
    }));

    setUpdatingSelectionByInterviewId((prev) => ({
      ...prev,
      [interviewId]: true
    }));

    selectionMutation.mutate({ interviewId, isSelected, previousSelected });
  }, [selectionByInterviewId, selectionMutation]);

  const closeSelectionConfirmDialog = useCallback(() => {
    setSelectionConfirmOpen(false);
    setPendingSelectionAction(null);
  }, []);

  const handleSelectionToggle = useCallback((interview, isSelected) => {
    if (isSelected) {
      setPendingSelectionAction({
        interviewId: interview._id,
        candidateName: interview?.candidate?.username || 'this candidate'
      });
      setSelectionConfirmOpen(true);
      return;
    }

    triggerSelectionUpdate(interview._id, false);
  }, [triggerSelectionUpdate]);

  const confirmSelectionAndShortlist = useCallback(() => {
    if (!pendingSelectionAction?.interviewId) {
      return;
    }

    triggerSelectionUpdate(pendingSelectionAction.interviewId, true);
    closeSelectionConfirmDialog();
  }, [pendingSelectionAction, triggerSelectionUpdate, closeSelectionConfirmDialog]);

  const filteredInterviews = interviews.filter(interview => {
    if (!searchTerm) return true;
    
    const candidateName = interview.candidate?.username?.toLowerCase() || '';
    const candidateEmail = interview.candidate?.email?.toLowerCase() || '';
    const interviewerName = interview.interviewer?.username?.toLowerCase() || '';
    const interviewerEmail = interview.interviewer?.email?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    
    return candidateName.includes(search) || 
           candidateEmail.includes(search) ||
           interviewerName.includes(search) ||
           interviewerEmail.includes(search);
  });

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
          </PaginationItem>
          
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(p => (
            <PaginationItem key={p}>
              <PaginationLink
                onClick={() => setPage(p)}
                isActive={page === p}
                className="px-3 py-2"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-3"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  if (jobLoading || interviewsLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] bg-gray-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-8 w-64" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[calc(100vh-8rem)] bg-gray-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(`/admin/dashboard/jobs/${id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Job
            </Button>
          </div>
          
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-800">
                <AlertCircle className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Error Loading Interviews</h3>
                  <p className="text-sm text-red-600 mt-1">
                    Unable to load interviews. Please try again later.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 pb-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(`/admin/dashboard/jobs/${id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Job</span>
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
                Interview Management
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Manage all scheduled interviews for this position
              </p>
            </div>
          </div>
        </div>

        {/* Job Info Banner */}
        {job && (
          <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{job.title}</h2>
                  <p className="text-sm text-gray-600 capitalize">
                    {job.department} • {job.type} • {job.experienceLevel}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interview Statistics */}
        {totalInterviews > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CalendarIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{totalInterviews}</p>
                    <p className="text-sm text-gray-600">Total Interviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {interviews.filter(i => i.status === 'scheduled').length}
                    </p>
                    <p className="text-sm text-gray-600">Scheduled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {interviews.filter(i => i.status === 'completed').length}
                    </p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-medium">Search Candidate/Interviewer</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Interview Type</Label>
                <Select value={interviewType} onValueChange={setInterviewType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="fullstack">Full Stack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Per Page</Label>
                <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interviews Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold">Scheduled Interviews</CardTitle>
                <CardDescription>
                  {totalInterviews > 0 
                    ? `Showing ${filteredInterviews.length} of ${totalInterviews} interviews`
                    : 'No interviews scheduled yet'
                  }
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1">
                  Total: {totalInterviews}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={interviewsLoading}
                  className="flex items-center gap-2"
                >
                  {interviewsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filteredInterviews.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Interviews Found</h3>
                <p className="text-gray-600">
                  {searchTerm || status !== 'all' || interviewType !== 'all' 
                    ? 'Try adjusting your filters to see more results.'
                    : 'No interviews have been scheduled for this job yet.'
                  }
                </p>
              </div>
            ) : (
              <>
              {/* Desktop Table View */}
              <div className="hidden xl:block overflow-x-auto rounded-md border border-gray-100">
                <Table className="min-w-[1120px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Candidate</TableHead>
                      <TableHead className="w-[150px]">Interviewer</TableHead>
                      <TableHead className="w-[120px]">Type</TableHead>
                      <TableHead className="w-[150px]">Scheduled Date</TableHead>
                      <TableHead className="w-[100px]">Time</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[170px]">Scores</TableHead>
                      <TableHead className="w-[160px] sticky right-[80px] z-20 bg-white shadow-[-1px_0_0_0_rgba(229,231,235,1)]">Selected</TableHead>
                      <TableHead className="w-[80px] sticky right-0 z-20 bg-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInterviews.map((interview) => {
                      const scoreInfo = getInterviewScoreInfo(interview);
                      const isCompletedInterview = interview.status === 'completed';
                      const isSelected = selectionByInterviewId[interview._id] ?? (interview?.isCandidateSelected === 'selected');
                      const isUpdatingSelection = updatingSelectionByInterviewId[interview._id];

                      return (
                      <TableRow key={interview._id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage 
                                src={interview.candidate?.profilePhoto} 
                                alt={interview.candidate?.username}
                              />
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                {interview.candidate?.username?.charAt(0)?.toUpperCase() || 'N'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm text-gray-900">
                                {interview.candidate?.username || 'Unknown'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage 
                                src={interview.interviewer?.profilePhoto} 
                                alt={interview.interviewer?.username}
                              />
                              <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                                {interview.interviewer?.username?.charAt(0)?.toUpperCase() || 'I'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm text-gray-900">
                                {interview.interviewer?.username || 'Unknown'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getInterviewTypeIcon(interview.interviewType)}
                            <span className="text-sm capitalize font-medium">
                              {interview.interviewType}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium">
                              {formatDate(interview.scheduledAt)}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {formatTime(interview.scheduledAt)}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge 
                            variant={getStatusBadgeVariant(interview.status)}
                            className="capitalize px-2 py-1 text-xs"
                          >
                            {interview.status}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {isCompletedInterview ? (
                            <div className="space-y-1 min-w-[150px]">
                              <p className="text-xs text-gray-600">
                                Final: <span className="font-semibold text-gray-900">{formatScoreValue(scoreInfo.finalScore)}</span>
                              </p>
                              <p className="text-xs text-gray-600">
                                Interviewer: <span className="font-medium text-gray-900">{formatScoreValue(scoreInfo.interviewerScore)}</span>
                              </p>
                              <p className="text-xs text-gray-600">
                                AI: <span className="font-medium text-gray-900">{formatScoreValue(scoreInfo.aiScore)}</span>
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">Available after completion</span>
                          )}
                        </TableCell>

                        <TableCell className="sticky right-[80px] z-10 bg-white shadow-[-1px_0_0_0_rgba(229,231,235,1)]">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={isSelected}
                              onCheckedChange={(checked) => handleSelectionToggle(interview, checked)}
                              disabled={!isCompletedInterview || isUpdatingSelection}
                              aria-label="Toggle candidate selection"
                            />
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-gray-700">
                                {isSelected ? 'Selected' : 'Pending'}
                              </span>
                              {isUpdatingSelection ? (
                                <span className="text-[11px] text-gray-500">Saving...</span>
                              ) : null}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="sticky right-0 z-20 bg-white">
                          <div className="flex items-center justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-blue-50 hover:text-blue-600"
                              onClick={() => openInterviewDialog(interview)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )})}
                  </TableBody>
                </Table>
              </div>
              
              {/* Mobile Card View */}
              <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredInterviews.map((interview) => {
                  const scoreInfo = getInterviewScoreInfo(interview);
                  const isCompletedInterview = interview.status === 'completed';
                  const isSelected = selectionByInterviewId[interview._id] ?? (interview?.isCandidateSelected === 'selected');
                  const isUpdatingSelection = updatingSelectionByInterviewId[interview._id];

                  return (
                  <Card key={interview._id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage 
                              src={interview.candidate?.profilePhoto} 
                              alt={interview.candidate?.username}
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {interview.candidate?.username?.charAt(0)?.toUpperCase() || 'N'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {interview.candidate?.username || 'Unknown Candidate'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {getInterviewTypeIcon(interview.interviewType)}
                              <span className="text-sm text-gray-600 capitalize">
                                {interview.interviewType}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant={getStatusBadgeVariant(interview.status)}
                          className="capitalize px-2 py-1 text-xs"
                        >
                          {interview.status}
                        </Badge>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Interviewer:</span>
                          <span className="font-medium">
                            {interview.interviewer?.username || 'Unknown'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">
                            {formatDate(interview.scheduledAt)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">
                            {formatTime(interview.scheduledAt)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-xs truncate">
                            {interview.candidate?.email || 'No email'}
                          </span>
                        </div>

                        <div className="pt-2">
                          <Label className="text-xs font-semibold text-gray-600">Scores</Label>
                          {isCompletedInterview ? (
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <div className="rounded-md bg-gray-50 px-2 py-1 text-center">
                                <p className="text-[10px] text-gray-500">Final</p>
                                <p className="text-xs font-semibold text-gray-900">{formatScoreValue(scoreInfo.finalScore)}</p>
                              </div>
                              <div className="rounded-md bg-gray-50 px-2 py-1 text-center">
                                <p className="text-[10px] text-gray-500">Interviewer</p>
                                <p className="text-xs font-semibold text-gray-900">{formatScoreValue(scoreInfo.interviewerScore)}</p>
                              </div>
                              <div className="rounded-md bg-gray-50 px-2 py-1 text-center">
                                <p className="text-[10px] text-gray-500">AI</p>
                                <p className="text-xs font-semibold text-gray-900">{formatScoreValue(scoreInfo.aiScore)}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 mt-1">Available after completion</p>
                          )}
                        </div>

                        <div className="pt-2 flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                          <div>
                            <p className="text-xs font-semibold text-gray-700">Candidate Selected</p>
                            <p className="text-[11px] text-gray-500">
                              {isUpdatingSelection ? 'Saving changes...' : isSelected ? 'Marked as selected' : 'Pending decision'}
                            </p>
                          </div>
                          <Switch
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectionToggle(interview, checked)}
                            disabled={!isCompletedInterview || isUpdatingSelection}
                            aria-label="Toggle candidate selection"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center justify-center gap-2"
                          onClick={() => openInterviewDialog(interview)}
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )})}
              </div>
              </>
            )}
            
            {/* Pagination */}
            {renderPagination()}
          </CardContent>
        </Card>

        {/* Interview Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
            <div className="p-6">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <div className="flex items-center gap-2">
                    {selectedInterview && getStatusIcon(selectedInterview.status)}
                    <span>Interview Details</span>
                  </div>
                  <Badge 
                    variant={selectedInterview ? getStatusBadgeVariant(selectedInterview.status) : 'secondary'}
                    className="capitalize ml-auto"
                  >
                    {selectedInterview?.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Complete information about this scheduled interview
                </DialogDescription>
              </DialogHeader>

            {selectedInterview ? (
              <div className="space-y-6 mt-6">
                {/* Interview Overview */}
                <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getInterviewTypeIcon(selectedInterview.interviewType)}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Interview Type</p>
                          <p className="font-semibold capitalize">{selectedInterview.interviewType}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Calendar className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Scheduled For</p>
                          <p className="font-semibold">{formatDate(selectedInterview.scheduledAt)}</p>
                          <p className="text-sm text-gray-500">{formatTime(selectedInterview.scheduledAt)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Briefcase className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Position</p>
                          <p className="font-semibold">{selectedInterview.jobDetails?.title || 'N/A'}</p>
                          <p className="text-sm text-gray-500 capitalize">
                            {selectedInterview.jobDetails?.department || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Participants */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Candidate Information */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User2 className="h-5 w-5 text-blue-600" />
                        Candidate
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage 
                            src={selectedInterview.candidate?.profilePhoto} 
                            alt={selectedInterview.candidate?.username}
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                            {selectedInterview.candidate?.username?.charAt(0)?.toUpperCase() || 'N'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {selectedInterview.candidate?.username || 'Unknown Candidate'}
                          </h3>
                          <div className="space-y-2 mt-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                {selectedInterview.candidate?.email || 'No email provided'}
                              </span>
                            </div>
                            {selectedInterview.candidate?.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">
                                  {selectedInterview.candidate.phone}
                                </span>
                              </div>
                            )}

                          </div>
                        </div>
                      </div>

                    </CardContent>
                  </Card>

                  {/* Interviewer Information */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <UserCheck className="h-5 w-5 text-green-600" />
                        Interviewer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage 
                            src={selectedInterview.interviewer?.profilePhoto} 
                            alt={selectedInterview.interviewer?.username}
                          />
                          <AvatarFallback className="bg-green-100 text-green-600 text-lg">
                            {selectedInterview.interviewer?.username?.charAt(0)?.toUpperCase() || 'I'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {selectedInterview.interviewer?.username || 'Unknown Interviewer'}
                          </h3>
                          <div className="space-y-2 mt-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                {selectedInterview.interviewer?.email || 'No email provided'}
                              </span>
                            </div>
                            {selectedInterview.interviewer?.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">
                                  {selectedInterview.interviewer.phone}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600 capitalize">
                                {selectedInterview.interviewer?.role || 'Role not specified'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Interview Details */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-purple-600" />
                      Interview Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Full Schedule</Label>
                          <p className="text-sm text-gray-900 mt-1">
                            {formatDateTime(selectedInterview.scheduledAt)}
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Current Status</Label>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(selectedInterview.status)}
                            <Badge 
                              variant={getStatusBadgeVariant(selectedInterview.status)}
                              className="capitalize"
                            >
                              {selectedInterview.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Interview Type</Label>
                          <div className="flex items-center gap-2 mt-1">
                            {getInterviewTypeIcon(selectedInterview.interviewType)}
                            <span className="text-sm text-gray-900 capitalize font-medium">
                              {selectedInterview.interviewType}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Created On</Label>
                          <p className="text-sm text-gray-900 mt-1">
                            {formatDateTime(selectedInterview.createdAt)}
                          </p>
                        </div>
                        
                        {selectedInterview.currentlyRunning && (
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Status</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm text-green-600 font-medium">Currently Running</span>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Interview ID</Label>
                          <p className="text-sm text-gray-500 mt-1 font-mono">
                            {selectedInterview._id}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedInterview.notes && (
                      <div className="pt-4 border-t">
                        <Label className="text-sm font-medium text-gray-600">Notes</Label>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {selectedInterview.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={closeInterviewDialog}
                    className="flex-1 sm:flex-none"
                  >
                    Close
                  </Button>
                  <div className="flex gap-2 flex-1">
                    <Button
                      variant="outline"
                      className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                      onClick={() => {
                        openEditInterviewDialog(selectedInterview);
                      }}
                    >
                      Edit Interview
                    </Button>
                    
                    {canViewFullReport(selectedInterview) ? (
                      <Button
                        className="flex-1 flex items-center justify-center gap-2 bg-violet-600 text-white hover:bg-violet-700"
                        onClick={() => openReportDialog(selectedInterview)}
                      >
                        <FileText className="h-4 w-4" />
                        View Full Report
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No interview data available</p>
              </div>
            )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={reportDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              closeReportDialog();
              return;
            }

            setReportDialogOpen(open);
          }}
        >
          <DialogContent className="max-w-6xl w-[95vw] p-0 overflow-hidden border-slate-200 max-h-[92vh] sm:max-h-[95vh] focus:outline-none">
            <div className="flex max-h-[92vh] sm:max-h-[95vh] flex-col">
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-4 text-white sm:px-6">
                <DialogHeader>
                  <DialogTitle className="flex flex-col gap-3 text-xl sm:flex-row sm:items-center sm:justify-between">
                    <span>Full Interview Report</span>
                    <Badge className="w-fit bg-white/15 text-white hover:bg-white/20">
                      {selectedReportInterviewId || 'Interview report'}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="text-violet-100">
                    Detailed performance report with AI analysis, interviewer feedback, and candidate information.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50">
                {reportLoading ? (
                  <ReportDialogSkeleton />
                ) : reportIsError ? (
                  <div className="flex min-h-[360px] items-center justify-center p-4 md:p-6">
                    <Card className="w-full max-w-xl border-rose-200 bg-rose-50/60">
                      <CardContent className="py-10 text-center">
                        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-rose-600" />
                        <h3 className="text-lg font-semibold text-slate-900">Unable to load full report</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {reportError?.response?.data?.message || reportError?.message || 'Something went wrong while loading the report.'}
                        </p>
                        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
                          <Button variant="outline" onClick={() => refetchReport()}>
                            {reportIsRefetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Retry
                          </Button>
                          <Button className="bg-violet-600 text-white hover:bg-violet-700" onClick={closeReportDialog}>
                            Close
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : !report ? (
                  <div className="flex min-h-[360px] items-center justify-center p-4 md:p-6">
                    <Card className="w-full max-w-xl border-slate-200">
                      <CardContent className="py-10 text-center">
                        <FileStack className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                        <h3 className="text-lg font-semibold text-slate-900">No report data found</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          The interview has not produced a final report yet.
                        </p>
                        <Button className="mt-5 bg-violet-600 text-white hover:bg-violet-700" onClick={closeReportDialog}>
                          Close
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="space-y-6 p-4 md:p-6">
                    <section className="rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 p-4 md:p-5 shadow-sm">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 space-y-2">
                          <Badge className="bg-violet-600 text-white hover:bg-violet-600">Detailed Evaluation Report</Badge>
                          <h2 className="text-2xl font-bold text-slate-900">
                            {report.job?.title || 'Interview Report'}
                          </h2>
                          <p className="text-sm text-slate-600">
                            Generated on {formatDateTime(report.createdAt)} • Interview type: {report.interview?.interviewType || 'N/A'}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <Badge variant="outline" className="border-slate-200 bg-white/80 text-slate-700">
                              Candidate: {report.candidateSelected?.username || 'Not available'}
                            </Badge>
                            <Badge variant="outline" className="border-slate-200 bg-white/80 text-slate-700">
                              Interviewer: {report.interviewer?.username || 'Not available'}
                            </Badge>
                            <Badge variant="outline" className="border-slate-200 bg-white/80 text-slate-700">
                              Status: {report.interview?.status || 'N/A'}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" onClick={closeReportDialog} className="w-full lg:w-auto">
                          Close
                        </Button>
                      </div>
                    </section>

                    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <ReportScoreCard label="Final Score" value={report.finalScore || 0} subtitle="Combined AI and interviewer performance" />
                      <ReportScoreCard label="AI Score" value={report.aiScorePercentage || 0} subtitle="Based on question-wise AI evaluation" />
                      <ReportScoreCard label="Interviewer Score" value={report.interviewerScorePercentage || 0} subtitle="Based on recruiter/interviewer rubric" />
                    </section>

                    <Tabs defaultValue="overview" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-3 bg-violet-100/70 sm:w-auto sm:inline-flex">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="interviewer">Interviewer Feedback</TabsTrigger>
                        <TabsTrigger value="ai">AI Analysis</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                          <Card className="border-slate-200 xl:col-span-2">
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                                <Briefcase className="h-4 w-4 text-violet-600" /> Job & Interview Context
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                  <p className="text-xs text-slate-500">Role</p>
                                  <p className="font-semibold text-slate-900">{report.job?.title || 'Not available'}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                  <p className="text-xs text-slate-500">Department</p>
                                  <p className="font-semibold capitalize text-slate-900">{report.job?.department || 'Not available'}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                  <p className="text-xs text-slate-500">Interview Type</p>
                                  <p className="font-semibold capitalize text-slate-900">{report.interview?.interviewType || 'Not available'}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                  <p className="text-xs text-slate-500">Scheduled At</p>
                                  <p className="font-semibold text-slate-900">{formatDateTime(report.interview?.scheduledAt)}</p>
                                </div>
                              </div>

                              <Separator />

                              <div className="space-y-2">
                                <p className="text-xs text-slate-500">Compensation</p>
                                <p className="font-medium text-slate-900">
                                  {typeof report.job?.salaryOffered === 'number'
                                    ? `${report.job.salaryCurrency || ''} ${report.job.salaryOffered}`
                                    : 'Not specified'} / {report.job?.salaryPeriod || 'period not specified'}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <p className="text-xs text-slate-500">Skills Required</p>
                                <div className="flex flex-wrap gap-2">
                                  {(report.job?.skillsRequired || []).length ? (
                                    report.job.skillsRequired.map((skill) => (
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
                                <p className="text-sm leading-relaxed text-slate-700">
                                  {report.job?.description || 'Description not available'}
                                </p>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border-slate-200">
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                                <User2 className="h-4 w-4 text-violet-600" /> Participants
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                              <div className="rounded-lg border border-slate-200 bg-white p-3">
                                <p className="text-xs text-slate-500">Candidate</p>
                                <p className="font-semibold text-slate-900">{report.candidateSelected?.username || 'Not available'}</p>
                                <p className="mt-1 flex items-center gap-1 text-xs text-slate-600">
                                  <Mail className="h-3.5 w-3.5" /> {report.candidateSelected?.email || 'Not available'}
                                </p>
                              </div>
                              <div className="rounded-lg border border-slate-200 bg-white p-3">
                                <p className="text-xs text-slate-500">Interviewer</p>
                                <p className="font-semibold text-slate-900">{report.interviewer?.username || 'Not available'}</p>
                                <p className="mt-1 flex items-center gap-1 text-xs text-slate-600">
                                  <Mail className="h-3.5 w-3.5" /> {report.interviewer?.email || 'Not available'}
                                </p>
                              </div>
                              <div className="rounded-lg border border-slate-200 bg-white p-3">
                                <p className="mb-2 text-xs text-slate-500">Interview Flags</p>
                                <div className="space-y-2 text-xs text-slate-700">
                                  <p className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                    Score Submitted: {report.interview?.isScoreGiven ? 'Yes' : 'No'}
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <CircleDot className="h-3.5 w-3.5 text-violet-600" />
                                    Interviewer Joined: {report.interview?.isInterviewerJoined ? 'Yes' : 'No'}
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                                    Status: {report.interview?.status || 'N/A'}
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
                            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                              <BadgeCheck className="h-4 w-4 text-violet-600" /> Interviewer Evaluation Breakdown
                            </CardTitle>
                            <CardDescription>
                              Human evaluation scores and recommendation captured after interview completion.
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {report.interviewerEvaluation ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                  <ReportMetricCard label="Problem Solving" value={report.interviewerEvaluation.problemSolving} max={10} />
                                  <ReportMetricCard label="Communication" value={report.interviewerEvaluation.communication} max={10} />
                                  <ReportMetricCard label="Technical Knowledge" value={report.interviewerEvaluation.technicalKnowledge} max={10} />
                                  <ReportMetricCard label="Confidence" value={report.interviewerEvaluation.confidence} max={10} />
                                  <ReportMetricCard label="Overall Impression" value={report.interviewerEvaluation.overallImpression} max={10} />
                                  <ReportMetricCard label="Total Score" value={report.interviewerEvaluation.totalScore} max={50} />
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                  <p className="mb-1 text-sm font-semibold text-slate-900">Recommendation Note</p>
                                  <p className="text-sm leading-relaxed text-slate-700">
                                    {report.interviewerEvaluation.recommendationNote || 'No recommendation note was added.'}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                                <BadgeCheck className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                                <p className="font-medium text-slate-700">Interviewer evaluation is not available.</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="ai" className="space-y-4">
                        <Card className="border-slate-200">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                              <Brain className="h-4 w-4 text-violet-600" /> AI Question-by-Question Evaluation
                            </CardTitle>
                            <CardDescription>
                              Question, answer, scoring dimensions, and improvement suggestions for each response.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {report.aiEvaluations?.length ? (
                              report.aiEvaluations.map((item, index) => (
                                <div key={item._id || `${item.question}-${index}`} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <Badge variant="outline" className="border-violet-200 text-violet-700">Question {index + 1}</Badge>
                                    <div className="flex items-center gap-2">
                                      <Badge className={`${scoreTone(((item.totalScore || 0) / 40) * 100)} border`}>
                                        Score: {item.totalScore || 0} / 40
                                      </Badge>
                                      <Badge variant="outline" className="capitalize">{item.difficulty || 'N/A'}</Badge>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <p className="text-xs font-medium text-slate-500">Question</p>
                                    <p className="text-sm leading-relaxed text-slate-800">{item.question || 'Question not available'}</p>
                                  </div>

                                  <div className="space-y-2">
                                    <p className="text-xs font-medium text-slate-500">Candidate Answer</p>
                                    <p className="text-sm leading-relaxed text-slate-700">{item.candidateAnswer || 'Answer not available'}</p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                                    {[
                                      { key: 'accuracy', label: 'Accuracy' },
                                      { key: 'depth', label: 'Depth' },
                                      { key: 'clarity', label: 'Clarity' },
                                      { key: 'confidence', label: 'Confidence' },
                                    ].map((metric) => (
                                      <div key={metric.key} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                                        <p className="text-[11px] text-slate-500">{metric.label}</p>
                                        <p className="text-sm font-semibold text-slate-900">{item[metric.key] || 0} / 10</p>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="rounded-lg border border-violet-100 bg-violet-50/60 p-3">
                                    <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                                      <Sparkles className="h-3.5 w-3.5 text-violet-600" /> Improvement Suggestions
                                    </p>
                                    {(item.improvements || []).length ? (
                                      <ul className="space-y-1.5">
                                        {item.improvements.map((tip, tipIndex) => (
                                          <li key={`${item._id || index}-tip-${tipIndex}`} className="flex items-start gap-2 text-sm text-slate-700">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-600" />
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
                                <Brain className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                                <p className="font-medium text-slate-700">AI evaluation details are not available.</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              closeEditInterviewDialog();
              return;
            }
            setEditDialogOpen(open);
          }}
        >
          <DialogContent className="max-w-2xl border-purple-200 p-0">
            <div className="rounded-t-lg bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-5 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Edit Interview</DialogTitle>
                <DialogDescription className="text-purple-100">
                  Update interviewer, schedule, type, and notes for this interview.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div className="rounded-lg border border-purple-100 bg-purple-50/60 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-purple-700">Interview Candidate</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {selectedInterview?.candidate?.username || 'Unknown Candidate'}
                </p>
                <p className="text-xs text-gray-600">{selectedInterview?.candidate?.email || 'No email available'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-interviewer" className="text-gray-700">Interviewer *</Label>
                  <Select value={editInterviewerAssigned} onValueChange={setEditInterviewerAssigned}>
                    <SelectTrigger id="edit-interviewer" className="border-purple-200 focus:ring-purple-400">
                      <SelectValue placeholder="Choose interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {interviewersLoading ? (
                        <SelectItem value="loading" disabled>Loading interviewers...</SelectItem>
                      ) : (
                        availableInterviewers.map((interviewer) => (
                          <SelectItem key={interviewer._id} value={interviewer._id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={interviewer.profilePhoto} />
                                <AvatarFallback className="bg-purple-100 text-[10px] text-purple-700">
                                  {(interviewer.fullname || interviewer.username || 'I').charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span>{interviewer.fullname || interviewer.username}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-interview-type" className="text-gray-700">Interview Type *</Label>
                  <Select value={editInterviewType} onValueChange={setEditInterviewType}>
                    <SelectTrigger id="edit-interview-type" className="border-purple-200 focus:ring-purple-400">
                      <SelectValue placeholder="Select interview type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">Frontend Development</SelectItem>
                      <SelectItem value="backend">Backend Development</SelectItem>
                      <SelectItem value="fullstack">Full Stack Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-interview-date" className="text-gray-700">Reschedule Date *</Label>
                  <Input
                    id="edit-interview-date"
                    type="date"
                    value={editInterviewDate}
                    onChange={(e) => setEditInterviewDate(e.target.value)}
                    className="border-purple-200 focus-visible:ring-purple-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-interview-time" className="text-gray-700">Reschedule Time *</Label>
                  <Input
                    id="edit-interview-time"
                    type="time"
                    value={editInterviewTime}
                    onChange={(e) => setEditInterviewTime(e.target.value)}
                    className="border-purple-200 focus-visible:ring-purple-400"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-interview-notes" className="text-gray-700">Notes</Label>
                  <Textarea
                    id="edit-interview-notes"
                    value={editInterviewNotes}
                    onChange={(e) => setEditInterviewNotes(e.target.value)}
                    placeholder="Add updated interview instructions, reminders, or context..."
                    className="min-h-[110px] border-purple-200 focus-visible:ring-purple-400"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="border-t bg-purple-50/40 px-6 py-4">
              <Button
                variant="outline"
                onClick={closeEditInterviewDialog}
                disabled={editInterviewMutation.isPending}
                className="border-purple-200 text-purple-700 hover:bg-purple-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditInterviewSubmit}
                disabled={editInterviewMutation.isPending}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                {editInterviewMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={selectionConfirmOpen}
          onOpenChange={(open) => {
            setSelectionConfirmOpen(open);
            if (!open) {
              setPendingSelectionAction(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Shortlist Candidate?</DialogTitle>
              <DialogDescription>
                Are you sure you want to select/shortlist {pendingSelectionAction?.candidateName || 'this candidate'}?
                Once confirmed, we will send an email to the candidate saying they are selected.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={closeSelectionConfirmDialog}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSelectionAndShortlist}
                disabled={selectionMutation.isPending}
              >
                {selectionMutation.isPending ? 'Confirming...' : 'Yes, Shortlist'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ManageInterviewsOfJob;