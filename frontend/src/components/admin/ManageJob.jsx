import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetIndividualJobForAdmin } from '@/hooks/queries/useGetIndividualJobForAdmin';
import { useGetJobInfoByAdmin } from '@/hooks/queries/useGetJobInfoByAdmin';
import { useGetAllInterviewers } from '@/hooks/queries/useGetAllInterviewers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleInterview } from '@/api/interviews/scheduleInterview';
import { toast } from 'sonner';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Icons
import { 
  ArrowLeft, 
  Briefcase, 
  Calendar as CalendarIcon, 
  Clock, 
  DollarSign, 
  Eye, 
  FileText, 
  Mail, 
  MapPin, 
  Phone, 
  Users, 
  UserCheck,
  MessageCircle,
  LoaderCircle,
  X,
  ChevronDown,
  Building2,
  GraduationCap,
  Link as LinkIcon,
  Github,
  Edit,
  Trash2,
  Calendar as CalendarMeetingIcon
} from 'lucide-react';
import { format } from 'date-fns';

const ManageJob = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('all');
  const { id } = useParams();
  const navigate = useNavigate();

  // Dialog states
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [coverLetterDialogOpen, setCoverLetterDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  // Selected items
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Schedule interview form
  const [scheduleDate, setScheduleDate] = useState(null);
  const [scheduleTime, setScheduleTime] = useState('');
  const [selectedInterviewer, setSelectedInterviewer] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');

  const queryClient = useQueryClient();

  // API Calls
  const { data: jobData, isError: jobError, isLoading: jobLoading } = useGetIndividualJobForAdmin(id);
  
  const { data: applicationsData, isError: applicationsError, refetch, isLoading: applicationsLoading } = useGetJobInfoByAdmin({ 
    jobID: id, 
    status: status, 
    page, 
    limit 
  });

  const { data: interviewersData, isLoading: interviewersLoading } = useGetAllInterviewers();

  // Schedule interview mutation
  const scheduleInterviewMutation = useMutation({
    mutationFn: scheduleInterview,
    onSuccess: (data) => {
      toast.success('Interview scheduled successfully!');
      setScheduleDialogOpen(false);
      setScheduleDate(null);
      setScheduleTime('');
      setSelectedInterviewer('');
      setInterviewType('');
      setInterviewNotes('');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to schedule interview');
    }
  });

  const handleScheduleInterview = () => {
    if (!scheduleDate || !scheduleTime || !selectedInterviewer || !interviewType) {
      toast.error('Please fill all required fields');
      return;
    }

    const scheduledDateTime = new Date(scheduleDate);
    const [hours, minutes] = scheduleTime.split(':');
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

    const interviewData = {
      job: id,
      candidateSelected: selectedApplication?.candidateApplied?._id,
      interviewerAssigned: selectedInterviewer,
      interviewType,
      scheduledAt: scheduledDateTime,
      notes: interviewNotes
    };

    scheduleInterviewMutation.mutate(interviewData);
  };

  const openResumeDialog = (application) => {
    setSelectedApplication(application);
    setResumeDialogOpen(true);
  };

  const openCoverLetterDialog = (application) => {
    setSelectedApplication(application);
    setCoverLetterDialogOpen(true);
  };

  const openProfileDialog = (candidate) => {
    setSelectedCandidate(candidate);
    setProfileDialogOpen(true);
  };

  const openScheduleDialog = (application) => {
    setSelectedApplication(application);
    setScheduleDialogOpen(true);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'applied': return 'default';
      case 'interview-scheduled': return 'secondary';
      case 'interview-completed': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSalary = (amount, currency, period) => {
    return `${currency} ${amount.toLocaleString()} / ${period}`;
  };

  const isLoading = jobLoading || applicationsLoading;
  const isError = jobError || applicationsError;

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] bg-gray-50 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[calc(100vh-8rem)] bg-gray-50 overflow-y-auto flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>Failed to load job data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const job = jobData?.data;
  const applications = applicationsData?.data?.applications || [];
  const totalApplications = applicationsData?.data?.totalApplications || 0;
  const totalPages = applicationsData?.data?.totalPages || 1;

  return (
    <div className="h-[calc(100vh-8rem)] bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 pb-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
                Manage Job Applications
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                View and manage applications for this position
              </p>
            </div>
          </div>
        </div>

        {/* Job Details Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{job?.title}</h2>
                    <p className="text-gray-600 capitalize text-sm sm:text-base">{job?.type}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Badge variant={job?.isOpen ? 'default' : 'destructive'} className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
                    {job?.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                  <Badge variant="outline" className="px-2 sm:px-3 py-1 capitalize text-xs sm:text-sm">
                    {job?.department}
                  </Badge>
                  <Badge variant="secondary" className="px-2 sm:px-3 py-1 capitalize text-xs sm:text-sm">
                    {job?.experienceLevel}
                  </Badge>
                </div>
                
                {/* Action Buttons */}
                <TooltipProvider>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          onClick={() => toast.info('Edit functionality coming soon')}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit job details</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                          onClick={() => toast.info('Delete functionality coming soon')}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete this job</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300 hover:text-green-600 transition-colors"
                          onClick={() => navigate(`/admin/dashboard/jobs/${id}/interviews`)}
                        >
                          <CalendarMeetingIcon className="h-4 w-4" />
                          <span className="hidden sm:inline">Interviews</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View all scheduled interviews</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-blue-900 truncate">Total Applications</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{totalApplications}</p>
              </div>
              
              <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-green-900 truncate">Salary</span>
                </div>
                <p className="text-sm sm:text-lg font-semibold text-green-600 truncate">
                  {formatSalary(job?.salaryOffered, job?.salaryCurrency, job?.salaryPeriod)}
                </p>
              </div>
              
              <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-purple-900 truncate">Department</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-purple-600 capitalize truncate">{job?.department}</p>
              </div>
              
              <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-orange-900 truncate">Posted</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-orange-600 truncate">
                  {formatDate(job?.createdAt)}
                </p>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Job Description</h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{job?.description}</p>
            </div>

            {/* Skills Required */}
            {job?.skillsRequired && job.skillsRequired.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill, index) => (
                    <Badge key={index} variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applications Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Applications</h3>
                <p className="text-gray-600 text-sm sm:text-base">Manage candidate applications</p>
              </div>

              {/* Filter Controls */}
              <div className="w-full md:w-auto">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full sm:w-[200px] bg-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
                    <SelectItem value="interview-completed">Interview Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent >
            {applications.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
                <p className="text-gray-600 text-sm sm:text-base px-4">
                  {status === 'all' 
                    ? "No applications have been submitted for this job yet." 
                    : `No applications with "${status}" status found.`
                  }
                </p>
              </div>
            ) : (
              <>
                {/* Applications - Mobile and Desktop Views */}
                <div className="space-y-4">
                  {/* Desktop Table View - Hidden on Mobile */}
                  <div className="hidden lg:block">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Candidate</TableHead>
                          <TableHead className="font-semibold">Applied Date</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Resume</TableHead>
                          <TableHead className="font-semibold">Cover Letter</TableHead>
                          <TableHead className="font-semibold text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((application) => (
                          <TableRow key={application._id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={application.candidateApplied?.profilePhoto} />
                                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                    {application.candidateApplied?.username?.charAt(0)?.toUpperCase() || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {application.candidateApplied?.fullname || application.candidateApplied?.username || 'Unknown User'}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {application.candidateApplied?.email || 'No email'}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {formatDate(application.createdAt)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={getStatusBadgeVariant(application.status)}
                                className="capitalize"
                              >
                                {application.status.replace('-', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                // onClick={() => openResumeDialog(application)}
                                // onClick={() => window.open(application.applicationResume, '_blank')}
                                onClick={() => window.open(application.applicationResume, "popupWindow", "width=1200,height=800,scrollbars=yes")}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                disabled={!application.applicationResume}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                {application.applicationResume ? 'View' : 'N/A'}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openCoverLetterDialog(application)}
                                className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                                disabled={!application.coverLetter}
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                {application.coverLetter ? 'View' : 'N/A'}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 justify-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openProfileDialog(application.candidateApplied)}
                                  className="text-green-600 hover:text-green-800 hover:bg-green-50"
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Profile
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => openScheduleDialog(application)}
                                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                  disabled={application.status === 'interview-scheduled' || application.status === 'rejected'}
                                >
                                  <CalendarIcon className="h-4 w-4 mr-1" />
                                  Schedule
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View - Visible on Mobile and Tablet */}
                  <div className="lg:hidden space-y-3 sm:space-y-4">
                    {applications.map((application) => (
                      <Card key={application._id} className="border border-gray-200 shadow-sm">
                        <CardContent className="p-3 sm:p-4">
                          {/* Candidate Info */}
                          <div className="flex items-start gap-3 mb-4">
                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                              <AvatarImage src={application.candidateApplied?.profilePhoto} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                {application.candidateApplied?.username?.charAt(0)?.toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                                {application.candidateApplied?.fullname || application.candidateApplied?.username || 'Unknown User'}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">
                                {application.candidateApplied?.email || 'No email'}
                              </p>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2">
                                <Badge 
                                  variant={getStatusBadgeVariant(application.status)}
                                  className="capitalize text-xs self-start"
                                >
                                  {application.status.replace('-', ' ')}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  Applied {formatDate(application.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2 sm:space-y-3">
                            {/* Document Actions */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openResumeDialog(application)}
                                className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 text-xs sm:text-sm"
                                disabled={!application.applicationResume}
                              >
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                Resume
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openCoverLetterDialog(application)}
                                className="flex-1 text-purple-600 border-purple-200 hover:bg-purple-50 text-xs sm:text-sm"
                                disabled={!application.coverLetter}
                              >
                                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                Cover Letter
                              </Button>
                            </div>

                            {/* Profile and Schedule Actions */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openProfileDialog(application.candidateApplied)}
                                className="flex-1 text-green-600 border-green-200 hover:bg-green-50 text-xs sm:text-sm"
                              >
                                <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                View Profile
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => openScheduleDialog(application)}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs sm:text-sm"
                                disabled={application.status === 'interview-scheduled' || application.status === 'rejected'}
                              >
                                <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                Schedule
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4 sm:mt-6 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              isActive={page === i + 1}
                              onClick={() => setPage(i + 1)}
                              className="cursor-pointer"
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

       

        {/* Cover Letter Dialog */}
        <Dialog open={coverLetterDialogOpen} onOpenChange={setCoverLetterDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cover Letter</DialogTitle>
              <DialogDescription>
                Cover letter from {selectedApplication?.candidateApplied?.username}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-96 overflow-y-auto">
              {selectedApplication?.coverLetter ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {selectedApplication.coverLetter}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No cover letter provided</p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Candidate Profile Dialog */}
        <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Candidate Profile</DialogTitle>
              <DialogDescription>
                Detailed profile information
              </DialogDescription>
            </DialogHeader>
            
            {selectedCandidate && (
              <div className="space-y-6">
                {/* Basic Info */}
                
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedCandidate?.profilePhoto} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg">
                      {selectedCandidate?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedCandidate?.fullname || selectedCandidate?.username || 'Unknown User'}
                    </h3>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{selectedCandidate?.email || 'No email provided'}</span>
                      </div>
                      {selectedCandidate?.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{selectedCandidate.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  {selectedCandidate?.address && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address
                      </Label>
                      <p className="text-gray-600 mt-1">{selectedCandidate.address}</p>
                    </div>
                  )}
                  
                  {selectedCandidate?.college && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Education
                      </Label>
                      <p className="text-gray-600 mt-1">{selectedCandidate.college}</p>
                    </div>
                  )}
                  
                  {selectedCandidate?.experience !== undefined && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Experience
                      </Label>
                      <p className="text-gray-600 mt-1">
                        {selectedCandidate.experience} {selectedCandidate.experience === 1 ? 'year' : 'years'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Skills */}
                {selectedCandidate?.skills && selectedCandidate.skills.length > 0 && (
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-3 block">Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {selectedCandidate?.bio && (
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-3 block">About</Label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">{selectedCandidate.bio}</p>
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="flex flex-wrap gap-3">
                  {selectedCandidate?.linkedInProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <a
                        href={selectedCandidate.linkedInProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  
                  {selectedCandidate?.githubProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-gray-700 border-gray-200 hover:bg-gray-50"
                    >
                      <a
                        href={selectedCandidate.githubProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Schedule Interview Dialog */}
        <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
              <DialogDescription>
                Schedule an interview for {selectedApplication?.candidateApplied?.username}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label htmlFor="interview-date">Interview Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduleDate ? format(scheduleDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduleDate}
                      onSelect={setScheduleDate}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <Label htmlFor="interview-time">Interview Time *</Label>
                <Input
                  id="interview-time"
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Interviewer Selection */}
              <div className="space-y-2">
                <Label htmlFor="interviewer">Select Interviewer *</Label>
                <Select value={selectedInterviewer} onValueChange={setSelectedInterviewer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an interviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewersLoading ? (
                      <SelectItem value="loading" disabled>Loading interviewers...</SelectItem>
                    ) : (
                      interviewersData?.data?.map((interviewer) => (
                        <SelectItem key={interviewer._id} value={interviewer._id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={interviewer.profilePhoto} />
                              <AvatarFallback className="text-xs">
                                {interviewer.fullname?.charAt(0)?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>{interviewer.fullname}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {interviewer.designation}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Interview Type */}
              <div className="space-y-2">
                <Label htmlFor="interview-type">Interview Type *</Label>
                <Select value={interviewType} onValueChange={setInterviewType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interview type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend Development</SelectItem>
                    <SelectItem value="backend">Backend Development</SelectItem>
                    <SelectItem value="fullstack">Full Stack Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="interview-notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="interview-notes"
                  placeholder="Any special instructions or notes for the interview..."
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setScheduleDialogOpen(false)}
                disabled={scheduleInterviewMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleScheduleInterview}
                disabled={scheduleInterviewMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {scheduleInterviewMutation.isPending ? (
                  <>
                    <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ManageJob;