
import ChangePassword from '@/components/settings/change-password'
import DarkModetoggle from '@/components/settings/dark-mode-toggle'
import React from 'react'


const page = () => {
    return (
        <div className=''>
     
           <DarkModetoggle />
          <div className='mt-10'>
          <ChangePassword/>
          </div>
            

        </div>
    )
}

export default page
