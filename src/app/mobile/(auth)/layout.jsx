const AuthLayout = ({ children }) => {
  return (
    <div className='h-full w-full max-w-[430px] mx-auto' style={{ border: '1px solid #cdcdcd' }}>
      <div className='flex flex-col justify-between h-full text-left'>
        <div className='flex items-center justify-center mt-20'>
          <img src='/images/mobile/appLogo.png' alt='App Logo' width={220} height={230} className='object-contain' />
        </div>
        <div className='bg-primary rounded-t-[40px] flex flex-col items-center p-[35px] pt-[55px]'>{children}</div>
      </div>
    </div>
  )
}

export default AuthLayout
