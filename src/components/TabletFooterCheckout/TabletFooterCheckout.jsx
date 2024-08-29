import React from 'react'

import Image from 'next/image'

import LeftArrow from '@/@menu/svg/LeftArrow'

const TabletFooterCheckout = () => {
  return (
    <div className='fixed p-5 bg-white bottom-0 w-full max-w-[1020px]'>
      <div className='bg-white border-2 flex border-black'>
        <div className='py-5 flex-grow px-8 flex justify-between items-center'>
          <div className='flex items-center justify-between w-full max-w-[250px]'>
            <h2 className='text-xl'>Your Cart</h2>
            <Image src='/images/mobile/corona.png' className='object-contain' width={70} height={40} />
          </div>
          <div className='flex items-center justify-between w-full max-w-[160px]'>
            <h3 className='text-lg text-[#8a8a8a]'>250 ml</h3>
            <h2 className='text-xl'>X1</h2>
          </div>
          <div className='max-w-[150px]'>
            <h3 className='text-lg text-[#8a8a8a]'>$1.50</h3>
          </div>
        </div>
        <div className='bg-posPrimaryColor p-3 flex flex-col cursor-pointer'>
          <h2 className='text-2xl font-bold'>$1.50</h2>
          <div className='flex w-full gap-8 justify-between items-center'>
            <p className='text-lg uppercase font-bold'>Checkout</p>
            <LeftArrow className='w-6 h-6' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabletFooterCheckout
