'use server'

import { client } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export const onCompleteUserRegistration = async (
  fullname: string,
  clerkId: string,
  type: string,
  email: string,
  password: string

) => {
  console.log('Starting onCompleteUserRegistration with:', { fullname, clerkId, type, email, password });

  try {
    console.log('Attempting to create user in database');
    const registered = await client.user.create({
      data: {
        fullname,
        clerkId,
        type,
        email,
        password,

        profile: {
          create: {
            clerkId: clerkId,
            fullName: fullname,
            email: email,
           id: clerkId

          }
        }
      },
      select: {
        fullname: true,
        id: true,
        type: true,
      },
    });

    console.log('User created successfully:', registered);

    if (registered) {
      console.log('Returning success status');
      return { status: 200, user: registered }
    } else {
      console.log('User creation did not return expected result');
      return { status: 400, message: 'User creation failed' }
    }
  } catch (error) {
    console.error('Error in onCompleteUserRegistration:', error);
    return { status: 400, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// export const onLoginUser = async () => {
//   console.log('Starting onLoginUser');

//   try {
//     console.log('Fetching current user from Clerk');
//     const user = await currentUser();

//     if (!user) {
//       console.log('No user found, redirecting to sign in');
//       redirectToSignIn();
//       return { status: 401, message: 'User not authenticated' };
//     } else {
//       console.log('User found:', user.id);
//       try {
//         console.log('Attempting to find user in database');
//         const authenticated = await client.user.findUnique({
//           where: {
//             clerkId: user.id,
//           },
//           select: {
//             fullname: true,
//             id: true,
//             type: true,
//           },
//         });

//         if (authenticated) {
//           console.log('User found in database:', authenticated);
//           return { status: 200, user: authenticated }
//         } else {
//           console.log('User not found in database');
//           return { status: 404, message: 'User not found in database' }
//         }
//       } catch (error) {
//         console.error('Error finding user in database:', error);
//         return { status: 400, error: error instanceof Error ? error.message : 'Unknown error' }
//       }
//     }
//   } catch (error) {
//     console.error('Error in onLoginUser:', error);
//     return { status: 500, error: error instanceof Error ? error.message : 'Unknown error' }
//   }
// }


export const onLoginUser = async () => {

  const user = await currentUser()
  if (!user) redirect('/sign-in')
  else {
    try {
      const authenticated = await client.user.findUnique({
        where: {
          clerkId: user.id,
        },
        select: {
          fullname: true,
          id: true,
          type: true,
          clerkId: true
        },
      })
      if (authenticated) {
    
        return { status: 200, user: authenticated }
      }
    } catch (error) {
      return { status: 400 }
    }
  }
}


export const AdminLoginUser = async () => {

  const user = await currentUser()
  if (!user) redirect('/admin/sign-in')

  else {
    try {
      const authenticated = await client.admin.findUnique({
        where: {
          id: user.id,
        },
        select: {
          fullname: true,
          id: true,
      
        },
      })
      if (authenticated) {
    
        return { status: 200, user: authenticated }
      }
    } catch (error) {
      return { status: 400 }
    }
  }
}


export const AdminLoginUserSidebar = async () => {

  const user = await currentUser()
  if (!user) return null;

  else {
    try {
      const authenticated = await client.admin.findUnique({
        where: {
          id: user.id,
        },
        select: {
          fullname: true,
          id: true,
      
        },
      })
      if (authenticated) {
    
        return { status: 200, user: authenticated }
      }
    } catch (error) {
      return { status: 400 }
    }
  }
}


export const onLoginUserSidebar = async () => {

  const user = await currentUser()
  if (!user) return null;
  else {
    try {
      const authenticated = await client.user.findUnique({
        where: {
          clerkId: user.id,
        },
        select: {
          fullname: true,
          id: true,
          type: true,
          clerkId: true
        },
      })
      if (authenticated) {
    
        return { status: 200, user: authenticated }
      }
    } catch (error) {
      return { status: 400 }
    }
  }
}
export const UserId = async () => {

  const user = await currentUser()
  if (!user) redirect('/sign-in')
  else {
    try {
      const authenticated = await client.user.findUnique({
        where: {
          clerkId: user.id,
        },
        select: {
          fullname: true,
          id: true,
          type: true,
          clerkId: true
        },
      })
      if (authenticated) {
    
        return { status: 200, user: authenticated }
      }
    } catch (error) {
      return { status: 400 }
    }
  }
}