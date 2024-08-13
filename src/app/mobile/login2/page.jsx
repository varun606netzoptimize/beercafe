'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import axios from 'axios'
import { toast } from 'react-toastify'
import { CircularProgress } from '@mui/material'

import { ENDPOINT } from '@/endpoints'
import appLogo from '../../../../public/appLogo.png'

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
    } catch (error) {
      console.log(error)
      toast.error('Failed to verify OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={container}>
      <div style={{ height: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={appLogo.src} alt='App Logo' width={197} height={224} />
      </div>
      <div style={bottomBox}>
        <h4 style={{ fontSize: '30px' }}>Please enter the OTP</h4>

        <div style={{ width: '100%', marginTop: '36px' }}>
          <p style={{ fontSize: '18px', lineHeight: '26px' }}>Enter One Time Password</p>

          <input
            style={{
              width: '100%',
              height: '46px',
              borderRadius: '10px',
              border: '1.8px solid black',
              backgroundColor: 'transparent',
              marginTop: '12px',
              paddingLeft: '20px',
              paddingRight: '20px',
              fontSize: '18px'
            }}
            value={otp}
            onChange={event => setOTP(event.target.value)}
          />
        </div>

        <div
          style={{
            width: '100%',
            marginTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            borderRadius: '15px',
            height: '50px',
            cursor: 'pointer'
          }}
          onClick={GetOTP}
        >
          {isLoading ? (
            <CircularProgress size={28} sx={{ color: '#FFCA5C' }} />
          ) : (
            <p style={{ color: '#FFCA5C', fontSize: '22px' }}>Login</p>
          )}
        </div>

        <p style={{ fontSize: '18px', lineHeight: '26px', marginTop: '30px' }}>
          We sent One Time Password to {phone}{' '}
          <strong style={{ cursor: 'pointer' }} onClick={() => router.back()}>
            change number
          </strong>
        </p>
      </div>
    </div>
  )
}

const container = { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }

const bottomBox = {
  height: '40%',
  borderTopLeftRadius: '40px',
  borderTopRightRadius: '40px',
  backgroundColor: '#FFCA5C',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '32px'
}
