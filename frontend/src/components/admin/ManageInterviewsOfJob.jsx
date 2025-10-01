import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetInterviewsByJob } from '@/hooks/queries/useGetInterviewsByJob';
import { useGetIndividualJobForAdmin } from '@/hooks/queries/useGetIndividualJobForAdmin';
import { format } from 'date-fns';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

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
  XCircle
} from 'lucide-react';

const ManageInterviewsOfJob = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('all');
  const [interviewType, setInterviewType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  
  const { id } = useParams();
  const navigate = useNavigate();

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

  const job = jobData?.data;
  const interviews = interviewsData?.data?.interviews || [];
  const totalInterviews = interviewsData?.data?.totalInterviews || 0;
  const totalPages = interviewsData?.data?.totalPages || 1;

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
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), 'hh:mm a');
    } catch {
      return 'Invalid time';
    }
  };

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM dd, yyyy \'at\' hh:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  const openInterviewDialog = (interview) => {
    setSelectedInterview(interview);
    setDialogOpen(true);
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
                    <SelectItem value="50">50 per page</SelectItem>
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
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Candidate</TableHead>
                      <TableHead className="w-[150px]">Interviewer</TableHead>
                      <TableHead className="w-[120px]">Type</TableHead>
                      <TableHead className="w-[150px]">Scheduled Date</TableHead>
                      <TableHead className="w-[100px]">Time</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInterviews.map((interview) => (
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
                              <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                {interview.candidate?.email || 'No email'}
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => openInterviewDialog(interview)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredInterviews.map((interview) => (
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
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => openInterviewDialog(interview)}
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                      className="flex-1"
                      onClick={() => {
                        // Add edit functionality
                        console.log('Edit interview:', selectedInterview._id);
                      }}
                    >
                      Edit Interview
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        // Add reschedule functionality
                        console.log('Reschedule interview:', selectedInterview._id);
                      }}
                    >
                      Reschedule
                    </Button>
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
      </div>
    </div>
  );
};

export default ManageInterviewsOfJob;