import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import PlatformOverview from './PlatformOverview'
import HeroSection from './HeroSection'
import WorkflowSteps from './WorkflowSteps'
{/*import LoginOptions from './LoginOptions'*/}
import CategoryCarousel from './CategoryCarousel'
{/*import LatestJobs from './LatestJobs'*/}
import AboutUs from './AboutUs'
import ContactUs from './ContactUs'
import Footer from './shared/Footer'
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
      <Navbar />
      
      <HeroSection />
      <PlatformOverview/>
      <WorkflowSteps/>
      {/*<LoginOptions/>*/}
      <CategoryCarousel />
      <AboutUs />
      <ContactUs />
      {/*<LatestJobs />*/}
      <Footer />
    </div>
  )
}

export default Home