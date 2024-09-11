'use client'

import { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import axios from 'axios'

import TabletHeader from '@/components/TabletHeader/TabletHeader'
import { ENDPOINT } from '@/endpoints'
import BeerLoader from '@/components/BeerLoader/BeerLoader'

const Page = () => {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true) // State for loading status
  const [userData, setUserData] = useState(null)

  const amount = searchParams.get('amount') || '0.00'
  const orderId = searchParams.get('orderId') || ''
  const rfidNumber = searchParams.get('rfidNumber') || ''

  function verifyRFID(rfidNumber) {
    const url = `${ENDPOINT.VERIFY_RFID}/${rfidNumber}/rfid`

    setLoading(true)
    axios
      .get(url)
      .then(res => {
        console.log(res.data.rfidDetails.customerRFID.Customer);
        setUserData(res.data.rfidDetails.customerRFID.Customer);
        setLoading(false)

      })
      .catch(err => {
        console.log('failed to verify rfid', err)
        setLoading(false)
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
        <p className='text-xl max-w-[650px] font-bold mt-3'>Please confirm your payment to proceed futher</p>
      </TabletHeader>
      {loading ? (
        <BeerLoader />
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
              className='bg-green-500 text-white px-6 py-3 rounded-2xl cursor-pointer font-bold text-lg hover:bg-green-600 transition-all'
              onClick={() => console.log('Payment Confirmed for Order:', orderId)}
            >
              Confirm Payment
            </button>

            <button
              className='bg-red-500 text-white px-6 py-3 rounded-2xl cursor-pointer font-bold text-lg hover:bg-red-600 transition-all'
              onClick={() => console.log('Payment Cancelled')}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Page
