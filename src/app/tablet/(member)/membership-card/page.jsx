const Page = () => {
  return (
    <>
      <div className='absolute z-40 top-8 left-7'>
        <h2 className='text-[#1f1f1f] text-3xl font-bold text-left'>Tap your Membership Card</h2>
      </div>
      <div className='flex flex-col gap-8 justify-center items-center w-full h-full text-center'>
        <h4 className='text-xl font-medium text-[#1F1F1F]'>
          Tap your beer membership card on the machine marked with the sign below to start pouring your fresh beer.
        </h4>
        <div className='shadow-[0_0_10px_#00000029] w-full max-w-[480px] py-[40px] rounded-[10px]'></div>
      </div>
    </>
  )
}

export default Page
