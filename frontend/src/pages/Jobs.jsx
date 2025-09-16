import React, { useState } from 'react';

import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { ListFilter } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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



  return (
    <>

      <section className=" w-full py-10 px-6 md:px-16 lg:px-20 min-h-screen">
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
                      <SelectItem value="close">Closed</SelectItem>

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
                  <Select onValueChange={(val) => setJobType(val === "none" ? "" : val)}>
                    <SelectTrigger className="w-full sm:flex-1 md:w-[180px] h-10 border">
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

                  <Select onValueChange={(val) => setExperienceLevel(val === "none" ? "" : val)}>
                    <SelectTrigger className="w-full sm:flex-1 md:w-[180px] h-10 border">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="Fresher">fresher</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Mid</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>

                </div>

                <Button className='bg-[#6A38C2] hover:bg-[#5b30a6] col-span-2 w-full mt-2'>Apply filters</Button>




              </div>
            </DialogContent>
          </Dialog>


        </div>

        <div>

        </div>
      </section>

    </>
  );
};

export default Jobs;