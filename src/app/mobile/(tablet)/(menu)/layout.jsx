import TabletCheckout from '@/components/TabletCheckout/TabletCheckout'
import TabletSideBar from '@/components/TabletSideBar/TabletSideBar'
import TabletTopBar from '@/components/TabletTopBar/TabletTopBar'

const MenuLayout = ({ children }) => {
  return (
    <>
      <div className='h-full flex'>
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
