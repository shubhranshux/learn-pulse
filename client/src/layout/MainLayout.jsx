import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function MainLayout() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <div className='flex-1 mt-14 sm:mt-16'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
