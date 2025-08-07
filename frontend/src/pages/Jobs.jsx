import React from 'react';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const jobList = [
  { title: "Frontend Developer", company: "TCS", location: "Bangalore, India" },
  { title: "Backend Developer", company: "Infosys", location: "Pune, India" },
  { title: "Full Stack Developer", company: "Wipro", location: "Hyderabad, India" },
  { title: "Software Developer", company: "Tech Mahindra", location: "Chennai, India" },
  { title: "Junior Frontend Developer", company: "Zoho", location: "Coimbatore, India" },
];

const Jobs = () => {
  return (
    <>
      
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">Available Job Openings</h2>
          <div className="grid gap-6">
            {jobList.map((job, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-gray-500 text-sm">{job.location}</p>
                </div>
                <Link to="/apply">
                <Button className="bg-[#6A38C2] text-white px-6 py-2 rounded-md hover:bg-[#582ea5] transition">
                  Apply Now
                </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </>
  );
};

export default Jobs;