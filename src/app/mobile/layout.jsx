const AuthLayout = ({ children }) => {
  return (
    <div className='h-full w-full max-w-[430px] mx-auto'>
      <div className='flex flex-col justify-between h-full text-left'>
        <div className='flex items-center justify-center mt-20'>
          <img src='/appLogo.png' alt='App Logo' width={220} height={230} />
        </div>
        <div className='bg-[#FFCA5C] rounded-t-[40px] flex flex-col items-center p-[35px] pt-[55px]'>
        {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
