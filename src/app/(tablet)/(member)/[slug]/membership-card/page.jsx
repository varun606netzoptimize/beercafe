'use client'

import { useContext, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import Image from 'next/image'

import Link from 'next/link'

import axios from 'axios'

import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import { toast } from 'react-toastify'

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints' // Import your ENDPOINTS
import TabletHeader from '@/components/TabletHeader/TabletHeader'

const Page = ({ params }) => {
  const { slug } = params
  const { orderId, setUserBalanceData, setRemainingBalance } = useContext(AuthContext)
  const [orderStatus, setOrderStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const [selectRFID, setSelectRFID] = useState('9314890E')

  useEffect(() => {
    if (orderId) {
      const fetchOrderStatus = async () => {
        try {
          const response = await axios.post(ENDPOINT.ORDER_STATUS, {
            order_id: orderId
          })

          setOrderStatus(response.data.paymentStatus) // Set order status data

          if (response.data.paymentStatus == 'PAID') {
            router.push('/success')
          }
        } catch (err) {
          console.error('Failed to fetch order status:', err)
          setError('Failed to fetch order status.') // Set error message
        } finally {
        }
      }

      fetchOrderStatus()
    }
  }, [orderId])

  const currentOrder = JSON.parse(window.localStorage.getItem('currentOrder'))

  function verifyRFID(rfidNumber) {
    const url = `${ENDPOINT.VERIFY_RFID}/${rfidNumber}/rfid`

    setLoading(true)

    axios
      .get(url)
      .then(res => {
        const cutomerPoints = res.data.rfidDetails.customerRFID.Customer.points

        if (cutomerPoints >= currentOrder.amount) {
          ProcessPayment(rfidNumber, currentOrder.orderId)
        } else {
          window.localStorage.setItem('rfidNumber', res.data.rfidDetails.rfidNumber)
          setUserBalanceData(cutomerPoints)
          router.push(`/${slug}/add-balance`)

          setTimeout(() => {
            setLoading(false)
          }, 2000)
        }
      })
      .catch(err => {
        console.log('failed to verify rfid', err.response.data.message)
        toast.error(err.response.data.message)
        setLoading(false)
      })
  }

  function ProcessPayment(rfidNumber, orderId) {
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

        router.push(`/${slug}/success`)
      })
      .catch(err => {
        console.log('failed to process', err.response.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <TabletHeader>
        <h1 className='text-[30px] md:text-[38px] font-black' style={{ textShadow: '0px 2px 0px #ffffff' }}>
          Tap Your Membership Card
        </h1>
        <p className='text-xl max-w-[650px] font-bold mt-3'>
          Tap your beer membership card on the machine marked with the sign shown below to start pouring your fresh
          beer!
        </p>

        <Box sx={{ alignSelf: 'flex-end', minWidth: '180px' }}>
          <FormControl fullWidth>
            <InputLabel>Select RFID Card</InputLabel>
            <Select
              label='Select RFID Card'
              onChange={e => {
                setSelectRFID(e.target.value)
              }}
              value={selectRFID}
            >
              <MenuItem value={'9314890E'}>{'9314890E'}</MenuItem>
              <MenuItem value={'D30DDD24'}>{'D30DDD24'}</MenuItem>
              <MenuItem value={'9314872E'}>{'9314872E'}</MenuItem>
              <MenuItem value={'93148727'}>{'93148727'}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </TabletHeader>

      <div className='flex flex-col justify-center items-center w-full h-full text-center mt-12'>
        {loading ? (
          <CircularProgress size={200} sx={{ color: '#EBBB40' }} />
        ) : (
          <div
            className='shadow-[0_0_10px_#00000029] w-full max-w-[380px] p-10 py-20 rounded-full'
            style={{ cursor: 'pointer' }}
            onClick={() => verifyRFID(selectRFID)}
          >
            <div>
              <Image src='/images/mobile/rifd-yellow.png' alt='rifd' width={250} height={210} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Page
