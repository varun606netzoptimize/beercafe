'use client'

import React, { useContext, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import Image from 'next/image'

import { prev } from 'stylis'

import axios from 'axios'

import { CircularProgress } from '@mui/material'

import { toast } from 'react-toastify'

import { QRCodeCanvas } from 'qrcode.react'

import upiqr from "upiqr";

import TabletHeader from '@/components/TabletHeader/TabletHeader'
import QR from '@/@menu/svg/QR'
import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'


const Page = ({ params }) => {
  const { slug } = params

  const { setRemainingBalance } = useContext(AuthContext)

  const [amountToAdd, setAmountToAdd] = useState(null)
  const [loading, setIsLoading] = useState(false)

  const [upiCode, setUpiCode] = useState(null)

  const router = useRouter()

  useEffect(() => {
    // Extract phone number from query parameters
    const queryAmount = new URLSearchParams(window.location.search).get('amount')

    if (queryAmount) {
      setAmountToAdd(Number(queryAmount))
    }
  }, [])

  const rfidNumber = window.localStorage.getItem('rfidNumber')
  const currentOrder = JSON.parse(window.localStorage.getItem('currentOrder'))

  const url = ENDPOINT.UPDATE_USER_POINTS

  function handleAddBalance() {

    const data = {
      RFID: rfidNumber,
      amount: amountToAdd,
      action: 'credit'
    }

    setIsLoading(true)

    axios
      .post(`${url}?rfid=${rfidNumber}&amount=${amountToAdd}&action='credit'`)
      .then(res => {
        console.log('successfully updated the balance', res.data.message)
        toast.success(res.data.message)
        ProcessPayment()
      })
      .catch(err => {
        console.log('failed to update balance')
        setIsLoading(false)
      })
  }

  function ProcessPayment() {
    const url = ENDPOINT.PROCESS_PAYMENT

    const data = {
      rfidNumber: rfidNumber,
      orderId: currentOrder.orderId,
      paymentStatus: 'PAID'
    }

    axios
      .post(url, data)
      .then(res => {
        console.log('successfully paid')
        setRemainingBalance(res.data.remainingBalance)

        router.push(`/tablet/${slug}/success`)
      })
      .catch(err => {
        console.log('failed to process', err.response.data)
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      })
  }

  upiqr({
    payeeVPA: "yashk7366@oksbu",
    payeeName: "Yash Kumar"
  })
  .then((upi) => {
    console.log(upi.qr);      // data:image/png;base64,eR0lGODP...
    console.log(upi.intent);  // upi://pay?pa=bhar4t@upi&pn=Bharat..

    setUpiCode(upi.intent);
  })
  .catch(err => {
    console.log(err);
  });

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
            className='flex flex-col justify-center items-center gap-10 border'
            style={{ cursor: 'pointer' }}

            // onClick={handleAddBalance}
          >
            <QRCodeCanvas value={'upi://pay?pa=yashk7366%40oksbu&pn=Yash%20Kumar'} />
            {/* <QR /> */}
          </div>
        )}

        <div className='amount-message '>
          <p className='text-2xl font-semibold text-gray-800'>
            Add <span className='text-posPrimaryColor font-black'>${amountToAdd}</span> to your card!
          </p>
        </div>
      </div>
    </>
  )
}

export default Page
