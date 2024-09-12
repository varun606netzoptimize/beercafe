'use client'

import React, { useContext, useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import axios from 'axios'

import { CircularProgress } from '@mui/material'

import { toast } from 'react-toastify'

import { QRCodeSVG } from 'qrcode.react'

import TabletHeader from '@/components/TabletHeader/TabletHeader'
import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'

const Page = ({ params }) => {
  const { slug } = params
  const searchParams = useSearchParams()

  const [amountToAdd, setAmountToAdd] = useState(null)
  const [loading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(5 * 60)

  const router = useRouter()

  const queryAmount = searchParams.get('amount') || '0.00'
  const transactionId = searchParams.get('transactionId') || ''

  useEffect(() => {
    // Extract phone number from query parameters
    if (queryAmount) {
      setAmountToAdd(Number(queryAmount))
    }
  }, [queryAmount])

  const rfidNumber = window.localStorage.getItem('rfidNumber')
  const currentOrder = JSON.parse(window.localStorage.getItem('currentOrder'))

  const getTransactionStatus = () => {
    const url = ENDPOINT.TRANSACTION_GET

    const data = {
      payment_id: transactionId
    }

    axios
      .post(url, data)
      .then(res => {
        console.log(res.data.status, 'TRANSACTION_GET data')

        if (res.data.status == 'COMPLETED') {
          router.push(`/tablet/${slug}/success`)
        }
      })
      .catch(err => {
        console.log('failed to verify rfid', err)
      })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getTransactionStatus()
    }, 5000) // Polling every 5 seconds

    // Set an interval to countdown the timer
    const timerInterval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1
        } else {
          clearInterval(timerInterval)
          router.push(`/tablet/cafe/${slug}/drinks`) // Redirect when timer is finished

          return 0
        }
      })
    }, 1000) // Decrease time every second

    // Clean up intervals when the component unmounts
    return () => {
      clearInterval(interval)
      clearInterval(timerInterval)
    }
  }, [])

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const redirectUrl = `/tablet/${slug}/qr-reader?amount=${amountToAdd}&orderId=${currentOrder.orderId}&rfidNumber=${rfidNumber}&id=${transactionId}`

  console.log(redirectUrl, 'redirectUrl')

  return (
    <>
      <TabletHeader>
        <h1 className='text-[30px] md:text-[38px] font-black' style={{ textShadow: '0px 2px 0px #ffffff' }}>
          Ready to Sips?
        </h1>
        <p className='text-xl max-w-[650px] font-bold mt-3'>
          Scan the code below to add money and continue your purchase.
        </p>
      </TabletHeader>
      <div className='flex flex-col gap-10 mt-16 justify-center items-center w-full h-full text-center'>
        {loading ? (
          <CircularProgress size={200} sx={{ color: '#EBBB40' }} />
        ) : (
          <div
            className='flex flex-col justify-center items-center gap-10 border p-5'
            style={{ cursor: 'pointer' }}

            // onClick={handleAddBalance}
            onClick={() => {
              router.push(redirectUrl)
            }}
          >
            <QRCodeSVG value={`https://beercafe-staging.vercel.app/${redirectUrl}`} size={280} />
          </div>
        )}

        <div className='amount-message '>
          <p className='text-2xl font-semibold text-gray-800'>
            Add <span className='text-posPrimaryColor font-black'>${amountToAdd}</span> to your card!
          </p>
        </div>

        <div className='timer'>
          <p className='text-xl font-semibold text-red-600'>Time left: {formatTimeLeft()}</p>
        </div>
      </div>
    </>
  )
}

export default Page
