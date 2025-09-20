import React, { useRef, useState } from 'react';

import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { BriefcaseBusiness, Eye, History, ListFilter, SquarePen, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useGetAllJobs } from '@/hooks/queries/useGetAllJobs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useSelector } from 'react-redux';


const jobList = [
  { title: "Frontend Developer", company: "TCS", location: "Bangalore, India" },
  { title: "Backend Developer", company: "Infosys", location: "Pune, India" },
  { title: "Full Stack Developer", company: "Wipro", location: "Hyderabad, India" },
  { title: "Software Developer", company: "Tech Mahindra", location: "Chennai, India" },
  { title: "Junior Frontend Developer", company: "Zoho", location: "Coimbatore, India" },
];

const Jobs = () => {

  const [department, setDepartment] = useState("");
  const [jobType, setJobType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [state, setState] = useState("");
  const [appliedJobs, setAppliedJobs] = useState(false);
  const [page, setPage] = useState(1);
  const limit = useRef(20);
  const [search, setSearch] = useState("");

  const { user, isAuthenticated } = useSelector((store) => store.auth);

  //API CALL

  const { data: jobsData, isLoading, isError, refetch } = useGetAllJobs({
    page,
    limit: limit.current,
    search,
    jobType,
    experienceLevel,
    department,
    state,
    candidateId : user?._id,
    appliedJobs
  });

  const jobs = jobsData?.data?.jobs || [];
  const totalJobs = jobsData?.data?.totalJobs || 0;
  const totalPages = jobsData?.data?.totalPages || 1;



  return (
    <>

      <section className=" w-full py-10 flex flex-col px-4 md:px-28 lg:px-32 min-h-screen">
        <div className="w-full h-20 flex items-center justify-between p-2">

          <div>
            <h1 className='font-bold text-2xl'>Job Openings</h1>
            <p className='text-gray-500 mt-2'>Explore exciting job opportunities and kickstart your career with us!</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] rounded-full px-4 py-2 flex items-center gap-2">
                <ListFilter /> Filter
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-auto w-[350px] sm:w-[450px] rounded-md">
              <DialogHeader>
                <DialogTitle>Job filters</DialogTitle>
                <DialogDescription>
                  Press apply button to apply filters
                </DialogDescription>
              </DialogHeader>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                {/* isOpen */}
                <div>
                  <Label >Job status</Label>
                  <Select onValueChange={(val) => setState(val === "all" ? "" : val)}>
                    <SelectTrigger className="w-full sm:flex-1 md:w-[180px] h-10 border my-1">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All jobs</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>

                    </SelectContent>
                  </Select>

                </div>



                {/* department */}
                <div>
                  <Label>Department</Label>
                  <Select onValueChange={(val) => setDepartment(val === "all" ? "" : val)}>
                    <SelectTrigger className="w-full sm:flex-1 md:w-[180px] h-10 border my-1">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All departments</SelectItem>
                      <SelectItem value="software engineer">Software Engineer</SelectItem>
                      <SelectItem value="backend developer">backend developer</SelectItem>
                      <SelectItem value="frontend developer">frontend developer</SelectItem>
                      <SelectItem value="fullstack developer">fullstack developer</SelectItem>
                    </SelectContent>
                  </Select>

                </div>


                {/* jobtype */}
                <div>
                  <Label>Type</Label>
                  <Select onValueChange={(val) => setJobType(val === "none" ? "" : val)}>
                    <SelectTrigger className="w-full sm:flex-1 md:w-[180px] h-10 border my-1">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="job">Job</SelectItem>
                      <SelectItem value="internship">internship</SelectItem>

                    </SelectContent>
                  </Select>

                </div>


                {/* experience level */}
                <div>
                  <Label>Experience Level</Label>
                  <Select onValueChange={(val) => setExperienceLevel(val === "none" ? "" : val)}>
                    <SelectTrigger className="w-full sm:flex-1 md:w-[180px] h-10 border my-1">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="fresher">fresher</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Mid</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>

                </div>
                
              </div>
              {/* applied jobs */}
                <div className='w-full justify-between items-center flex  mt-1 p-2'>
                  <Label>Jobs already applied</Label>
                  <Switch 
                    
                    checked={appliedJobs}
                    onCheckedChange={(val) => setAppliedJobs(val)}
                  />
                </div>

            </DialogContent>
          </Dialog>


        </div>
        <div className="flex-1 overflow-y-auto">

          <div id='all-jobs-list' className=' mt-6 w-full rounded '>

            {isLoading && (
              <>
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full mt-2 bg-gray-200 opacity-70" />
                ))}
              </>
            )}

            {isError && <p className="text-red-500">Error fetching jobs</p>}
            {!isLoading && jobs.length === 0 && <p className="">No jobs found</p>}

            <div className="mt-2 space-y-2">
              {jobs.map((job) => (
                <>
                  <div key={job._id} className="h-40 border p-4 rounded-md hover:shadow-md transition-shadow duration-300 flex justify-between">
                    <div id="left" className="w-[94%] h-full ">
                      <div className="w-full flex items-center gap-1 sm:gap-4">
                        <span className="flex items-center gap-2">
                          <BriefcaseBusiness className="text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
                          <h3 className="font-bold text-lg md:text-xl truncate">{job.title}</h3>
                        </span>
                        <span className='flex gap-2'>
                          <Badge variant="default" className="bg-[#6A38C2] hover:bg-[#5b30a6] truncate">{job.experienceLevel}</Badge>
                          <Badge variant="default" className="bg-[#6A38C2] hover:bg-[#5b30a6] truncate">{job.type}</Badge>
                        </span>

                      </div>
                      <div className="mt-2">
                        <p className="text-gray-500 font-semibold truncate">{job.department} | Salary: {job.salaryCurrency} {job.salaryOffered} {job.salaryPeriod}</p>
                        <span className='flex gap-2 my-2'><History className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6" /><p className="text-gray-500 font-semibold truncate">{job.createdAtRelative}</p></span>
                      </div>
                      <div className="mt-3 flex items-center">
                        <Badge className={job.isOpen ? "bg-green-200 text-green-800 hover:bg-green-100" : "bg-red-200 text-red-800 hover:bg-red-100"}>
                          {job.isOpen ? "Open" : "Closed"}
                        </Badge>
                        <span className="ml-4 text-gray-600 font-semibold flex gap-2 truncate"><Users className="w-5 h-6 text-gray-400 " /> Applicants: {job.applicantsCount}</span>
                      </div>
                    </div>

                    { user?.role === "candidate" && isAuthenticated && (<div id="right" className=" flex-1 flex justify-center items-center">
                      <Link to={`/jobs/${job._id}`} ><Eye className="text-[#5b30a6] hover:text-[#b18af0] h-8 w-8" /></Link>
                    </div>)

                    }
                    
                  </div>

                </>


              ))}


            </div>


          </div>

        </div>


        {/* pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

      </section>

    </>
  );
};

export default Jobs;