import TabletCheckout from '@/components/TabletCheckout/TabletCheckout'
import TabletSideBar from '@/components/TabletSideBar/TabletSideBar'
import TabletTopBar from '@/components/TabletTopBar/TabletTopBar'
import clsx from 'clsx'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const MenuLayout = ({ children }) => {
  return (
    <>
      <div className={clsx('h-full flex', inter.className)}>
        <TabletSideBar />
        <div className='flex-1 flex flex-col'>
          <TabletTopBar />
          <div className='flex bg-[#333333] w-full h-full py-10 px-6 gap-6'>
            <main>{children}</main>
            <TabletCheckout />
          </div>
        </div>
      </div>
    </>
  )
}

export default MenuLayout
