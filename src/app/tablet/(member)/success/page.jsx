const page = () => {
  return (
    <>
      <div className='absolute z-40 top-8 left-7'>
        <h2 className='text-[#1f1f1f] text-3xl font-bold text-left'>Hey Yash</h2>
      </div>
      <div className='flex flex-col gap-6 justify-center items-center w-full h-full text-center'>
        <h1 className='text-[60px] text-center text-primary'>Cheers!!!</h1>
        <h4 className='text-xl font-medium text-[#1F1F1F] max-w-[500px]'>
          Your perfectly chilled beer is ready to be enjoyed. Grab your glass and take that first delicious sip!
        </h4>
        <div className='shadow-[0_0_10px_#00000029] mt-5 gap-2 w-full max-w-[380px] py-[40px] flex flex-col justify-center text-center rounded-[10px] text-[#1f1f1f]'>
          <h3 className='text-lg font-normal'>Your card balance is</h3>
          <h2 className='text-[26px]'>Rs 175</h2>
        </div>
        <button className='max-w-[250px] mt-8 w-full py-3 px-3 bg-primary drop-shadow-md transition-all duration-300 rounded-2xl text-center font-normal text-lg cursor-pointer hover:drop-shadow-xl'>
          Add another Order
        </button>
      </div>
    </>
  )
}

export default page
