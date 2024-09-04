'use client'

import { useContext, useEffect, useState } from 'react'

import Image from 'next/image'

import TabletHeader from '@/components/TabletHeader/TabletHeader'
import { AuthContext } from '@/context/AuthContext'

const Page = () => {
  const { userBalanceData, setUserBalanceData, cartItem } = useContext(AuthContext)
  const [isBalanceUpdated, setIsBalanceUpdated] = useState(false)

  useEffect(() => {
    if (!isBalanceUpdated) {
      setIsBalanceUpdated(true)

      const updatedBalance = userBalanceData.balance - Number(cartItem.regularPrice)

      setUserBalanceData(prevState => ({
        ...prevState,
        balance: updatedBalance
      }))
    }
  }, [isBalanceUpdated, cartItem.regularPrice])

  return (
    <>
      <TabletHeader>
        <h1 className='text-[30px] md:text-[38px] font-black' style={{ textShadow: '0px 2px 0px #ffffff' }}>
          Cheers!
        </h1>
        <p className='text-xl max-w-[650px] font-bold mt-3'>
          Your perfectly chilled beer is ready to be enjoyed. <br /> Grab your glass and take that first delicious sip!
        </p>
      </TabletHeader>
      <div className='flex flex-col gap-2 mt-16 justify-center items-center w-full h-full text-center'>
        <div className='flex flex-col justify-center items-center gap-10'>
          <Image
            src='/images/mobile/beer-pour.png'
            alt='beer'
            className='rounded-[12px] w-11/12 md:w-full drop-shadow-lg object-cover'
            width={900}
            height={500}
          />
        </div>
        <p className='text-xl max-w-[650px] font-bold mt-3'>Your Balance ${userBalanceData.balance}</p>
      </div>
    </>
  )
}

export default Page
