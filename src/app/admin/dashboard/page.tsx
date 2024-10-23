import AdminCard from '@/components/admin/components/dashboard/AdminCard'
import AdminSection from '@/components/admin/components/dashboard/AdminSection'

import React from 'react'

const Dashboard = () => {
  return (
    <div>
     
      <div className='w-full h-full mx-auto'>
        <AdminCard/>
        
       <AdminSection/>
      
      </div>
    </div>
  )
}

export default Dashboard