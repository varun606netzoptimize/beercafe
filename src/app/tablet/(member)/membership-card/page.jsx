'use client'

import { useContext, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import Image from 'next/image'

import axios from 'axios'

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints' // Import your ENDPOINTS
import TabletHeader from '@/components/TabletHeader/TabletHeader'

const Page = () => {
  const { orderId } = useContext(AuthContext) // Get orderId from context
  const [orderStatus, setOrderStatus] = useState(null) // State to store order status
  const [loading, setLoading] = useState(true) // State for loading status
  const [error, setError] = useState(null) // State for error handling
  const router = useRouter()

  useEffect(() => {
    if (orderId) {
      const fetchOrderStatus = async () => {
        setLoading(true)

        try {
          const response = await axios.post(ENDPOINT.ORDER_STATUS, {
            order_id: orderId
          })

          setOrderStatus(response.data.paymentStatus) // Set order status data

          if (response.data.paymentStatus == 'PAID') {
            router.push('/tablet/waiting')
          }
        } catch (err) {
          console.error('Failed to fetch order status:', err)
          setError('Failed to fetch order status.') // Set error message
        } finally {
          setLoading(false) // Set loading to false when done
        }
      }

      fetchOrderStatus()
    }
  }, [orderId]) // Dependency on orderId

  return (
    <>
      <TabletHeader>
        <h1 className='text-[30px] md:text-[38px] font-bold' style={{ textShadow: '0px 2px 0px #ffffff' }}>
          Tap Your Membership Card
        </h1>
        <p className='text-xl max-w-[650px] font-semibold mt-3'>
          Tap your beer membership card on the machine marked with the sign shown below to start pouring your fresh
          beer!
        </p>
      </TabletHeader>
      <div className='flex flex-col justify-center items-center w-full h-full text-center'>
        <div className='shadow-[0_0_10px_#00000029] w-full max-w-[380px] p-10 py-20 rounded-full'>
          <Image src='/images/mobile/rifd-yellow.png' alt='rifd' width={250} height={210} />
        </div>
        {/* {loading && <p>Loading order status...</p>}
        {error && <p className='text-red-500'>{error}</p>}
        {orderStatus && (
          <div>
            <h5 className='text-lg font-bold'>Payment Status:</h5>
            <p>{orderStatus}</p>
          </div>
        )} */}
      </div>
    </>
  )
}

export default Page
