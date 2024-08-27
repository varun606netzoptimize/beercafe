import { Inter } from 'next/font/google'

import clsx from 'clsx'

import BeerCategoryIcon from '@/@menu/svg/BeerCategoryIcon'
import TabletCheckout from '@/components/TabletCheckout/TabletCheckout'
import TabletSideBar from '@/components/TabletSideBar/TabletSideBar'
import TabletTopBar from '@/components/TabletTopBar/TabletTopBar'
import CheckoutIcon from '@/@menu/svg/CheckoutIcon'

const inter = Inter({ subsets: ['latin'] })

const MenuLayout = ({ children }) => {
  return (
    <>
      <div className={clsx('h-full flex bg-[#F8F7FA]', inter.className)}>
        <TabletSideBar />
        <div className='flex-1 flex flex-col'>
          <TabletTopBar />
          <div className='flex flex-col px-5'>
            <div className='bg-[#F8F7FA] mt-5 flex items-center w-full justify-between'>
              <button className='rounded-3xl text-black gap-2 cursor-pointer py-2 px-5 flex items-center justify-center bg-posPrimaryColor'>
                <BeerCategoryIcon className='w-4 h-4' />
                <p className='font-medium'> Beer </p>
              </button>
              <button className='rounded-full drop-shadow-2xl pl-5 py-6 pr-12 -mr-16 bg-posPrimaryColor'>
                <CheckoutIcon />
              </button>
            </div>
            <div className='flex bg-[#F8F7FA] w-full h-full py-5 gap-5'>
              <main>{children}</main>
              <div className='hidden md:block w-full '>
                <TabletCheckout />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MenuLayout
