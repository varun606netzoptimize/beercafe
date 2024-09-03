import React from 'react'

const TabletHeader = ({children}) => {
  return (
    <header className='py-6 px-5 z-20 mx-auto w-full max-w-[1024px] flex flex-col items-center justify-center text-black text-center bg-posPrimaryColor top-0 fixed'>
     {children}
    </header>
  )
}

export default TabletHeader
