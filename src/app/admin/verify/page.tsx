import KYCVerificationCenter from '@/components/admin/kyc/KycVerification'
import { Separator } from '@/components/ui/separator'

import React from 'react'

const page = () => {
  return (
    <div>
      <div>
      <h1 className="text-2xl">Kyc Verification</h1>
      <Separator className="my-6" />
      </div>
        <KYCVerificationCenter/>
    </div>
  )
}

export default page