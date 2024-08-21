'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import axios from 'axios'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'

import { toast } from 'react-toastify'
import { CircularProgress } from '@mui/material'

import { ENDPOINT } from '@/endpoints'
import MobileButton from '@/components/MobileButton/MobileButton'

// Yup schema validation
const numberSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required')
})

export default function Page() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(numberSchema), // Pass yup schema for validation
    mode: 'onSubmit'
  })

  const GetOTP = async data => {
    const url = ENDPOINT.GENERATE_OTP

    setIsLoading(true)

    try {
      const response = await axios.post(url, { phoneNumber: data.phoneNumber })

      toast.success('Your OTP is: ' + response.data.otp)
      router.push(`/mobile/login2?phone=${encodeURIComponent(data.phoneNumber)}`)
    } catch (error) {
      console.log(error)
      toast.error('Failed to generate OTP')
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

      <form onSubmit={handleSubmit(GetOTP)}>
        <div className='w-full mt-10'>
          <p className='text-base md:text-[18px]'>Enter your mobile number</p>
          <Controller
            name='phoneNumber'
            control={control}
            render={({ field }) => (
              <div className='relative'>
                <input
                  className={`w-full rounded-[12px] border bg-primary  my-3 py-3 px-3 text-lg max-h-12 placeholder:text-[#666666] placeholder:text-base  ${
                    errors.phoneNumber
                      ? 'border-[#E57373] !focus-visible:border-[#E57373] border-2'
                      : 'border-black focus-visible:border-black'
                  }`}
                  placeholder='Enter your phone number'
                  maxLength={10}
                  {...field}
                />
                {/* {errors.phoneNumber && <p className='text-red-500 text-sm absolute'>{errors.phoneNumber.message}</p>} */}
              </div>
            )}
          />

          <p className='text-[16px] leading-6'>We will send an OTP for verification.</p>
        </div>

        <MobileButton type='submit'>
          {isLoading ? <CircularProgress size={28} sx={{ color: '#F8C459' }} /> : 'Login'}
        </MobileButton>
      </form>

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
