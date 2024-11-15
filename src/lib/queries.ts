"use server";

import { currentUser } from "@clerk/nextjs/server";
import { client } from "./prisma";
import { redirect } from "next/navigation";
import { Actions, Deposit, KYCVerification, Profile, Role, Withdrawal } from "@prisma/client";
import bcrypt from 'bcrypt'


interface UpdateUserInput {
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  address?: string;
  // Add any other fields you want to be able to update
}


export type PlanFormValues = {
  id?: string;
  name: string;
  shortName?: string;
  description?: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  interestPeriod: string;
  payoutTerm: string;
  termDuration: number;
  termDurationType: string;
  isFixedInvestment: boolean;
  returnCapital: boolean;
  isFeatured: boolean;
  isActive: boolean;
};


interface Kyc {
  fullName?: String,
  dateOfBirth?:String,
  nationality?: String,
  streetAddress?: String,
  city?: String,
  postalCode?: String,
  country?: String,
  idFrontUrl?: String,
  idBackUrl?: String,
  selfieUrl?: String,

}


interface AdminSignUp {
  username: String,
  email : String,
  password: String,
}
export const getBalance = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Current user not found.");
    }

    const getbal = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    return getbal;
  } catch (error) {
    console.error("Error creating deposit:", error);
    throw error;
  }
};

export const DepositCall = async (newUser: Deposit) => {
  console.log("Starting createDeposit function");
  console.log("Input newUser:", JSON.stringify(newUser, null, 2));

  try {
    console.log("Attempting to get current user");
    const user = await currentUser();
    if (!user) {
      console.error("Current user not found");
      throw new Error("Current user not found.");
    }
    console.log("Current user found:", user.id);

    console.log("Preparing deposit data");
    const depositData = {
      id: newUser.id,
      amount: newUser.amount,
      currency: newUser.currency,
      status: "PENDING",
      userId: newUser.userId,
    };
    console.log("Deposit data:", JSON.stringify(depositData, null, 2));

    console.log("Attempting to create deposit in database");
    const userData = await client.deposit.create({
      data: depositData,
    });

    console.log(
      "Deposit created successfully:",
      JSON.stringify(userData, null, 2)
    );

    if (userData) {
      const depositData = {};

      try {
        const transactionDetails = await client.transaction.create({
          data: {
            id: newUser.id,
            amount:  parseFloat(newUser.amount) || 0, 
            currency: newUser.currency,
            status: "PENDING",
            userId: newUser?.userId,
            type: "DEPOSIT",
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
    return userData;
  } catch (error) {
    console.error("Error in createDeposit function:", error);
    console.error("Error stack:", (error as Error).stack);
    throw error;
  } finally {
    console.log("Exiting createDeposit function");
  }
};

export const getAllTransaction = async ( ) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error('Current user not found.');
    }

    const getTransaction = await client.transaction.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: "desc", // Order by createdAt in descending order to get the latest deposits first
      },
      });
    

    return getTransaction;
  } catch (error) {
    console.error('Error creating deposit:', error);
    throw error;
  }
};

export const TotalDepo = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("Current user not found.");
    }

    const totalDeposits = await client.deposit.count({
      where: {
        userId: user.id,
      },
    });

   

    return totalDeposits;
  } catch (error) {
    console.error("Error creating deposit:", error);
    throw error;
  }
};

export const TotalWithdraw = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("Current user not found.");
    }

    const totalDeposits = await client.withdrawal.count({
      where: {
        userId: user.id,
      },
    });

   

    return totalDeposits;
  } catch (error) {
    console.error("Error creating deposit:", error);
    throw error;
  }
};


export const updateUser = async (userData: UpdateUserInput) => {
  try {
    // Get the current user
    const user = await currentUser();
    if (!user) {
      throw new Error("Current user not found.");
    }

    // Update the user's profile
    const updatedProfile = await client.profile.update({
      where: { id: user.id },
      data: {
        ...userData,
        updatedAt: new Date(), 
      },
    });

    return updatedProfile;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};

export const getProfileDetails = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error('Current user not found.');
    }

    const getProfille = await client.profile.findUnique({
      where: {
        id: user.id
      }

      
      
      });
    

    return getProfille;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
};

