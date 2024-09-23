import TabletHeader from '@/components/TabletHeader/TabletHeader'

const Page = () => {
  var amount = '12.5';

  return (
    <>
      <TabletHeader>
        <h1 className='text-[30px] md:text-[38px] font-black' style={{ textShadow: '0px 2px 0px #ffffff' }}>
        Confirm Your Payment
        </h1>
        {/* <p className='text-xl max-w-[650px] font-bold mt-3'>
          Your balance is a bit low. Add some funds to enjoy your beer!
        </p> */}
      </TabletHeader>
      <div className='flex flex-col gap-10 mt-16 justify-center items-center w-full h-full text-center'>
        <div>
          <p className='text-2xl font-semibold text-gray-800'>
            You are about to pay <span className='text-posPrimaryColor font-black text-3xl'>${amount}</span>
          </p>
        </div>

        <div className='flex gap-4 mt-6'>
          <button
            className='bg-green-500 text-white px-6 py-3 rounded-2xl cursor-pointer font-bold text-lg hover:bg-green-600 transition-all'
          >
            Confirm Payment
          </button>

          <button
            className='bg-red-500 text-white px-6 py-3 rounded-2xl cursor-pointer font-bold text-lg hover:bg-red-600 transition-all'
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}

export default Page
