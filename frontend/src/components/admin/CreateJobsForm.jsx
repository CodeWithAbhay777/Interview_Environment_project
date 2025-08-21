import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  JOB_DEPARTMENTS,
  JOB_EXPERIENCE_LEVELS,
  JOB_SALARY_CURRENCIES,
  JOB_SALARY_PERIODS,
  JOB_TYPES,
} from "@/utils/constant";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { BriefcaseBusiness, ChevronDownIcon, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { toast } from "sonner";

const CreateJobsForm = () => {
  const [skillInput, setSkillInput] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [jobData, setJobData] = useState({
    title: "",
    type: "",
    salaryOffered: "",
    salaryPeriod: "",
    salaryCurrency: "",
    description: "",
    department: "",
    skillsRequired: [],
    experienceLevel: "",
    openings: 1,
    applicationDeadline: "",
  });

  const handleSkillInput = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!jobData.skillsRequired.includes(skillInput.trim())) {
        setJobData((prev) => ({
          ...prev,
          skillsRequired: [...prev.skillsRequired, skillInput.trim()],
        }));
      }
      setSkillInput("");
    }
  };

  const handleSubmit = () => {
    console.log("hello");
  };
  return (
    <div className="w-full h-[calc(100vh-6rem)] flex flex-col p-2 overflow-y-scroll">
      <div>
        <h1 className="font-semibold text-xl text-[#5b30a6]">Post a new job</h1>
        <span className="text-sm text-gray-500">
          Fill all required fields and press the create button to post.
        </span>
      </div>

      <div className="w-full border mt-4 p-2 flex-1 rounded md:p-3">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
            {/* job title */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter the job title"
                value={jobData.title}
                onChange={(e) =>
                  setJobData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                required
              />
            </div>

            {/* job type */}
            <div className="space-y-2">
              <Label htmlFor="type">Job Type</Label>
              <Select
                onValueChange={(value) =>
                  setJobData((prev) => ({
                    ...prev,
                    type: value,
                  }))
                }
                value={jobData.type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Job / Internship" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* department */}
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <Label htmlFor="type">Department</Label>
              <Select
                onValueChange={(value) =>
                  setJobData((prev) => ({
                    ...prev,
                    department: value,
                  }))
                }
                value={jobData.department}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose department" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_DEPARTMENTS.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
            {/* salary offered */}
            <div className="space-y-2">
              <Label htmlFor="phone">Salary offered</Label>
              <Input
                id="salaryOffered"
                name="salaryOffered"
                type="number"
                placeholder="ex. 50000"
                value={jobData.salaryOffered}
                onChange={(e) =>
                  setJobData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                required
              />
            </div>

            {/* salary currency */}
            <div className="space-y-2">
              <Label htmlFor="salaryCurrency">Salary Currency</Label>
              <Select
                onValueChange={(value) =>
                  setJobData((prev) => ({
                    ...prev,
                    salaryCurrency: value,
                  }))
                }
                value={jobData.salaryCurrency}
              >
                <SelectTrigger>
                  <SelectValue placeholder="INR / USD / EUR / GBP" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_SALARY_CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* salary period */}
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <Label htmlFor="salaryPeriod">Salary Period</Label>
              <Select
                onValueChange={(value) =>
                  setJobData((prev) => ({
                    ...prev,
                    salaryPeriod: value,
                  }))
                }
                value={jobData.salaryPeriod}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Monthly / Yearly / Hourly" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_SALARY_PERIODS.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              
              onChange={(e) =>
                setJobData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              value={jobData.description}
              placeholder="Job description"
            >
              {jobData.description}
            </Textarea>
          </div>

          <div className="space-y-2 mt-2">
            <Label htmlFor="skills">
              Skills required for role (Press Enter to add)
            </Label>
            <Input
              id="skillsRequired"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillInput}
              placeholder="Type a skill and press Enter"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {jobData.skillsRequired.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() =>
                      setJobData((prev) => ({
                        ...prev,
                        skillsRequired: prev.skillsRequired.filter(
                          (s) => s !== skill
                        ),
                      }))
                    }
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3  gap-2 mt-2">
            {/* experience level */}
            <div className="space-y-2">
              <Label htmlFor="experience level">Experience level</Label>
              <Select
                onValueChange={(value) =>
                  setJobData((prev) => ({
                    ...prev,
                    experienceLevel: value,
                  }))
                }
                value={jobData.experienceLevel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose experience required" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_EXPERIENCE_LEVELS.map((exp) => (
                    <SelectItem key={exp} value={exp}>
                      {exp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* deadline*/}
            <div className="space-y-2">
              <Label htmlFor="applicationDeadline">Application Deadline</Label>
              <Popover open={openDate} onOpenChange={setOpenDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="applicationDeadline"
                    className={"w-full justify-between font-normal"}
                  >
                    {date ? date.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  classNamee={"w-auto overflow-hidden p-0 "}
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        if (selectedDate < new Date())
                          return toast.error("Please select a future date.");
                        setDate(selectedDate);
                        setJobData((prev) => ({
                          ...prev,
                          applicationDeadline: selectedDate.toISOString(),
                        }));
                      }
                      setOpenDate(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* openings */}
            <div className="space-y-2">
              <Label htmlFor="openings">Openings</Label>
              <Input
                id="openings"
                name="openings"
                type="number"
                placeholder="ex. 5"
                value={jobData.openings}
                onChange={(e) =>
                  setJobData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>
          <Button className="w-full mt-2 bg-[#6A38C2] hover:bg-[#5b30a6] text-white"><BriefcaseBusiness /> Publish job</Button>
        </form>
      </div>
    </div>
  );
};

export default CreateJobsForm;
