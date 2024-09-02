import TabletHeader from '@/components/TabletHeader/TabletHeader'

const page = () => {
  return (
    <>
      <TabletHeader>
        <h1 className='text-[30px] md:text-[38px] font-bold' style={{ textShadow: '0px 2px 0px #ffffff' }}>
          Cheers!
        </h1>
        <p className='text-xl max-w-[650px] font-semibold mt-3'>
          Your perfectly chilled beer is ready to be enjoyed. <br /> Grab your glass and take that first delicious sip!
        </p>
      </TabletHeader>
      <div className='flex flex-col gap-6 justify-center items-center w-full h-full text-center'>
        <div className='shadow-[0_0_10px_#00000029] mt-5 gap-2 w-full max-w-[380px] py-[40px] flex flex-col justify-center text-center rounded-[10px] text-[#1f1f1f]'>
          <h3 className='text-xl font-normal'>
            Your card balance is: <span className='text-[40px] font-bold text-posPrimaryColor'>$175</span>
          </h3>
        </div>

        <div className='flex gap-3 items-center w-full justify-center'>
        {/* <button className='max-w-[200px] mt-8 w-full py-3 px-3 bg-primary drop-shadow-md transition-all duration-300 text-center font-bold uppercase text-lg cursor-pointer hover:drop-shadow-xl'>
          New Order
        </button> */}
        <button className='max-w-[250px] mt-8 w-full py-3 px-3 bg-white border-2 drop-shadow-md transition-all duration-300 text-center font-bold uppercase text-lg cursor-pointer hover:drop-shadow-xl'>
          Add card balance
        </button>
        </div>
      </div>
    </>
  )
}

export default page
