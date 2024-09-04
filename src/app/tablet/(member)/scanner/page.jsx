'use client';

import React, { useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation'

import Image from 'next/image'

import { prev } from 'stylis';

import TabletHeader from '@/components/TabletHeader/TabletHeader'
import QR from '@/@menu/svg/QR'
import { AuthContext } from '@/context/AuthContext';

const Page = () => {

  const {userBalanceData, setUserBalanceData} = useContext(AuthContext)
  
  const router = useRouter()

  const [amountToAdd, setAmountToAdd] = useState(null)

  useEffect(() => {
    // Extract phone number from query parameters
    const queryAmount = new URLSearchParams(window.location.search).get('amount')

    if (queryAmount) {
      setAmountToAdd(Number(queryAmount))
    }
  }, [])


  function handleAddBalance(){
    setUserBalanceData(prevState => ({
      ...prevState,
      balance: prevState.balance + amountToAdd
    }));

    router.push("/tablet/success")
  }

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
        <div className='flex flex-col justify-center items-center gap-10 border' style={{cursor: 'pointer'}}  onClick={handleAddBalance}>
          <QR />
        </div>
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
