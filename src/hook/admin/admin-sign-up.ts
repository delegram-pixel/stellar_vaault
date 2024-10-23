'use client'
import { useToast } from '@/hooks/use-toast'
import {
  AdminRegistrationProps,
  AdminRegistrationSchema,
  UserRegistrationProps,
  UserRegistrationSchema,
} from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { onCompleteUserRegistration } from '@/actions/adminAuth'

export const useSignUpForm = () => {
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const { signUp, isLoaded, setActive } = useSignUp()
  const router = useRouter()
  const methods = useForm<AdminRegistrationProps>({
    resolver: zodResolver(AdminRegistrationSchema),
    defaultValues: {
      type: 'ADMIN',
    },
    mode: 'onChange',
  })

  const onGenerateOTP = async (
    email: string,
    password: string,
    onNext: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (!isLoaded) return

    try {
      await signUp.create({
        emailAddress: email,
        password: password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      onNext((prev) => prev + 1)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.errors[0].longMessage,
      })
    }
  }

  const onHandleSubmit = methods.handleSubmit(
    async (values: UserRegistrationProps) => {
      if (!isLoaded) {
        console.log('Clerk is not loaded yet');
        return;
      }

      try {
        setLoading(true)
        console.log('Attempting email address verification');
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: values.otp,
        })
        console.log('Email verification attempt result:', completeSignUp);

        if (completeSignUp.status !== 'complete') {
          console.error('Sign up not complete:', completeSignUp);
          return { message: 'Something went wrong!' }
        }

        if (completeSignUp.status == 'complete') {
          if (!signUp.createdUserId) {
            console.error('No created user ID found');
            return;
          }

          console.log('Calling onCompleteUserRegistration');
          const registered = await onCompleteUserRegistration(
            values.fullname,
            signUp.createdUserId,
            values.type,
            values.email,
            values.password
          )
          console.log('onCompleteUserRegistration result:', registered);

          if (registered?.status == 200 && registered.user) {
            console.log('Setting active session');
            await setActive({
              session: completeSignUp.createdSessionId,
            })
            console.log('Active session set');

            setLoading(false)
            console.log('Redirecting to dashboard');
            router.push('/admin/dashboard')
          }

          if (registered?.status == 400) {
            console.error('Registration failed with status 400');
            toast({
              title: 'Error',
              description: 'Something went wrong!',
            })
          }
        }
      } catch (error: any) {
        console.error('Error in onHandleSubmit:', error);
        toast({
          title: 'Error',
          description: error.errors?.[0]?.longMessage || error.message || 'An unexpected error occurred',
        })
      } finally {
        setLoading(false)
      }
    }
  )
  return {
    methods,
    onHandleSubmit,
    onGenerateOTP,
    loading,
  }
}