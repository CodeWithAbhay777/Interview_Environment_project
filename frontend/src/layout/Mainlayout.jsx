import Footer from '@/components/shared/Footer'
import Navbar from '../components/shared/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Mainlayout = () => {
  return (
    <div className='flex flex-col min-h-screen overflow-x-hidden'>
        <Navbar/>
        <div className='flex-1 mt-16 '>
            <Outlet/>
        </div>
        <Footer/>
    </div>
  )
}

export default Mainlayout