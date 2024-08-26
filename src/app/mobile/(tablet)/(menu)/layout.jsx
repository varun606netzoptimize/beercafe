import { Inter } from 'next/font/google'

import clsx from 'clsx'

import BeerCategoryIcon from '@/@menu/svg/BeerCategoryIcon'
import TabletCheckout from '@/components/TabletCheckout/TabletCheckout'
import TabletSideBar from '@/components/TabletSideBar/TabletSideBar'
import TabletTopBar from '@/components/TabletTopBar/TabletTopBar'

const inter = Inter({ subsets: ['latin'] })

const MenuLayout = ({ children }) => {
  return (
    <>
      <div className={clsx('h-full flex bg-[#F8F7FA]', inter.className)}>
        <TabletSideBar />
        <div className='flex-1 flex flex-col'>
          <TabletTopBar />
          <div className='flex flex-col px-5'>
            <div className='bg-[#F8F7FA] mt-5'>
              <button className='rounded-3xl text-white gap-2 cursor-pointer py-2 px-5 flex items-center justify-center bg-primary'>
                <BeerCategoryIcon className='w-4 h-4' />
                <p className='font-medium'> Beer </p>
              </button>
            </div>
            <div className='flex bg-[#F8F7FA] w-full h-full py-5 gap-5'>
              <main>{children}</main>
              <TabletCheckout />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MenuLayout
