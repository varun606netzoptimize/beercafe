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
          <div className='flex'>
            <main> {children}</main>
            <TabletCheckout />
          </div>
        </div>
      </div>
    </>
  )
}

export default MenuLayout
