'use client'

import { useContext, useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import axios from 'axios'

import { toast } from 'react-toastify'

import { Loader2 } from 'lucide-react'

import TabletHeader from '@/components/TabletHeader/TabletHeader'
import { ENDPOINT } from '@/endpoints'
import BeerLoader from '@/components/BeerLoader/BeerLoader'
import { AuthContext } from '@/context/AuthContext'

const Page = ({ params }) => {
  const { slug } = params
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [handleLoading, setHandleLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const { setRemainingBalance } = useContext(AuthContext)
  const router = useRouter()

  const amount = searchParams.get('amount') || '0.00'
  const orderId = searchParams.get('orderId') || ''
  const rfidNumber = searchParams.get('rfidNumber') || ''
  const payment_id = searchParams.get('id') || ''

  function verifyRFID(rfidNumber) {
    const url = `${ENDPOINT.VERIFY_RFID}/${rfidNumber}/rfid`

    setLoading(true)
    axios
      .get(url)
      .then(res => {
        console.log(res.data.rfidDetails.customerRFID.Customer)
        setUserData(res.data.rfidDetails.customerRFID.Customer)
        setLoading(false)
      })
      .catch(err => {
        console.log('failed to verify rfid', err)
        setLoading(false)
      })
  }

  const transactionComplete = () => {
    const url = ENDPOINT.TRANSACTION_COMPLETE

    const data = {
      payment_id: payment_id
    }

    axios
      .post(url, data)
      .then(res => {
        console.log(res.data, 'payment_id data')

        if (res.data) {
          setPaymentSuccess(true)

          // router.push(`/${slug}/success`)
        }
      })
      .catch(err => {
        console.log('failed to verify rfid', err)
        setHandleLoading(false)
      })
      .finally(() => {
        setTimeout(() => {
          setHandleLoading(false)

          // setPaymentSuccess(true);
        }, 1000)
      })
  }

  function handleAddBalance() {
    const url = ENDPOINT.UPDATE_USER_POINTS

    const data = {
      RFID: rfidNumber,
      amount: amount,
      action: 'credit'
    }

    setHandleLoading(true)

    axios
      .post(`${url}?rfid=${rfidNumber}&amount=${amount}&action=credit`)
      .then(res => {
        console.log('successfully updated the balance', res.data.message)
        toast.success(res.data.message)
        ProcessPayment()
      })
      .catch(err => {
        console.log('failed to update balance')
        setHandleLoading(false)
      })
  }

  function ProcessPayment() {
    const url = ENDPOINT.PROCESS_PAYMENT

    const data = {
      rfidNumber: rfidNumber,
      orderId: orderId,
      paymentStatus: 'PAID'
    }

    axios
      .post(url, data)
      .then(res => {
        console.log('successfully paid')
        setRemainingBalance(res.data.remainingBalance)
        transactionComplete()

        // router.push(`/${slug}/success`)
      })
      .catch(err => {
        console.log('failed to process', err)
        setHandleLoading(false)
      })
  }

  useEffect(() => {
    verifyRFID(rfidNumber)
  }, [])

  return (
    <>
      <TabletHeader>
        <h1 className='text-[30px] md:text-[38px] font-black' style={{ textShadow: '0px 2px 0px #ffffff' }}>
          Confirm Your Payment
        </h1>
        <p className='text-xl max-w-[650px] font-bold mt-3'>Please confirm your payment to proceed further</p>
      </TabletHeader>
      {loading ? (
        <BeerLoader />
      ) : paymentSuccess ? ( // Check for payment success to show success message
        <div className='flex flex-col gap-10 mt-16 justify-center items-center w-full h-full text-center'>
          <svg viewBox='0 0 24 24' className='text-green-500 w-16 h-16 mx-auto my-6'>
            <path
              fill='currentColor'
              d='M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z'
            ></path>
          </svg>
          <h2 className='text-3xl font-bold text-green-500'>Payment Successful!</h2>
          <p className='text-lg font-semibold text-gray-600'>
            Thank you for your payment of ${amount}. Your transaction is now complete.
          </p>
          {/* <button
            className='bg-green-500 text-white px-6 py-3 mt-6 rounded-2xl cursor-pointer font-bold text-lg hover:bg-green-600 transition-all'
            onClick={() => router.push(`/${slug}/`)}
          >
            Return to Home
          </button> */}
        </div>
      ) : (
        <div className='flex flex-col gap-10 mt-16 justify-center items-center w-full h-full text-center'>
          <div>
            <p className='text-2xl font-semibold text-gray-800 mb-6'>
              {userData?.firstname} {userData?.lastname}
            </p>
            <p className='text-2xl font-semibold text-gray-800'>
              You are about to pay <span className='text-posPrimaryColor font-black text-3xl'>${amount}</span>
            </p>
          </div>

          <div className='flex gap-4 mt-6'>
            <button
              className='bg-green-500 text-white min-w-[280px] flex justify-center items-center px-6 py-3 rounded-2xl cursor-pointer font-bold text-lg hover:bg-green-600 transition-all'
              onClick={() => handleAddBalance()}
            >
              {handleLoading ? <Loader2 className='animate-spin text-white' /> : <>Confirm Payment</>}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Page
