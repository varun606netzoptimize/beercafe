import MobileFooter from '@/components/MobileFooter/MobileFooter'

const mainLayout = ({ children }) => {
  return (
    <div className='h-full flex flex-col w-full max-w-[430px] mx-auto'>
      <div className='px-4 pb-10 pt-6 h-full'>{children}</div>
      <MobileFooter />
    </div>
  )
}

export default mainLayout