export const KycVerification = async (userData: Kyc) => {
  try {
    // Get the current user
    const user = await currentUser();
    if (!user) {
      throw new Error("Current user not found.");
    }

    // Update the user's profile
    const updateKyc = await client.kYCVerification.create({
     
      data: {
        ...userData,
        userId: user.id,
        id: user.id,
        clerkId: user.id,
        updatedAt: new Date(), 
      },
    });

    return updateKyc;
  } catch (error) {
    console.error('Error Uploading Kyc:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};

export const getKyc = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error('Current user not found.');
    }

    const getProfille = await client.kYCVerification.findUnique({
      where: {
        id: user.id
      }

    
      });
    

    return getProfille;
  } catch (error) {
    console.error('Error getting kyc:', error);
    throw error;
  }
};

export const CreateWithdraw = async (newUser: Withdrawal) => {
  console.log("Starting createDeposit function");
  console.log("Input newUser:", JSON.stringify(newUser, null, 2));

  try {
    console.log("Attempting to get current user");
    const user = await currentUser();
    if (!user) {
      console.error("Current user not found");
      throw new Error("Current user not found.");
    }
    console.log("Current user found:", user.id);

    console.log("Preparing deposit data");
    const withdrawData = {
      id: newUser.id,
      amount: newUser.amount,
      walletAddress: newUser.walletAddress,
      status: "PENDING",
      userId: user.id,
    };
    console.log("Deposit data:", JSON.stringify(withdrawData, null, 2));

    console.log("Attempting to create deposit in database");
    const userData = await client.withdrawal.create({
      data: withdrawData,
    });

    console.log(
      "Deposit created successfully:",
      JSON.stringify(userData, null, 2)
    );

    if (userData) {
      const depositData = {};

      try {
        const transactionDetails = await client.transaction.create({
          data: {
            id: newUser.id,
            amount:  parseFloat(newUser.amount) || 0, 
            status: "PENDING",
            userId: user.id,
            type: "WITHDRAWAL",
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
    return userData;
  } catch (error) {
    console.error("Error in createDeposit function:", error);
    console.error("Error stack:", (error as Error).stack);
    throw error;
  } finally {
    console.log("Exiting createDeposit function");
  }
};


// ADMIN LOGICS 

export async function createAdmin(userData:AdminSignUp) {
  const hashedPassword = await bcrypt.hash(userData.password, 10)
  
  return client.admin.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  })
}

export async function findAdminByEmail(email: string) {
  return client.admin.findUnique({
    where: { email },
  })
}

export async function validateAdminPassword(admin: any, password: string) {
  return bcrypt.compare(password, admin.password)
}

export async function updateAdminPassword(adminId: string, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  return client.admin.update({
    where: { id: adminId },
    data: { password: hashedPassword },
  })
}

export async function deleteAdmin(adminId: string) {
  return client.admin.delete({
    where: { id: adminId },
  })
}

export const getAdminDashboardData = async () => {
  try {
    const [
      users,
      totalUsers,
      totalTransactions,
      totalDeposits,
      totalWithdrawals,
      totalBalance
   
    ] = await Promise.all([
      client.user.findMany({
        include: {
          transactions: true,
        },
      }),
      client.user.count(),
      client.transaction.count(),
      client.transaction.count({
        where: { type: "DEPOSIT" }
      }),
      client.transaction.count({
        where: { type: "WITHDRAWAL" }
      }),
      client.user.aggregate({
        _sum: {
          balance: true,
        },

      
      })
    ]);

    return {
      users,
      totalUsers,
      totalTransactions,
      totalBalance: totalBalance._sum.balance || 0,
      totalDeposits,
      totalWithdrawals
    };
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    throw error;
  }
};

// export const getTransactionTrend = async (days = 5) => {
//   try {
//     const endDate = new Date();
//     const startDate = new Date(endDate);
//     startDate.setDate(startDate.getDate() - days + 1);

//     const transactions = await client.transaction.groupBy({
//       by: ['createdAt'],
//       _sum: {
//         amount: true,
//       },
//       where: {
//         createdAt: {
//           gte: startDate,
//           lte: endDate,
//         },
//       },
//       orderBy: {
//         createdAt: 'asc',
//       },
//     });

//     const formattedData = transactions.map(transaction => ({
//       date: formatDate(transaction.createdAt),
//       value: transaction._sum.amount || 0,
//     }));

//     return formattedData;
//   } catch (error) {
//     console.error('Error fetching transaction trend:', error);
//     throw error;
//   }
// };

// // Helper function to format date
function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  return `${day} ${month}`;
}





// export const getAdminDashboardData = async () => {
//   try {
//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

//     const [deposits, withdrawals] = await Promise.all([
//       client.transaction.findMany({
//         where: { type: 'DEPOSIT' },
//         select: { amount: true, createdAt: true },
//       }),
//       client.transaction.findMany({
//         where: { type: 'WITHDRAWAL' },
//         select: { amount: true, createdAt: true },
//       }),
//     ]);

//     const totalDeposit = deposits.reduce((sum, t) => sum + t.amount, 0);
//     const totalWithdraw = withdrawals.reduce((sum, t) => sum + t.amount, 0);
//     const thisMonthDeposit = deposits.filter(t => t.createdAt >= startOfMonth).reduce((sum, t) => sum + t.amount, 0);
//     const thisMonthWithdraw = withdrawals.filter(t => t.createdAt >= startOfMonth).reduce((sum, t) => sum + t.amount, 0);
//     const thisWeekDeposit = deposits.filter(t => t.createdAt >= startOfWeek).reduce((sum, t) => sum + t.amount, 0);
//     const thisWeekWithdraw = withdrawals.filter(t => t.createdAt >= startOfWeek).reduce((sum, t) => sum + t.amount, 0);

//     return {
//       totalDeposit,
//       totalWithdraw,
//       thisMonthDeposit,
//       thisMonthWithdraw,
//       thisWeekDeposit,
//       thisWeekWithdraw,
//     };
//   } catch (error) {
//     console.error('Error fetching admin dashboard data:', error);
//     throw error;
//   }
// };

// export const getTransactionTrend = async (days = 5) => {
//   try {
//     const endDate = new Date();
//     const startDate = new Date(endDate);
//     startDate.setDate(startDate.getDate() - days + 1);

//     const transactions = await client.transaction.findMany({
//       where: {
//         createdAt: {
//           gte: startDate,
//           lte: endDate,
//         },
//       },
//       select: {
//         amount: true,
//         createdAt: true,
//       },
//       orderBy: {
//         createdAt: 'asc',
//       },
//     });

//     const groupedData = transactions.reduce((acc, transaction) => {
//       const date = formatDate(transaction.createdAt);
//       if (!acc[date]) {
//         acc[date] = 0;
//       }
//       acc[date] += transaction.amount;
//       return acc;
//     }, {});

//     const formattedData = Object.entries(groupedData).map(([date, value]) => ({
//       date,
//       value,
//     }));

//     return formattedData;
//   } catch (error) {
//     console.error('Error fetching transaction trend:', error);
//     throw error;
//   }
// };

// // Helper function to format date
// function formatDate(date: Date): string {
//   const day = date.getDate().toString().padStart(2, '0');
//   const month = date.toLocaleString('default', { month: 'short' });
//   return `${day} ${month}`;
// }


export const getAllTransactions = async () => {
  try {
    const transactions = await client.transaction.findMany({
     
    });

    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};


export const dataDatabase = async () => {
  const deposits = await client.transaction.aggregate({
    where: { type: 'DEPOSIT' },
    _sum: { amount: true },
  })
  
  const withdrawals = await client.transaction.aggregate({
    where: { type: 'WITHDRAWAL' },
    _sum: { amount: true },
  })

  const lastMonthDeposits = await client.transaction.aggregate({
    where: {
      type: 'DEPOSIT',
      createdAt: { gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
    },
    _sum: { amount: true },
  })

  // Add queries for this month, this week, etc.

return {
  deposits, withdrawals, lastMonthDeposits 
} 
}


// lib/queries.ts


export const getAllDepo = async () => {
  try {
    const deposits = await client.deposit.findMany({
      orderBy: { createdAt: 'desc' },
      include: { User: true },
    });
    return deposits;
  } catch (error) {
    console.error('Error fetching deposits:', error);
    return [];
  }
};

export const approveDeposit = async (id: string) => {
  try {
    const updatedDeposit = await client.deposit.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });

    const updateTransacDepo = await client.transaction.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });

    // Update user balance
 if(updatedDeposit){
  await client.user.update({
    where: { clerkId: updatedDeposit.userId },
    data: {
      balance: {
        increment: parseFloat(updatedDeposit.amount),
      },
    },
  });
 }

    return updatedDeposit;
  } catch (error) {
    console.error('Error approving deposit:', error);
    throw error;
  }
};

