import Navbar from '@/components/shared/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminMainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      
      <div className="flex-1 mt-16 ">
        <Outlet />
      </div>
      
    </div>
  )
}

export default AdminMainLayout