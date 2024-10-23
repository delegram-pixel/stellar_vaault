'use server'
import { client } from '@/lib/prisma'
import { clerkClient, currentUser } from '@clerk/nextjs/server'





export const onUpdatePassword = async (password: string) => {
  try {
    const user = await currentUser()

    if (!user) return null
    const update = await clerkClient.users.updateUser(user.id, { password })
    if (update) {
      return { status: 200, message: 'Password updated' }
    }
  } catch (error) {
    console.log(error)
  }
}




