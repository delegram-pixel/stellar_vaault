
import Details from '@/components/plans/Details'
import { Separator } from '@/components/ui/separator'
import React from 'react'
// import plans from '@/components/plans/plans'


const page = () => {
  return (
    <div>
           <h1 className="text-2xl">Investment Plans</h1>
           <Separator className="my-6" />
     
         <Details/>
    </div>
  )
}

export default page