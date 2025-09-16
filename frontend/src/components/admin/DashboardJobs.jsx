import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { BriefcaseBusiness, Plus, SquarePen, Users  } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { useGetAdminJobs } from "@/hooks/queries/useGetAdminJobs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

const DashboardJobs = () => {
  const [state, setState] = useState([
    {
      type: "All",
      isActive: true,
    },
    {
      type: "Open",
      isActive: false,
    },
    {
      type: "Closed",
      isActive: false,
    },
  ]);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const limit = useRef(10);

  const filterChange = (filter) => {
    if (!filter) return;
    setState((prev) =>
      prev.map((f) => ({
        ...f,
        isActive: f.type === filter.type,
      }))
    );
  };

  // API call
  const { data: jobsData, isLoading, isError, refetch } = useGetAdminJobs({
    page,
    limit: limit.current,
    search,
    department,
    state: state.find((s) => s.isActive)?.type.toLowerCase() || "all",
  });

  const jobs = jobsData?.data?.jobs || [];
  const totalJobs = jobsData?.data?.totalJobs || 0;
  const totalPages = jobsData?.data?.totalPages || 1;


  return (
    <div className="w-full p-2">
      <div className="w-full rounded flex flex-col justify-between items-center sm:px-1 flex-wrap md:flex-row">
        <div className="flex flex-col w-full items-center gap-2 flex-wrap m-1 sm:m-2 sm:flex-row md:w-fit sm:justify-between">

          <div className=" py-1 flex items-center border my-1  rounded pr-1 w-full sm:w-fit">
            {state.map((filter, i) => (
              <Button
                key={i}
                onClick={() => filterChange(filter)}
                className={`${filter.isActive
                  ? "bg-[#5b30a6] text-white hover:bg-[#b18af0]"
                  : "bg-white text-black hover:bg-gray-200 "
                  } w-[33%] ml-1 border `}
              >
                {filter.type}
              </Button>
            ))}
          </div>

          {/* filter department */}

          <Select onValueChange={(val) => setDepartment(val === "all" ? "" : val)}>
            <SelectTrigger className="w-full sm:flex-1 md:w-[180px] h-12 border">
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


        <Link to={"/admin/dashboard/jobs/create"}>
          <Button className="bg-[#5b30a6] text-white hover:bg-[#b18af0] my-2">
            <Plus />
            Create job
          </Button>
        </Link>
      </div>
      <div id="all-jobs-block" className="border-t mt-4 w-full rounded  p-2 flex flex-col h-[calc(100vh-200px)] justify-center items-center ">
        <Input placeholder="Filter by title" className="w-full" value={search} onChange={(e) => setSearch(e.target.value)} />

        <div className="w-full flex flex-col flex-1 mt-3 overflow-y-auto">



          {/* all jobs data */}
          <div className="flex-1 overflow-y-auto">



            <div id="all-jobs-block" className=" mt-6 w-full rounded ">
              {isLoading && (
                <>
                  <Skeleton className="h-32 w-full mt-2 bg-gray-200 opacity:70" />
                  <Skeleton className="h-32 w-full mt-2 bg-gray-200 opacity:70" />
                  <Skeleton className="h-32 w-full mt-2 bg-gray-200 opacity:70" />
                  <Skeleton className="h-32 w-full mt-2 bg-gray-200 opacity:70" />
                  <Skeleton className="h-32 w-full mt-2 bg-gray-200 opacity:70" />
                  <Skeleton className="h-32 w-full mt-2 bg-gray-200 opacity:70" />
                </>

              )}
              {isError && <p className="text-red-500">Error fetching jobs</p>}
              {!isLoading && jobs.length === 0 && <p className="">No jobs found</p>}

              <div className="mt-2 space-y-2">
                {jobs.map((job) => (

                  <div className="border w-full h-32 rounded p-2 md:p-3 shadow-md flex" key={job._id}>

                    <div id="left" className="w-[92%] h-full ">
                      <div className="w-full flex items-center gap-2 sm:gap-4">
                        <span className="flex items-center gap-2">
                          <BriefcaseBusiness className="text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
                          <h3 className="font-bold text-lg md:text-xl truncate">{job.title}</h3>
                        </span>

                        <Badge variant="default" className="bg-[#6A38C2] hover:bg-[#5b30a6] truncate">{job.experienceLevel}</Badge>
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-500 font-semibold truncate">{job.department} |  Salary: {job.salaryCurrency} {job.salaryOffered}</p>
                      </div>
                      <div className="mt-3 flex items-center">
                        <Badge className={job.isOpen ? "bg-green-200 text-green-800 hover:bg-green-100" : "bg-red-200 text-red-800 hover:bg-red-100"}>
                          {job.isOpen ? "Open" : "Closed"}
                        </Badge>
                        <span className="ml-4 text-gray-600 font-semibold flex gap-2 truncate"><Users className="w-5 h-6 text-gray-400 " /> Applicants: {job.applicantsCount}</span>
                      </div>




                    </div>
                    <div id="right" className=" flex-1 h-full flex justify-center items-center">
                      <Link to={`/admin/dashboard/jobs/${job._id}`} ><SquarePen className="text-[#5b30a6] hover:text-[#b18af0] "/></Link>
                    </div>
                  </div>


                ))}
              </div>


            </div>

          </div>


          {/* pagination */}
          {totalPages > 1 && (
            <Pagination className="">
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


        </div>


      </div>
    </div>
  );
};

export default DashboardJobs;
