import Image from 'next/image'

import Logo from '@/@core/svg/Logo'

const Page = () => {
  return (
    <div
      className='flex items-center justify-center h-screen bg-white relative overflow-hidden'
      style={{ background: 'linear-gradient(138deg, #fff 50%, #ffd580ad 50%)' }}
    >
      {/* Top Yellow Semi-circle */}
      <div className='absolute top-0 right-0 h-[300px] w-[300px] bg-[#FFC85D] rounded-full translate-x-[50%] translate-y-[-50%] hidden' />

      {/* Bottom Yellow Semi-circle */}
      <div className='absolute bottom-0 left-0 h-[300px] w-[300px] bg-[#FFC85D] rounded-full translate-x-[-50%] translate-y-[50%] hidden' />

      {/* Center Content */}
      <div className='text-center'>
        {/* Beer Icon */}
        <Image src='/images/mobile/appLogo.png' alt='Beer Icon' width={250} height={260} />
      </div>
    </div>
  )
}

export default Page
