'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import axios from 'axios'
import { toast } from 'react-toastify'
import { CircularProgress } from '@mui/material'

import { ENDPOINT } from '@/endpoints'
import MobileButton from '@/components/MobileButton/MobileButton'

export default function Page() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [otp, setOTP] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Extract phone number from query parameters
    const queryPhone = new URLSearchParams(window.location.search).get('phone')

    if (queryPhone) {
      setPhone(queryPhone)
    }
  }, [])

  const GetOTP = async () => {
    const url = ENDPOINT.VERIFY_OTP
    const userData = { phoneNumber: phone, otp: otp }

    setIsLoading(true)

    try {
      const response = await axios.post(url, userData)

      toast.success('Logged in successfully')

      // Add a redirect after successful login if necessary
    } catch (error) {
      console.log(error)
      toast.error('Failed to verify OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full'>
      <h2 className='text-2xl md:text-[30px] text-left w-full text-titleColor'>Please enter the OTP</h2>

      <div className='w-full mt-10'>
        <p className='text-lg leading-6'>Enter One Time Password</p>

        <input
          className='w-full h-[46px] rounded-[12px] border-[1.8px] border-black bg-transparent mt-3 px-5 text-lg focus-visible:border-black'
          value={otp}
          onChange={event => setOTP(event.target.value)}
        />
      </div>

      <MobileButton onClick={GetOTP}>
        {isLoading ? <CircularProgress size={28} sx={{ color: '#F8C459' }} /> : 'Login'}
      </MobileButton>

      <p className='text-lg leading-6 mt-8'>
        We sent One Time Password to {phone} <br />
        <strong className='cursor-pointer underline' onClick={() => router.back()}>
          change number
        </strong>
      </p>
    </div>
  )
}
