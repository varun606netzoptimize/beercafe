'use client'

import React from 'react'
import localFont from 'next/font/local'
import clsx from 'clsx'

const museoSlab = localFont({
  src: [
    {
      path: '../../../public/fonts/MuseoSlab-700.woff2',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../../../public/fonts/MuseoSlab-900.woff2',
      weight: '900',
      style: 'normal'
    },
    {
      path: '../../../public/fonts/MuseoSlab-100.woff2',
      weight: '100',
      style: 'normal'
    }
  ]
})

const AddBalanceButton = ({ amount, onClick }) => {
  return (
    <button
      onClick={() => onClick(amount)}
      className={clsx(
        'max-w-[250px] min-w-[200px] w-full py-3 px-3 bg-posPrimaryColor text-white border-posPrimaryColor border-2 drop-shadow-md transition-all duration-300 text-center font-bold text-lg cursor-pointer hover:drop-shadow-xl',
        museoSlab.className
      )}
    >
      Add ${amount}
    </button>
  )
}

export default AddBalanceButton
