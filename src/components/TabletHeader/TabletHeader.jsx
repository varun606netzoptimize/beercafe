import React from 'react'

const TabletHeader = ({children}) => {
  return (
    <header className='py-6 px-5 z-20 drop-shadow-2xl mx-auto w-full max-w-[1024px] flex flex-col items-center justify-center text-black text-center bg-posPrimaryColor'>
     {children}
    </header>
  )
}

export default TabletHeader
