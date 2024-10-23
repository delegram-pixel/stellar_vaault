"use client"

import React from 'react'
import Lottie from 'lottie-react'
import processingAnimation from './processing.json' 

const KycLottie = () => {
  return (
    <div>
        <div className=" flex justify-center items-center  ">
          <div className="flex flex-col items-center justify-center p-4  rounded-md">
            <Lottie
              animationData={processingAnimation}
              style={{ width: 100, height: 100 }}
            />
            <p className="font-bold mt-2">Verification in progress...</p>
            <p className=" text-sm mt-1">
              We're reviewing your documents. This may take 1-2 business days.
            </p>
          </div>
         
        </div>
    </div>
  )
}

export default KycLottie