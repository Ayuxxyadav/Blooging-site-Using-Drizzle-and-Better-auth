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
import { signIn } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

// ✅ Schema validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // ✅ Login handler
  const onLoginSubmit = async (values: LoginFormValues) => {
    setLoading(true)
    try {
      const { error } = await signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: true
      })

      if (error) {
        const message =
          error?.message ||
          (error?.code === 'INVALID_CREDENTIALS'
            ? 'Invalid email or password'
            : 'Login failed. Please try again.')

        toast.error(message)
        return
      }

      toast.success('Signed in successfully!')
      router.push('/') // redirect after login

    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message || error)
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onLoginSubmit)}
        className='space-y-4'
        noValidate
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter your email'
                  type='email'
                  {...field}
                  disabled={isLoading}
                />
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
                <Input
                  type='password'
                  placeholder='Enter your password'
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  )
}
