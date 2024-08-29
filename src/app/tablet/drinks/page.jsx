import Image from 'next/image'

const page = () => {
  return (
    <>
      <div className='flex flex-col relative max-w-[1024px]'>
        <header className='py-6 mx-auto w-full max-w-[1024px] text-black text-center bg-posPrimaryColor fixed top-0'>
          <h1 className='text-[50px] font-bold italic uppercase' style={{ textShadow: '0px 2px 0px #ffffff' }}>
            Chilled Beer Vending Machine
          </h1>
          <p className='text-xl font-medium mt-2'>Please select the beer of your choice from the items listed:</p>
        </header>
        <div className='py-12 px-10 mt-[130px]'>
          <div className='flex justify-start w-full items-center gap-14 pb-8 pl-5  border-b border-[#c4c4c4]'>
            <Image src='/images/mobile/corona.png' className='object-contain' width={150} height={100} />
            <div className='flex gap-6 w-full'>
              <div className='max-w-[130px] w-full border-2 border-[#c4c4c4] uppercase flex flex-col cursor-pointer'>
                <div className='py-4 pl-5'>
                  <p className='text-2xl font-bold'>$2.50</p>
                  <p className='text-lg text-[#b1b1b1] font-medium'>750ml</p>
                </div>
                <div className='bg-posPrimaryColor py-1 px-3 pl-5 w-full flex justify-between text-lg font-bold'>
                  <p>SELECT</p>
                  <p>+</p>
                </div>
              </div>
              <div className='max-w-[130px] w-full border-2 border-[#c4c4c4] uppercase flex flex-col cursor-pointer'>
                <div className='py-4 pl-5'>
                  <p className='text-2xl font-bold'>$2.50</p>
                  <p className='text-lg text-[#b1b1b1] font-medium'>750ml</p>
                </div>
                <div className='bg-posPrimaryColor py-1 px-3 pl-5 w-full flex justify-between text-lg font-bold'>
                  <p>SELECT</p>
                  <p>+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='fixed bottom-0 w-full max-w-[1024px]'>
          <div className='m-5 bg-white border-2 flex border-black'>
            <div className='py-5 flex-grow  px-8 flex justify-between items-center'>
              <div className='flex items-center justify-between w-full max-w-[270px]'>
                <h2 className='text-xl'>Your Cart</h2>
                <Image src='/images/mobile/corona.png' className='object-contain' width={70} height={40} />
              </div>
              <div className='flex items-center justify-between w-full max-w-[160px]'>
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
