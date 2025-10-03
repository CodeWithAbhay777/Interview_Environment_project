import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Building2, 
  Eye, 
  Loader2,
  AlertCircle,
  Users,
  CalendarCheck,
  TimerIcon
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useGetAllInterviews } from '../../hooks/queries/useGetAllInterviews';

const DashboardInterviews = () => {
  const navigate = useNavigate();
  
  // Using TanStack Query to fetch all interviews
  const { 
    data: interviewsData, 
    isLoading, 
    error, 
    refetch 
  } = useGetAllInterviews();

  const interviews = interviewsData?.data?.interviews || [];
  const totalInterviews = interviewsData?.data?.totalInterviews || 0;

  const handleViewInterview = (jobId) => {
    console.log('Job ID:', jobId); // Debug log
    navigate(`/admin/dashboard/jobs/${jobId}/interviews`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInterviewTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'frontend':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'backend':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'fullstack':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy • hh:mm a');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-500">Loading interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-3 md:p-4 lg:p-6 space-y-4 md:space-y-6 pb-8">
        {/* Header */}
        <div className="flex flex-col space-y-3 md:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">All Interviews</h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">
                Manage and track all scheduled interviews across all positions
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center space-x-2 md:space-x-3">
                <CalendarCheck className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Total Interviews</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">{totalInterviews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center space-x-2 md:space-x-3">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Active</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {interviews.filter(i => i.status === 'scheduled').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center space-x-2 md:space-x-3">
                <TimerIcon className="h-4 w-4 md:h-5 md:w-5 text-purple-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Completed</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {interviews.filter(i => i.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center space-x-2 md:space-x-3">
                <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Cancelled</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {interviews.filter(i => i.status === 'cancelled').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interviews List */}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg md:text-xl">Interviews List</CardTitle>
          <CardDescription className="text-sm">
            {totalInterviews > 0 
              ? `Total ${totalInterviews} interview${totalInterviews !== 1 ? 's' : ''} found`
              : 'No interviews found'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center px-4">
                <AlertCircle className="h-10 w-10 md:h-12 md:w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-medium text-sm md:text-base">{error.message || 'Failed to fetch interviews'}</p>
                <Button 
                  variant="outline" 
                  onClick={() => refetch()}
                  className="mt-4 text-sm"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : interviews.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center px-4">
                <Calendar className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium text-sm md:text-base">No interviews found</p>
                <p className="text-gray-400 text-xs md:text-sm mt-1">
                  Interviews will appear here once they are scheduled
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="font-semibold">Candidate</TableHead>
                      <TableHead className="font-semibold">Job Position</TableHead>
                      <TableHead className="font-semibold">Interviewer</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Scheduled Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interviews.map((interview) => (
                      <TableRow key={interview._id} className="hover:bg-gray-50/50">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {interview.candidateSelected?.username || 'Unknown Candidate'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {interview.candidateSelected?.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {interview.job?.title || 'Unknown Position'}
                            </span>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Building2 className="h-3 w-3 mr-1" />
                              {interview.job?.department || 'Unknown Department'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {interview.interviewerAssigned?.username || 'Unknown'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {interview.interviewerAssigned?.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`${getInterviewTypeColor(interview.interviewType)} capitalize`}
                          >
                            {interview.interviewType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {formatDateTime(interview.scheduledAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={`${getStatusColor(interview.status)} capitalize`}
                            >
                              {interview.status}
                            </Badge>
                            {interview.currentlyRunning && (
                              <div className="flex items-center">
                                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                                <span className="text-xs text-green-600 font-medium">Live</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewInterview(interview.job?._id)}
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
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
              <div className="lg:hidden space-y-3 p-3 md:p-4">
                {interviews.map((interview) => (
                  <Card key={interview._id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      {/* Header with Candidate and Action */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {interview.candidateSelected?.username || 'Unknown Candidate'}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {interview.candidateSelected?.email}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewInterview(interview.job?._id)}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 flex-shrink-0 ml-2"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Job Position */}
                      <div className="mb-3">
                        <div className="flex items-start space-x-2">
                          <Building2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">
                              {interview.job?.title || 'Unknown Position'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {interview.job?.department || 'Unknown Department'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Interview Details */}
                      <div className="space-y-2">
                        {/* Interviewer */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Interviewer:</span>
                          <div className="text-right min-w-0 flex-1 ml-2">
                            <p className="text-xs font-medium text-gray-900 truncate">
                              {interview.interviewerAssigned?.username || 'Unknown'}
                            </p>
                          </div>
                        </div>

                        {/* Type and Status */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Type:</span>
                          <Badge 
                            variant="outline" 
                            className={`${getInterviewTypeColor(interview.interviewType)} capitalize text-xs`}
                          >
                            {interview.interviewType}
                          </Badge>
                        </div>

                        {/* Date */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Scheduled:</span>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-700">
                              {formatDateTime(interview.scheduledAt)}
                            </span>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Status:</span>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={`${getStatusColor(interview.status)} capitalize text-xs`}
                            >
                              {interview.status}
                            </Badge>
                            {interview.currentlyRunning && (
                              <div className="flex items-center">
                                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                                <span className="text-xs text-green-600 font-medium">Live</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default DashboardInterviews;