export const rejectDeposit = async (id: string) => {
  try {
    const updatedDeposit = await client.deposit.update({
      where: { id },
      data: { status: 'FAILED' },


    });


    const updateTransacDepo = await client.transaction.update({
      where: { id },
      data: { status: 'FAILED' },
    });

    return updatedDeposit;
  } catch (error) {
    console.error('Error rejecting deposit:', error);
    throw error;
  }
};


export const getAllWithdraw = async () => {
  try {
    const withdraw = await client.withdrawal.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
    return withdraw;
  } catch (error) {
    console.error('Error fetching deposits:', error);
    return [];
  }
};


export const approveWithdraw = async (id: string) => {
  try {
    const updatedWithdraw = await client.withdrawal.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });

    const updateTransacDepo = await client.transaction.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });

    // Update user balance
 if(updatedWithdraw){
  await client.user.update({
    where: { clerkId: updatedWithdraw.userId },
    data: {
      balance: {
        decrement: parseFloat(updatedWithdraw.amount),
      },
    },
  });
 }

    return updatedWithdraw;
  } catch (error) {
    console.error('Error approving deposit:', error);
    throw error;
  }
};

export const rejectWithdraw = async (id: string) => {
  try {
    const updatedDeposit = await client.withdrawal.update({
      where: { id },
      data: { status: 'FAILED' },


    });


    const updateTransacDepo = await client.transaction.update({
      where: { id },
      data: { status: 'FAILED' },
    });

    return updatedDeposit;
  } catch (error) {
    console.error('Error rejecting withdrawal:', error);
    throw error;
  }
};



