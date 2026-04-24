import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Building2,
  Eye,
  Loader2,
  AlertCircle,
  Users,
  CalendarCheck,
  TimerIcon,
  CalendarDays,
  Table2,
} from 'lucide-react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format as formatDateFns, parse, startOfWeek, getDay, isValid } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useGetAllInterviews } from '../../hooks/queries/useGetAllInterviews';
import { formatUtcToIstDateTime } from '@/utils/dateTime';
import { useIsMobile } from '@/hooks/use-mobile';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format: formatDateFns,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarToolbar = ({ label, onNavigate, onView, view, views = [] }) => {
  const viewButtons = Array.isArray(views) && views.length > 0
    ? views.filter(Boolean).map((item) => {
        if (typeof item === 'string') {
          return {
            key: item,
            label: item.charAt(0).toUpperCase() + item.slice(1),
          };
        }

        return {
          key: item?.key || item?.view || 'month',
          label: item?.title || item?.label || item?.key || item?.view || 'Month',
        };
      })
    : [{ key: 'month', label: 'Month' }];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center justify-between gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => onNavigate('PREV')} className="h-9 px-3">
          Prev
        </Button>
        <div className="min-w-0 px-2 text-center text-sm font-semibold text-gray-800 sm:text-base">
          {label}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => onNavigate('NEXT')} className="h-9 px-3">
          Next
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => onNavigate('TODAY')} className="h-9 px-3">
          Today
        </Button>

        <div className="flex flex-1 flex-wrap gap-2 lg:flex-none">
          {viewButtons.map((item) => (
            <Button
              key={item.key}
              type="button"
              size="sm"
              variant={view === item.key ? 'default' : 'outline'}
              onClick={() => onView(item.key)}
              className="h-9 flex-1 px-3 sm:flex-none"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

const DashboardInterviews = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState('table');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDayDialogOpen, setIsDayDialogOpen] = useState(false);
  
  // Using TanStack Query to fetch all interviews
  const {
    data: interviewsData,
    isLoading,
    error,
    refetch,
  } = useGetAllInterviews();

  const interviews = interviewsData?.data?.interviews || [];
  const totalInterviews = interviewsData?.data?.totalInterviews || 0;

  const handleViewInterview = (jobId) => {
    if (!jobId) return;
    navigate(`/admin/dashboard/jobs/${jobId}/interviews`);
  };

  const sameCalendarDay = (firstDate, secondDate) => {
    return (
      firstDate.getFullYear() === secondDate.getFullYear()
      && firstDate.getMonth() === secondDate.getMonth()
      && firstDate.getDate() === secondDate.getDate()
    );
  };

  const getCalendarEventEnd = (start) => {
    const oneHourLater = new Date(start.getTime() + 60 * 60 * 1000);
    const endOfDay = new Date(start);
    endOfDay.setHours(23, 59, 59, 999);

    if (oneHourLater > endOfDay) {
      return endOfDay;
    }

    return oneHourLater;
  };

  const calendarEvents = useMemo(() => {
    return interviews
      .map((interview) => {
        const start = new Date(interview.scheduledAt);

        if (!isValid(start)) return null;

        const end = getCalendarEventEnd(start);
        const candidateName = interview.candidateSelected?.username || 'Unknown Candidate';
        const jobTitle = interview.job?.title || 'Unknown Position';

        return {
          id: interview._id,
          title: `${candidateName} • ${jobTitle}`,
          start,
          end,
          interview,
        };
      })
      .filter(Boolean);
  }, [interviews]);

  const selectedDayInterviews = useMemo(() => {
    if (!selectedDate) return [];

    return interviews.filter((interview) => {
      const interviewDate = new Date(interview.scheduledAt);
      return isValid(interviewDate) && sameCalendarDay(interviewDate, selectedDate);
    });
  }, [interviews, selectedDate]);

  const handleSelectDay = (date) => {
    if (!isValid(date)) return;
    setSelectedDate(date);
    setIsDayDialogOpen(true);
  };

  const eventPropGetter = (event) => {
    const status = event?.interview?.status?.toLowerCase();

    if (status === 'completed') {
      return {
        style: {
          backgroundColor: '#dcfce7',
          borderColor: '#86efac',
          color: '#166534',
        },
      };
    }

    if (status === 'cancelled') {
      return {
        style: {
          backgroundColor: '#fee2e2',
          borderColor: '#fca5a5',
          color: '#991b1b',
        },
      };
    }

    return {
      style: {
        backgroundColor: '#dbeafe',
        borderColor: '#93c5fd',
        color: '#1e3a8a',
      },
    };
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
      return formatUtcToIstDateTime(dateString, 'Invalid Date');
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
    <div className="h-[calc(100vh-8rem)] bg-gray-50 overflow-x-hidden overflow-y-auto">
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
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
        <CardHeader className="flex flex-col gap-3 pb-3 md:pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg md:text-xl">Interviews List</CardTitle>
            <CardDescription className="text-sm">
              {totalInterviews > 0
              ? `Total ${totalInterviews} interview${totalInterviews !== 1 ? 's' : ''} found`
              : 'No interviews found'
              }
            </CardDescription>
          </div>

          <div className="flex w-full flex-col gap-2 rounded-lg border border-gray-200 bg-white p-1 sm:w-auto sm:flex-row">
            <Button
              type="button"
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-9 w-full gap-1.5 px-3 sm:w-auto"
            >
              <Table2 className="h-4 w-4" />
              Table
            </Button>
            <Button
              type="button"
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className="h-9 w-full gap-1.5 px-3 sm:w-auto"
            >
              <CalendarDays className="h-4 w-4" />
              Calendar
            </Button>
          </div>
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
          ) : viewMode === 'table' ? (
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
          ) : (
            <div className="p-3 md:p-4">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-2 max-w-full">
                <BigCalendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  views={isMobile ? ['day'] : ['month']}
                  view={isMobile ? 'day' : 'month'}
                  popup
                  selectable
                  style={{ height: isMobile ? 580 : 640, minHeight: isMobile ? 580 : 640, width: '100%' }}
                  className="w-full"
                  onSelectSlot={(slotInfo) => handleSelectDay(slotInfo.start)}
                  onSelectEvent={(event) => handleSelectDay(event.start)}
                  eventPropGetter={eventPropGetter}
                  components={{ toolbar: CalendarToolbar }}
                />
              </div>

              <p className="px-1 pt-3 text-xs text-gray-500">
                Click a date box to view all interviews scheduled on that day.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>

      <Dialog open={isDayDialogOpen} onOpenChange={setIsDayDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDate
                ? `Interviews on ${formatDateFns(selectedDate, 'PPP')}`
                : 'Interviews'}
            </DialogTitle>
            <DialogDescription>
              {selectedDayInterviews.length > 0
                ? `${selectedDayInterviews.length} interview${selectedDayInterviews.length !== 1 ? 's' : ''} scheduled for this day.`
                : 'No interviews scheduled for this day.'}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            {selectedDayInterviews.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                No interviews found for the selected day.
              </div>
            ) : (
              selectedDayInterviews.map((interview) => (
                <div
                  key={interview._id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">
                        {interview.candidateSelected?.username || 'Unknown Candidate'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {interview.candidateSelected?.email || 'No email available'}
                      </p>
                      <p className="text-sm text-gray-700">
                        {interview.job?.title || 'Unknown Position'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Interviewer: {interview.interviewerAssigned?.username || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(interview.scheduledAt)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(interview.status)} capitalize`}
                      >
                        {interview.status}
                      </Badge>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleViewInterview(interview.job?._id)}
                        disabled={!interview.job?._id}
                      >
                        <Eye className="mr-1.5 h-4 w-4" />
                        View Interview
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardInterviews;