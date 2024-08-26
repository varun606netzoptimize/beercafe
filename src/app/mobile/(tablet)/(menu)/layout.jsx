import TabletCheckout from '@/components/TabletCheckout/TabletCheckout'
import TabletSideBar from '@/components/TabletSideBar/TabletSideBar'
import TabletTopBar from '@/components/TabletTopBar/TabletTopBar'
import clsx from 'clsx'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const MenuLayout = ({ children }) => {
  return (
    <>
      <div className={clsx('h-full flex bg-[#333333]', inter.className)}>
        <TabletSideBar />
        <div className='flex-1 flex flex-col'>
          <TabletTopBar />
          <div className='flex flex-col  px-5'>
            <div className='bg-[#333333] mt-5'>
              <button className='rounded-3xl cursor-pointer py-2 px-6 flex items-center justify-center bg-primary'>
                Beer
              </button>
            </div>
            <div className='flex bg-[#333333] w-full h-full py-5 gap-5'>
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
