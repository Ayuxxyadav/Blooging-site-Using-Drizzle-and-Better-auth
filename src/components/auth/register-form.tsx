'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { signUp } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

// ✅ Zod validation schema
const registerSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    email: z.email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSuccess?: () => void
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // ✅ Handle form submission
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    setLoading(true)
    try {
      const { error } = await signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      })

      if (error) {
        // ✅ Handle BetterAuth error codes
        const message =
          error?.message ||
          (error?.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL'
            ? 'User already exists. Use another email.'
            : 'Failed to create account. Please try again.')

        toast.error(message)
        return
      }

      toast.success(
        'Account created successfully! Please sign in with your email and password.'
      )

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/sign-in')
      }
    } catch (error: any) {
      console.error(
        'Registration error:',
        error.response?.data || error.message || error
      )
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // ✅ JSX Form
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onRegisterSubmit)}
        className='space-y-4'
        noValidate
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter your name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='Enter your email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='Enter your password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Re-enter your password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full'
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </Form>
  )
}
