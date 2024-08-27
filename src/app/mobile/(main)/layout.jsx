import MobileFooter from '@/components/MobileFooter/MobileFooter'

const mainLayout = ({ children }) => {
  return (
    <div className='h-full flex flex-col w-full max-w-[430px] mx-auto border border-[#cdcdcd]'>
      <div className='h-full'>{children}</div>
      <MobileFooter />
    </div>
  )
}

export default mainLayout
