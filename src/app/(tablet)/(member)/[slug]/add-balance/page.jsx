'use client'

import { useContext } from 'react'

import { useRouter } from 'next/navigation'

import axios from 'axios'

import AddBalanceButton from '@/components/AddBalanceButton/AddBalanceButton '
import TabletHeader from '@/components/TabletHeader/TabletHeader'
import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'

const Page = ({ params }) => {
  const { slug } = params

  const { userBalanceData } = useContext(AuthContext)

  const router = useRouter()
  const currentOrder = JSON.parse(window.localStorage.getItem('currentOrder'))
  const rfidNumber = window.localStorage.getItem('rfidNumber')

  const amounts = [(currentOrder.amount - Number(userBalanceData)).toFixed(2), 800, 1000, 1200, 1500]

  const initiateTransaction = ({ amount }) => {
    const url = ENDPOINT.TRANSACTION_INITIATE

    console.log('url', url)

    const data = {
      RFID: rfidNumber,
      amount: Number(amount),
      action: 'credit'
    }

    axios
      .post(url, data)
      .then(res => {
        console.log('successfully paid', res)

        if (res.data.id) {
          router.push(`/${slug}/scanner?amount=${amount}&transactionId=${res.data.id}`)
        }
      })
      .catch(err => {
        console.log('failed to process', err.response.data)
      })
  }

  const handleAddBalance = amount => {
    initiateTransaction({ amount })
  }

  return (
    <>
      <TabletHeader>
        <h1 className='text-[30px] md:text-[38px] font-black' style={{ textShadow: '0px 2px 0px #ffffff' }}>
          Oops!
        </h1>
        <p className='text-xl max-w-[650px] font-bold mt-3'>
          Your balance is a bit low. Add some funds to enjoy your beer!
        </p>
      </TabletHeader>
      <div className='flex flex-col gap-10 justify-center items-center w-full h-full text-center'>
        <div className='mt-16 gap-2 w-full m  ax-w-[380px] flex flex-col justify-center text-center text-[#1f1f1f]'>
          <h3 className='text-xl font-bold mb-16'>
            Cart Amount: <span className='text-[40px] font-black text-posPrimaryColor'>${currentOrder.amount}</span>
          </h3>
          <h3 className='text-xl font-bold'>
            Your card balance is:{' '}
            <span className='text-[40px] font-black text-posPrimaryColor'>${Number(userBalanceData).toFixed(2)}</span>
          </h3>
        </div>

        <div className='flex flex-col justify-center items-center gap-10 w-4/5'>
          <div className='bg-white w-full'>
            <p className='text-center font-black uppercase text-lg text-black border-t pt-10'>Add card balance</p>
          </div>
          <div className='flex flex-wrap justify-center items-center gap-3 w-full'>
            {amounts.map(amount => (
              <AddBalanceButton key={amount} amount={amount} onClick={handleAddBalance} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
