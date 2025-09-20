import React, { useState } from 'react'
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button'
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useGetIndividualJob } from '@/hooks/queries/useGetIndividualJob';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, BriefcaseIcon, DollarSignIcon, ClockIcon, UsersIcon, BuildingIcon, GlobeIcon, TagIcon, Eye, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { useGetProfileQuery } from '@/hooks/queries/useGetProfileQuery';
import { useToastOnError } from '@/hooks/useToastOnError';
import { Switch } from '@/components/ui/switch';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApplication } from '@/api/applications/submitApplication';

const JobDescription = () => {
    const { user, isAuthenticated } = useSelector(store => store.auth);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [uploadNewResume, setUploadNewResume] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    
    const queryClient = useQueryClient();

    const params = useParams();
    const jobId = params.id;

    

    // API CALL
    const { data: jobData, isLoading, refetch, isError } = useGetIndividualJob(jobId);

    const { data: userProfile, isError: profileError } = useGetProfileQuery(user?._id, user?.role, {
        enabled: isAuthenticated && user?.isProfileComplete,
    });

    
    
    const submitApplicationMutation = useMutation({
        mutationKey: ["applicationData"],
        mutationFn: postApplication,
        onSuccess: (data) => {
            toast.success("Application submitted successfully");
            
            // Refetch the current job data to update isAlreadyApplied status
            refetch();
            
            // Invalidate the jobs list cache to ensure real-time updates
            queryClient.invalidateQueries({ queryKey: ['Jobs'] });
            
            // Reset form state
            setCoverLetter("");
            setResumeFile(null);
            setUploadNewResume(false);
            setDialogOpen(false);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Error submitting application");
        },
    });

    useToastOnError(profileError, 'Fetching profile : Something went wrong!');


    const job = jobData?.data?.job || {};
    const isAlreadyApplied = jobData?.data?.isAlreadyApplied || false;

    // Format the salary with currency
    const formatSalary = () => {
        const currency = {
            'INR': '₹',
            'USD': '$',
            'EUR': '€',
            'GBP': '£'
        }[job.salaryCurrency] || '';

        const period = {
            'yearly': '/year',
            'monthly': '/month',
            'hourly': '/hour'
        }[job.salaryPeriod] || '';

        return `${currency}${job.salaryOffered}${period}`;
    };

    // Format the posted date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'MMMM dd, yyyy');
        } catch (e) {
            return 'Invalid date';
        }
    };



    const submitApplication = async () => {
        // Form validation
        if (!coverLetter.trim()) {
            toast.error("Please provide a cover letter to apply");
            return;
        }

        if (!uploadNewResume && !resumeFile && !userProfile?.resume) {
            toast.error("Please upload a resume to apply");
            return;
        }

        if (uploadNewResume && !resumeFile) {
            toast.error("Please upload a resume file");
            return;
        }

        // Create form data for file upload
        const formData = new FormData();
        formData.append("jobId", jobId);
        formData.append("coverLetter", coverLetter);

        // Handle resume logic based on user choice
        if (uploadNewResume && resumeFile) {
            
            formData.append("resume", resumeFile);
            formData.append("useExistingResume", "false");
        } else if (userProfile?.resume) {
            // If user has an existing resume and chose not to upload a new one
            formData.append("resumeUrl", userProfile.resume);
            formData.append("useExistingResume", "true");
        } else {
            // No resume available
            toast.error("Please upload a resume to apply");
            return;
        }
        
        
        submitApplicationMutation.mutate(formData);
    };

    if (isError) {
        return (
            <div className="max-w-7xl mx-auto my-10 px-4">
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Error fetching job details. Please try again later.</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => refetch()} className="bg-[#7209b7] hover:bg-[#5f32ad]">Retry</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto my-10 px-4">
                <div className="flex flex-col space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                    <Skeleton className="h-64 w-full mt-6" />
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto my-10 px-4'>
            <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
                    <div className='flex flex-col md:flex-row md:items-center justify-between w-full'>
                        <div>
                            <CardTitle className="text-3xl font-bold text-gray-800">{job.title}</CardTitle>
                            <CardDescription className="text-gray-600 mt-2">
                                {job.department && (
                                    <span className="inline-flex items-center">
                                        <BriefcaseIcon className="w-4 h-4 mr-1" />
                                        {job.department.charAt(0).toUpperCase() + job.department.slice(1)}
                                    </span>
                                )}
                            </CardDescription>

                            <div className='flex flex-wrap items-center gap-2 mt-4'>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    {job.type === 'job' ? 'Full-time' : 'Internship'}
                                </Badge>
                                {job.experienceLevel && (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)} Level
                                    </Badge>
                                )}
                                {job.openings && (
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                        {job.openings} {job.openings > 1 ? 'Openings' : 'Opening'}
                                    </Badge>
                                )}
                                {job.isOpen ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                        Closed
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    disabled={isAlreadyApplied || !job.isOpen}
                                    className={`mt-4 md:mt-0 rounded-lg px-6 py-5 ${isAlreadyApplied || !job.isOpen ? 'bg-gray-400' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}
                                >
                                    {isAlreadyApplied
                                        ? 'Already Applied'
                                        : !job.isOpen
                                            ? 'Closed'
                                            : 'Apply Now'}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] mx-auto">
                                <DialogHeader>
                                    <DialogTitle className="text-xl">Apply for {job.title}</DialogTitle>
                                    <DialogDescription>
                                        Submit your application for this position at {job.department}.
                                    </DialogDescription>
                                </DialogHeader>

                                <form
                                    id="applicationForm"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        submitApplication();
                                    }}
                                    className="grid gap-4 py-4"
                                >
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label htmlFor="name" className="text-right">Name</label>
                                        <input
                                            id="name"
                                            className="col-span-3 flex h-10 rounded-md border border-input bg-background px-3 py-2"
                                            placeholder={user?.name || "Your full name"}
                                            value={userProfile?.fullname || user?.name || ""}
                                            disabled={!!(userProfile?.fullname || user?.name)}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label htmlFor="email" className="text-right">Email</label>
                                        <input
                                            id="email"
                                            className="col-span-3 flex h-10 rounded-md border border-input bg-background px-3 py-2"
                                            placeholder={user?.email || "Your email address"}
                                            defaultValue={user?.email || ""}
                                            disabled={!!user?.email}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label htmlFor="resumeSwitch" className="text-right">Resume</label>
                                        <div className="col-span-3 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                            <div className="flex-1 flex items-center gap-2">
                                                {userProfile?.resume && (
                                                    <a
                                                        href={userProfile?.resume}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#7209b7] hover:bg-[#5f32ad] text-white rounded-md transition-colors text-sm"
                                                        aria-label="Preview Resume"
                                                    >
                                                        <Eye size={16} /> Preview Resume
                                                    </a>
                                                )}
                                                {!userProfile?.resume && (
                                                    <span className="text-sm text-gray-500">No resume uploaded yet</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label htmlFor="uploadSwitch" className="text-sm font-medium leading-none cursor-pointer">
                                                    Upload new resume
                                                </label>
                                                <Switch
                                                    id="uploadSwitch"
                                                    checked={uploadNewResume}
                                                    onCheckedChange={setUploadNewResume}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {uploadNewResume && (
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <div className="col-span-1"></div>
                                            <div className="col-span-3">
                                                <input
                                                    id="resume"
                                                    type="file"
                                                    accept=".pdf"
                                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                                                    required={uploadNewResume}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setResumeFile(file);
                                                        }
                                                    }}
                                                />
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Accepted formats: PDF only
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label htmlFor="coverLetter" className="text-right">Cover Letter</label>
                                        <textarea
                                            id="coverLetter"
                                            className="col-span-3 flex min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                                            placeholder="Tell us why you're interested in this position..."
                                            value={coverLetter}
                                            onChange={(e) => setCoverLetter(e.target.value)}
                                            required
                                        />
                                    </div>
                                </form>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setDialogOpen(false)}
                                        className="mr-2"
                                        disabled={submitApplicationMutation.isPending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        form="applicationForm"
                                        className="bg-[#7209b7] hover:bg-[#5f32ad] flex items-center justify-center"
                                        disabled={submitApplicationMutation.isPending}
                                    >
                                        {submitApplicationMutation.isPending ? (
                                            <>
                                                <Circle className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Application"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <div>
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <TagIcon className="w-5 h-5 mr-2 text-[#7209b7]" />
                                    Job Details
                                </h2>
                                <Separator className="mb-4" />

                                {job.description && (
                                    <div className="mb-8 prose max-w-none">
                                        <h3 className="text-lg font-medium mb-2">Description</h3>
                                        <p className="whitespace-pre-line text-gray-700">{job.description}</p>
                                    </div>
                                )}

                                {job.skillsRequired && job.skillsRequired.length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="text-lg font-medium mb-2">Required Skills</h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {job.skillsRequired.map((skill, index) => (
                                                <Badge key={index} variant="secondary" className="text-sm">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg h-fit">
                            <h3 className="text-lg font-semibold mb-4">Job Overview</h3>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <DollarSignIcon className="w-5 h-5 mt-0.5 text-gray-500 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-500">Salary</p>
                                        <p className="font-medium">{formatSalary()}</p>
                                    </div>
                                </div>

                                {job.experienceLevel && (
                                    <div className="flex items-start">
                                        <BriefcaseIcon className="w-5 h-5 mt-0.5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Experience Level</p>
                                            <p className="font-medium">{job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)}</p>
                                        </div>
                                    </div>
                                )}

                                {job.department && (
                                    <div className="flex items-start">
                                        <BuildingIcon className="w-5 h-5 mt-0.5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Department</p>
                                            <p className="font-medium">{job.department.charAt(0).toUpperCase() + job.department.slice(1)}</p>
                                        </div>
                                    </div>
                                )}

                                {job.createdAt && (
                                    <div className="flex items-start">
                                        <CalendarIcon className="w-5 h-5 mt-0.5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Posted Date</p>
                                            <p className="font-medium">{formatDate(job.createdAt)}</p>
                                        </div>
                                    </div>
                                )}

                                {job.applicationDeadline && (
                                    <div className="flex items-start">
                                        <ClockIcon className="w-5 h-5 mt-0.5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Application Deadline</p>
                                            <p className="font-medium">{formatDate(job.applicationDeadline)}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start">
                                    <UsersIcon className="w-5 h-5 mt-0.5 text-gray-500 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-500">Vacancy</p>
                                        <p className="font-medium">{job.openings || 1} {job.openings > 1 ? 'positions' : 'position'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="bg-gray-50 border-t">
                    <p className="text-sm text-gray-500 mt-2">
                        To apply for this job, click the "Apply Now" button at the top of this page.
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default JobDescription