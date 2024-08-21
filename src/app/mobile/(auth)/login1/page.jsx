'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import axios from 'axios'
import { toast } from 'react-toastify'
import { Alert, CircularProgress, Typography } from '@mui/material'

import { ENDPOINT } from '@/endpoints'
import MobileButton from '@/components/MobileButton/MobileButton'

export default function Page() {
  const router = useRouter()

  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const GetOTP = async () => {
    const url = ENDPOINT.GENERATE_OTP

    const userData = { phoneNumber: phone }

    setIsLoading(true)

    try {
      const response = await axios.post(url, userData)

      toast.success('Your OTP is: ' + response.data.otp)
      router.push(`/mobile/login2?phone=${encodeURIComponent(phone)}`)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className='text-2xl md:text-[30px] text-left w-full text-titleColor'>Welcome to the BeerCafe</h2>

      <p className='text-lg md:text-[20px] mt-3'>
        Enjoying your favourite beer is just a step away. Simply enter your mobile number to get started.
      </p>

      {/* <Alert icon={false} className='bg-[var(--mui-palette-primary-lightOpacity)]'>
          <Typography variant='body2' color='primary'>
            Phone: <span className='font-medium'>9876543210</span>
          </Typography>
        </Alert> */}

      <div className='w-full mt-10'>
        <p className='text-base md:text-[18px]'>Enter your mobile number</p>

        <input
          className='w-full rounded-[12px] border bg-primary border-black my-3 py-3 px-3 text-lg max-h-12 focus-visible:border-black'
          onChange={event => setPhone(event.target.value)}
        />

        <p className='text-[16px] leading-6'>We will send an OTP for verification.</p>
      </div>

      <MobileButton onClick={GetOTP}>
        {isLoading ? <CircularProgress size={28} sx={{ color: '#F8C459' }} /> : 'Login'}
      </MobileButton>

      <p className='text-lg leading-6 mt-8 w-full'>
        By logging in, you agree to Beercafe <br />{' '}
        <span>
          <strong className='underline'>terms and conditions</strong> &{' '}
          <strong className='underline'>privacy policy.</strong>
        </span>
      </p>
    </div>
  )
}
