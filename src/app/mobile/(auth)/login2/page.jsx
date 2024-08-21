'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import axios from 'axios'
import { toast } from 'react-toastify'
import { CircularProgress } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { ENDPOINT } from '@/endpoints'
import MobileButton from '@/components/MobileButton/MobileButton'

// Yup schema validation
const otpSchema = yup.object().shape({
  otp: yup.string().required('OTP is required')
})

export default function Page() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(otpSchema),
    mode: 'onSubmit'
  })

  useEffect(() => {
    // Extract phone number from query parameters
    const queryPhone = new URLSearchParams(window.location.search).get('phone')

    if (queryPhone) {
      setPhone(queryPhone)
    }
  }, [])

  const handleOTPSubmit = async data => {
    console.log(data)
    const url = ENDPOINT.VERIFY_OTP
    const userData = { phoneNumber: phone, otp: data.otp }

    setIsLoading(true)

    try {
      const response = await axios.post(url, userData)

      toast.success('Logged in successfully')

      // Add a redirect after successful login if necessary
    } catch (error) {
      console.error(error)
      toast.error('Failed to verify OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full'>
      <h2 className='text-2xl md:text-[30px] text-left w-full text-titleColor'>Please enter the OTP</h2>

      <form onSubmit={handleSubmit(handleOTPSubmit)}>
        <div className='w-full mt-10'>
          <p className='text-lg leading-6'>Enter One Time Password</p>

          <Controller
            name='otp'
            control={control}
            render={({ field }) => (
              <div>
                <input
                  className={`w-full rounded-[12px] border bg-primary my-3 py-3 px-3 text-lg max-h-12 placeholder:text-[#666666] placeholder:text-base ${
                    errors.otp
                      ? 'border-error !focus-visible:!border-error border-2 outline-error'
                      : 'border-black focus-visible:border-black'
                  }`}
                  placeholder='Enter OTP'
                  autoComplete='off'
                  {...field}
                />
                {/* {errors.otp && <p className='text-red-500 text-sm'>{errors.otp.message}</p>} */}
              </div>
            )}
          />
        </div>

        <MobileButton type='submit'>
          {isLoading ? <CircularProgress size={28} sx={{ color: '#F8C459' }} /> : 'Login'}
        </MobileButton>
      </form>

      <p className='text-lg leading-6 mt-8'>
        We sent One Time Password to {phone} <br />
        <strong className='cursor-pointer underline' onClick={() => router.back()}>
          change number
        </strong>
      </p>
    </div>
  )
}