export const getAllTrans = async () => {
  try {
    const transaction = await client.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
    return transaction;
  } catch (error) {
    console.error('Error fetching deposits:', error);
    return [];
  }
};


// lib/userQueries.ts



interface UserFilter {
  hasBalance: boolean
  kycApproved: boolean
  role: Role | 'Any Role'
  status: Actions | string
}

export async function getFilteredUsers(filter: UserFilter) {
  return await client.user.findMany({
    where: {
      balance: filter.hasBalance ? { gt: 0 } : undefined,
      kycApproved: filter.kycApproved ? true : undefined,
      role: filter.role !== 'Any Role' ? filter.role : undefined,
      status: filter.status !== 'Any Status' ? filter.status : undefined,
    },
    select: {
      id: true,
      fullname: true,
      email: true,
      balance: true,
      kycApproved: true,
      role: true,
      createdAt: true,
      status: true,
      // Add more fields as needed, excluding sensitive information
    }
  })
}

export async function updateUsersStatus(userIds: string[], status: string) {
  return await client.user.updateMany({
    where: { id: { in: userIds } },
    data: { status },
  })
}


export async function getUserDetails(userId: string) {
  const user = await client.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      transactions: true,
      investments: true,
      referrals: true,
    },
  });

  return user;
}


export const handleActive = async (id: string) => {
  try {
    const updateStats = await client.user.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });

  

 

    return updateStats;
  } catch (error) {
    console.error('Error  Stats:', error);
    throw error;
  }
};

export const handlesus = async (id: string) => {
  try {
    const suspend = await client.user.update({
      where: { id },
      data: { status: 'SUSPENDED' },


    });
    return suspend;
  } catch (error) {
    console.error('Error  Suspending:', error);
    throw error;
  }
};







export const getAlTransactions = async ( ) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error('Current user not found.');
    }

    const getTransaction = await client.transaction.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc", // Order by createdAt in descending order to get the latest deposits first
      },
      take: 4, // Limit the number of deposits to 4
    });
  
    

    return getTransaction;
  } catch (error) {
    console.error('Error creating deposit:', error);
    throw error;
  }
};



