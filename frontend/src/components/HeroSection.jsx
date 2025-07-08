{/*import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                {/*<span className=' mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 Job Hunt Website</span>*/}
                {/*<h1 className='text-5xl font-bold'>Simulate. Perform. <br /> <span className='text-[#6A38C2]'>Get Hired </span></h1>
                <p>Empower your hiring journey with realistic, AI-powered mock interviews designed for success!</p>
                <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input
                        type="text"
                        placeholder='Start Your Mock Interview '
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full'

                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2]">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection*/}

{/*import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate('/browse');
  };

  return (
    <div className="bg-violet-50 py-20 px-4">
      <div className="text-center max-w-3xl mx-auto">
        <div className="flex flex-col gap-5">
          {/* <span className=' mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 Job Hunt Website</span> */}
          {/*<h1 className="text-5xl font-bold leading-tight">
            Simulate. Perform. <br /> <span className="text-[#6A38C2]">Get Hired</span>
          </h1>
          <p className="text-gray-700">
            Empower your hiring journey with realistic, AI-powered mock interviews designed for success!
          </p>
          <div className="flex w-full md:w-[70%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto bg-white">
            <input
              type="text"
              placeholder="Start Your Mock Interview"
              onChange={(e) => setQuery(e.target.value)}
              className="outline-none border-none w-full py-3 px-4 rounded-full text-sm"
            />
            <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2] text-white px-5 py-3">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;*/}

import React, { useState } from 'react';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate('/jobs');
  };

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-24 px-4"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1650&q=80')`, // Replace with your own image URL
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        <div className="flex flex-col gap-6">
          <span className="mx-auto px-4 py-1 rounded-full bg-white/20 text-white text-sm font-semibold shadow w-fit backdrop-blur">
            #1 AI Interview Platform
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Simulate. Perform. <br />
            <span className="text-violet-300">Get Hired</span>
          </h1>

          <p className="max-w-xl mx-auto text-base md:text-lg text-gray-200">
            Empower your hiring journey with realistic, AI-powered interviews crafted to prepare you for success.
          </p>

          {/* Input + Button */}
          <div className="flex flex-col sm:flex-row w-full sm:w-[80%] mx-auto mt-6 gap-4">
            <input
              type="text"
              placeholder="Enter your job title (e.g., Frontend Developer)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border border-white/30 bg-white/80 backdrop-blur-sm rounded-full px-5 py-3 text-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-violet-400 outline-none transition-all duration-150"
            />
            <Button
              onClick={searchJobHandler}
              className="bg-[#6A38C2] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#582ea5] transition-all duration-200 shadow-md"
            >
              Start Interview
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;