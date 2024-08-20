const mainLayout = ({ children }) => {
  return (
    <div className='h-full flex flex-col w-full max-w-[430px] mx-auto'>
      <div className='px-4 py-10 h-full'>{children}</div>
      <footer>
        <div className='w-full bg-black flex py-5 px-10'></div>
      </footer>
    </div>
  )
}

export default mainLayout
