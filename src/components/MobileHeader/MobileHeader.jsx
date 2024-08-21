import Image from 'next/image'

const MobileHeader = () => {
  return (
    <div>
      <div className='flex w-full drop-shadow-md'>
        <div className='pt-4 pb-3 px-4 bg-primary flex rounded-bl-[20px] items-center flex-1 gap-2'>
          <Image src='/images/mobile/location.png' alt='location' width={24} height={24} />
          <div className='text-titleColor text-sm'>
            <p>Your location</p>
            <p className='font-semibold'>CP67 Mall, Sector 67, Mohali</p>
          </div>
        </div>
        <div className='pt-4 pb-3 px-5 bg-black flex flex-col justify-end text-white text-right rounded-br-[20px]'>
          <p className='text-xs'>Points balance</p>
          <p className='text-sm font-semibold'>100.00</p>
        </div>
      </div>
    </div>
  )
}

export default MobileHeader
