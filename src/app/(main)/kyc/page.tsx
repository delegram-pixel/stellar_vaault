

import KYCVerification from "@/components/kyc/KycPage";
import { getKyc } from "@/lib/queries";
import React from "react";
import KycLottie from "./kycLottie";


const KycMain = async () => {
  const getKycDetails = await getKyc();
  return (
    <div>
      {getKycDetails && getKycDetails.status === "PENDING" ? (
        <div className="  ">
          <KycLottie/>
        </div>
      ) : (
        <div>
          <KYCVerification />
        </div>
      )}
    </div>
  );
};

export default KycMain;