export const getAllKyc = async () => {
  try {
    const kyc = await client.kYCVerification.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
    return kyc;
  } catch (error) {
    console.error('Error fetching deposits:', error);
    return [];
  }
};

export const getAllKycId = async (userId:string) => {
  try {
    const kyc = await client.kYCVerification.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        id: userId
      },
    });
    return kyc;
  } catch (error) {
    console.error('Error fetching deposits:', error);
    return [];
  }
};


export const handleApproved = async (id: string) => {
  try {
    const updateStats = await client.kYCVerification.update({
      where: { id },
      data: { status: 'APPROVED' },
    });


    if(updateStats) {
      const updateStat = await client.user.update({
        where: { clerkId: updateStats.userId },
        data: { kycApproved: true },
      });
  
    }
  

 

    return updateStats;
  } catch (error) {
    console.error('Error  Stats:', error);
    throw error;
  }
};

export const handleNotApproved = async (id: string) => {
  try {
    const suspend = await client.kYCVerification.update({
      where: { id },
      data: { status: 'REJECTED' },


    });
    return suspend;
  } catch (error) {
    console.error('Error  Suspending:', error);
    throw error;
  }
};


// lib/plans.ts



export async function createPlan(data: any) {
  return client.plan.create({
    data: {
      name: data.name,
      shortName: data.shortName,
      description: data.description,
      minAmount: data.minAmount,
      maxAmount: data.maxAmount,
      interestRate: data.interestRate,
      interestPeriod: data.interestPeriod,
      payoutTerm: data.payoutTerm,
      termDuration: data.termDuration,
      termDurationType: data.termDurationType,
      isFixedInvestment: data.isFixedInvestment,
      returnCapital: data.returnCapital,
      isFeatured: data.isFeatured,
      isActive: data.isActive,
    },
  });
}

export async function getAllPlans() {
  return client.plan.findMany();
}


export const makePlanActive = async (id: string) => {
  try {
    const planActive = await client.plan.update({
      where: { id },
      data: { isActive: true },


    });


   
    return planActive;
  } catch (error) {
    console.error('Error making plan Active :', error);
    throw error;
  }
};

export const makePlanNotActive = async (id: string) => {
  try {
    const planActive = await client.plan.update({
      where: { id },
      data: { isActive: false },


    });


   
    return planActive;
  } catch (error) {
    console.error('Error making plan not  aCTIVE:', error);
    throw error;
  }
};

export const Deleteplan = async (id: string) => {
  try {
    const planActive = await client.plan.delete({
      where: { id },


    });


    return planActive;
  } catch (error) {
    console.error('Error making plan not  aCTIVE:', error);
    throw error;
  }
};


export async function updatePlan(id: string, plan: PlanFormValues): Promise<PlanFormValues> {
  return client.plan.update({
    where: { id },
    data: plan,
  });
}



