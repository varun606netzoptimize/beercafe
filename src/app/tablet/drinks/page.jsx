import Image from 'next/image'

const page = () => {
  return (
    <>
      <div className='flex flex-col relative max-w-[1024px]'>
        <header className='py-8 mx-auto w-full max-w-[1024px] text-black text-center bg-posPrimaryColor fixed top-0'>
          <h1 className='text-[50px] font-bold italic uppercase'>Chilled Beer Vending Machine</h1>
          <p className='text-xl font-medium mt-4'>Please select the beer of your choice from the items listed:</p>
        </header>
        <div className='fixed bottom-0 w-full max-w-[1024px]'>
          <div className='m-5 bg-white border flex border-black'>
            <div className='py-5 flex-grow  px-8 flex justify-between items-center'>
              <div className='flex items-center justify-between w-full max-w-[150px]'>
                <h2 className='text-xl'>Your Cart</h2>
                <Image />
              </div>
              <div className='flex items-center justify-between w-full max-w-[150px]'>
                <h3 className='text-lg text-[#8a8a8a]'>250 ml</h3>
                <h2 className='text-xl'>X1</h2>
              </div>
              <div className='max-w-[150px]'>
                <h3 className='text-lg text-[#8a8a8a]'>$1.50</h3>
              </div>
            </div>
            <div className='bg-posPrimaryColor p-3 flex flex-col'>
              <h2 className='text-2xl font-bold'>$1.50</h2>
              <div className='flex w-full gap-8 justify-between items-center'>
                <p className='text-lg uppercase font-bold'>Checkout</p>
                <p>-</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default page
