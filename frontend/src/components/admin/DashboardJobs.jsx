import React, { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardJobs = () => {
  const [filterSearch, setFilterSearch] = useState([
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

  const filterChange = (filter) => {
    if (!filter) return;
    setFilterSearch((prev) =>
      prev.map((f) => ({
        ...f,
        isActive: f.type === filter.type,
      }))
    );
  };
  return (
    <div className="w-full overflow-y-auto p-2">
      <div className="w-full  rounded flex justify-between items-center sm:px-1 flex-wrap">
        <div className=" py-1 flex items-center border my-1  rounded pr-1">
          {filterSearch.map((filter, i) => (
            <Button
              key={i}
              onClick={() => filterChange(filter)}
              className={`${
                filter.isActive
                  ? "bg-[#5b30a6] text-white hover:bg-[#b18af0]"
                  : "bg-white text-black hover:bg-gray-200 "
              } w-16 ml-1 border `}
            >
              {filter.type}
            </Button>
          ))}
        </div>
        <Link to={"/admin/dashboard/jobs/create"}>
          <Button className="bg-[#5b30a6] text-white hover:bg-[#b18af0]">
            <Plus />
            Create job
          </Button>
        </Link>
      </div>
      <div className="border mt-4">

      </div>
    </div>
  );
};

export default DashboardJobs;
