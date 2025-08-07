import React, { useEffect } from 'react'
import Navbar from '../components/shared/Navbar'
import PlatformOverview from '../components/PlatformOverview'
import HeroSection from '../components/HeroSection'
import WorkflowSteps from '../components/WorkflowSteps'
{/*import LoginOptions from './LoginOptions'*/}
import CategoryCarousel from '../components/CategoryCarousel'
{/*import LatestJobs from './LatestJobs'*/}
import AboutUs from '../components/AboutUs'
import ContactUs from '../components/ContactUs'
import Footer from '../components/shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, []);
  return (
    <div>
      
      
      <HeroSection />
      <PlatformOverview/>
      <WorkflowSteps/>
      
      <CategoryCarousel />
      <AboutUs />
      <ContactUs />
      
      
    </div>
  )
}

export default Home