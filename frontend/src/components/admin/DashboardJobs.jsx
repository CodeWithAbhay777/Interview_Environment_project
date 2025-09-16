import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { useGetAdminJobs } from "@/hooks/queries/useGetAdminJobs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

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
  const limit = useRef(20);

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
            
          

            <div id="all-jobs-block" className=" mt-2 w-full rounded p-2 ">
            {isLoading && <p>Loading...</p>}
            {isError && <p className="text-red-500">Error fetching jobs</p>}
            {!isLoading && jobs.length === 0 && <p>No jobs found</p>}

            <div className="mt-6 space-y-3">
              {jobs.map((job) => (
                <div key={job._id} className="border rounded p-3 shadow-sm">
                  <h3 className="font-semibold">{job.title}</h3>
                  <p>{job.department} | {job.experienceLevel}</p>
                  <p>Salary: {job.salaryOffered}</p>
                  <span className={job.isOpen ? "text-green-600" : "text-red-600"}>
                    {job.isOpen ? "Open" : "Closed"}
                  </span>
                  <p>Applicants: {job.applicantsCount}</p>
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
