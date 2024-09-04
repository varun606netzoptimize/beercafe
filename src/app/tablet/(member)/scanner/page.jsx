import Image from 'next/image'

import TabletHeader from '@/components/TabletHeader/TabletHeader'
import QR from '@/@menu/svg/QR'

const page = () => {
  return (
    <>
      <TabletHeader>
        <h1 className='text-[30px] md:text-[38px] font-black' style={{ textShadow: '0px 2px 0px #ffffff' }}>
          Ready to Sip?
        </h1>
        <p className='text-xl max-w-[650px] font-bold mt-3'>
          Scan the code below to add money and continue your purchase.
        </p>
      </TabletHeader>
      <div className='flex flex-col gap-10 mt-16 justify-center items-center w-full h-full text-center'>
        <div className='flex flex-col justify-center items-center gap-10 border'>
          <QR />
        </div>
        <div className='amount-message '>
          <p className='text-2xl font-semibold text-gray-800'>
            Add <span className='text-posPrimaryColor font-black'>$500</span> to your card!
          </p>
        </div>
      </div>
    </>
  )
}

export default page
