import Image from 'next/image'

const Page = () => {
  return (
    <div>
      <div>
        <div className='flex w-full'>
          <div className='py-4 px-4 bg-primary flex rounded-bl-[40px] items-center flex-1 gap-3'>
            <Image src='/images/mobile/location.png' alt='location' width={24} height={24} />
            <div className='text-titleColor text-sm'>
              <p>Your location</p>
              <p>CP67 Mall, Sector 67, Mohali</p>
            </div>
          </div>
          <div className='py-4 px-4 bg-black flex flex-col text-white rounded-br-[40px]'>
            <p className='text-xs'>Points balance</p>
            <p className='text-sm'>100.00</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