// Get all active investment plans
export async function getActivePlans() {
  return client.plan.findMany({
    where: { isActive: true },
  });
}
// Create a new investment
export async function createInvestment(userId:string, planId: string, amount: number) {
  try {
 

    const plan = await client.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new Error("Plan not found");

    const user = await client.user.findUnique({
      where: { clerkId: userId },
    });
    
    if (!user) throw new Error("User not found");

    if (user.balance < amount) throw new Error("Insufficient balance");
    if (amount < plan.minAmount || amount > plan.maxAmount) throw new Error("Invalid investment amount");

    const endDate = calculateEndDate(plan.termDuration, plan.termDurationType);

    return client.$transaction(async (tx) => {
      // Create the investment
      const investment = await tx.investment.create({
        data: {
          
          userId,
          planId,
          amount,
          endDate,
        },
      });

      // Deduct the amount from user's balance
      await tx.user.update({
        where: { clerkId: userId },
        data: { balance: { decrement: amount } },
      });


      const transactionDetails = await client.transaction.create({
        data: {
          id: userId,
          amount:  amount, 
          status: "COMPLETED",
          userId: userId,
          type: "INVESTMENT",
        },
      });
      return investment;
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error creating investment:', error);

    // Rethrow the error or handle it as needed
    throw error;
  }
}

export async function calculateInterest() {
  const activeInvestments = await client.investment.findMany({
    where: { status: "ACTIVE" },
    include: { plan: true },
  });

  for (const investment of activeInvestments) {
    const interestRate = investment.plan.interestRate / 100;
    const dailyRate = interestRate / 365;
    const daysActive = Math.floor((Date.now() - investment.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const interest = investment.amount * dailyRate * daysActive;

    await client.investment.update({
      where: { id: investment.id },
      data: { accumulatedInterest: interest },
    });

    if (new Date() >= investment.endDate) {
      await completeInvestment(investment.id);
    }
  }
}

async function completeInvestment(investmentId: string) {
  const investment = await client.investment.findUnique({
    where: { id: investmentId },
    include: { plan: true, user: true },
  });

  if (!investment) throw new Error("Investment not found");

  const totalReturn = investment.amount + investment.accumulatedInterest;

  await client.$transaction(async (tx) => {
    await tx.investment.update({
      where: { id: investmentId },
      data: { status: "COMPLETED" },
    });

    await tx.user.update({
      where: { id: investment.userId },
      data: { balance: { increment: totalReturn } },
    });
  });
}

function calculateEndDate(duration: number, durationType: string): Date {
  const endDate = new Date();
  switch (durationType) {
    case "days":
      endDate.setDate(endDate.getDate() + duration);
      break;
    case "weeks":
      endDate.setDate(endDate.getDate() + duration * 7);
      break;
    case "months":
      endDate.setMonth(endDate.getMonth() + duration);
      break;
    case "years":
      endDate.setFullYear(endDate.getFullYear() + duration);
      break;
    default:
      throw new Error("Invalid duration type");
  }
  return endDate;
}

export async function getInvestments(userId: string) {
  try {
    const investments = await client.investment.findMany({
      where: {
        userId: userId,
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return investments;
  } catch (error) {
    console.error('Error fetching investments:', error);
    throw error;
  }
}

export async function getUserInvestmentData(userId: string) {
  const investments = await client.investment.findMany({
    where: { userId: userId },
    include: { plan: true }
  });

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalProfit = investments.reduce((sum, inv) => sum + inv.accumulatedInterest, 0);

  const user = await client.user.findUnique({
    where: { id: userId },
    select: { balance: true }
  });

  return {
    availableFunds: user?.balance || 0,
    totalInvested,
    totalProfit
  };
}


export async function PaymentDc(data: any) {

 

      try {
        const paymentMethod = await client.paymentMethod.create({
          data: {
            name: data.name,
            walletAddress: data.walletAddress,
            currencyId: data.currencyId,
            isEnabled: data.isEnabled,
          },
        });
  
        return paymentMethod;
      } catch (error) {
        console.error('Error fetching investments:', error);
        throw error;
      
    }

}


export async function CurrencydC(data: any) {

 

  try {
    const currency = await client.currency.create({
      data: {
        name: data.name,
        symbol: data.symbol,
        isEnabled: true,
      },
    });

    return currency;
  } catch (error) {
    console.error('Error fetching investments:', error);
    throw error;
  
}

}



export async function getAllCurrency() {
  return client.currency.findMany({

    where: {
      isEnabled: true,
    }
 
  });
}

export async function deleteCurrency(id:any) {
  return client.paymentMethod.delete({

    where: {
      id: id,
    }
 
  });
}

export async function getAllPaymentMethods() {
  return client.paymentMethod.findMany({
 
  });
}


export const getAllInvestment = async () => {
  try {
    const transactions = await client.transaction.findMany({

      where: {
        type: "INVESTMENT"
      }
     
    });

    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};





export async function updatePaymentMethod(id:string, data: any) {

 

  try {
    const currency = await client.paymentMethod.update({
      where: {
        id: id
      },
      data: {
        ...data
      },
    });

    return currency;
  } catch (error) {
    console.error('Error fetching investments:', error);
    throw error;
  
}

}


export async function UpdateBal(userId:string, data: number) {

 console.log(data)

  try {
    const updatedUser = await client.user.update({
      where: { clerkId: userId },

      data: {
        balance: {
          increment: data,
        },
      },
    });

    return updatedUser;
  } catch (error) {
    console.error('Error fetching investments:', error);
    throw error;
  
}

}


