import React, { useState } from 'react';
import { format, parseISO, isAfter, isBefore, addHours } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Building2, 
  Video,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Users,
  MapPin
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useGetCandidateInterviews } from '../hooks/queries/useGetCandidateInterviews';

const CandidateUpcomingInterviews = () => {
  const [statusFilter, setStatusFilter] = useState('all');

  // Using TanStack Query to fetch candidate interviews
  const { 
    data: interviewsData, 
    isLoading, 
    error, 
    refetch 
  } = useGetCandidateInterviews({ status: statusFilter });

  const interviews = interviewsData?.data || [];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
    }
  };

  const getInterviewTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'frontend':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'backend':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'fullstack':
        return 'bg-purple-200 text-purple-900 border-purple-400';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy • hh:mm a');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const isInterviewLive = (scheduledAt) => {
    try {
      const interviewTime = parseISO(scheduledAt);
      const now = new Date();
      const endTime = addHours(interviewTime, 2); // Assuming 2-hour interview duration
      
      return isAfter(now, interviewTime) && isBefore(now, endTime);
    } catch {
      return false;
    }
  };

  const canJoinInterview = (status, scheduledAt) => {
    return status?.toLowerCase() === 'scheduled' && (isInterviewLive(scheduledAt) || isAfter(new Date(), parseISO(scheduledAt)));
  };

  const getStats = () => {
    const scheduled = interviews.filter(i => i.status === 'scheduled').length;
    const completed = interviews.filter(i => i.status === 'completed').length;
    const cancelled = interviews.filter(i => i.status === 'cancelled').length;
    
    return { scheduled, completed, cancelled, total: interviews.length };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#6A38C2]" />
          <p className="text-gray-600">Loading your interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Interviews</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Track and manage your upcoming and past interviews
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-[#6A38C2]">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-[#6A38C2] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-[#5b30a6]">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-[#5b30a6] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-600">Scheduled</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-600">Cancelled</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-[#6A38C2]" />
                  <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
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
            </CardContent>
          </Card>
        </div>

        {/* Interviews Grid */}
        {error ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load interviews</h3>
                <p className="text-gray-600 mb-4">{error.message || 'Something went wrong'}</p>
                <Button onClick={() => refetch()} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : interviews.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No interviews found</h3>
                <p className="text-gray-600">
                  {statusFilter === 'all' 
                    ? "You don't have any interviews scheduled yet."
                    : `No ${statusFilter} interviews found.`
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {interviews.map((interview) => (
              <Card key={interview._id} className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
                <CardContent className="p-0">
                  {/* Header with Status */}
                  <div className="p-4 pb-3 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(interview.status)}
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(interview.status)} font-medium`}
                        >
                          {interview.status}
                        </Badge>
                        {isInterviewLive(interview.scheduledAt) && (
                          <Badge className="bg-[#6A38C2] text-white animate-pulse">
                            LIVE
                          </Badge>
                        )}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getInterviewTypeColor(interview.interviewType)} capitalize text-xs`}
                      >
                        {interview.interviewType}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-4">
                    {/* Job Information */}
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <Building2 className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                            {interview.job?.title || 'Position Not Available'}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {interview.job?.department || 'Department Not Specified'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Interview Details */}
                    <div className="space-y-3">
                      {/* Date and Time */}
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700">
                          {formatDateTime(interview.scheduledAt)}
                        </span>
                      </div>

                      {/* Interview Type Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Interview Type:</span>
                        <Badge 
                          variant="outline" 
                          className={`${getInterviewTypeColor(interview.interviewType)} capitalize text-xs`}
                        >
                          {interview.interviewType}
                        </Badge>
                      </div>
                    </div>

                    {/* Join Button */}
                    <div className="pt-3 border-t border-gray-100">
                      <Button 
                        className={`w-full ${
                          interview.status === 'scheduled' 
                            ? 'bg-[#6A38C2] hover:bg-[#5b30a6] text-white'
                            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={interview.status !== 'scheduled'}
                        onClick={() => {
                          if (interview.status === 'scheduled') {
                            // Future: Handle join interview
                            console.log('Joining interview:', interview._id);
                          }
                        }}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        {interview.status === 'scheduled' ? (
                          isInterviewLive(interview.scheduledAt) ? 'Join Now' : 'Join Interview'
                        ) : interview.status === 'completed' ? 'Interview Completed' : 'Interview Cancelled'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateUpcomingInterviews;