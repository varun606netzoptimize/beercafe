import React from 'react'

const TabletHeader = () => {
  return (
    <header className='py-6 z-20 drop-shadow-2xl mx-auto w-full max-w-[1024px] text-black text-center bg-posPrimaryColor fixed top-0'>
      <h1
        className='text-[40px] lg:text-[50px] font-bold italic uppercase'
        style={{ textShadow: '0px 2px 0px #ffffff' }}
      >
        Chilled Beer Vending Machine
      </h1>
      <p className='text-xl font-medium mt-2'>Please select the beer of your choice from the items listed:</p>
    </header>
  )
}

export default TabletHeader
