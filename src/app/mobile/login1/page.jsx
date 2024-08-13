'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import axios from 'axios'
import { toast } from 'react-toastify'
import { Alert, CircularProgress, Typography } from '@mui/material'

import { ENDPOINT } from '@/endpoints'

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
    <div style={container}>
      <div style={{ height: '46%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src='/appLogo.png' alt='App Logo' width={197} height={224} />
      </div>
      <div style={bottomBox}>
        <h4 style={{ fontSize: '30px' }}>Welcome to the BeerCafe</h4>

        <p
          style={{
            fontSize: '20px',
            lineHeight: '29px',
            marginTop: '12px',
            textAlign: 'center' // Added to center-align text
          }}
        >
          Enjoying your favourite beer is just a step away. Simply enter your mobile number to get started.
        </p>

        <Alert icon={false} className='bg-[var(--mui-palette-primary-lightOpacity)]'>
          <Typography variant='body2' color='primary'>
            Phone: <span className='font-medium'>9876543210</span>
          </Typography>
        </Alert>

        <div style={{ width: '100%', marginTop: '36px' }}>
          <p
            style={{
              fontSize: '18px',
              lineHeight: '26px'
            }}
          >
            Enter your mobile number
          </p>

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
            onChange={event => setPhone(event.target.value)}
          />

          <p
            style={{
              fontSize: '16px',
              lineHeight: '23px',
              marginTop: '14px'
            }}
          >
            We will send an OTP for verification.
          </p>
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

        <p
          style={{
            fontSize: '18px',
            lineHeight: '26px',
            marginTop: '30px',
            textAlign: 'center' // Added to center-align text
          }}
        >
          By logging in, you agree to Beercafe <strong>terms and conditions</strong> & <strong>privacy policy.</strong>
        </p>
      </div>
    </div>
  )
}

const container = { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }

const bottomBox = {
  borderTopLeftRadius: '40px',
  borderTopRightRadius: '40px',
  backgroundColor: '#FFCA5C',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '32px'
}
