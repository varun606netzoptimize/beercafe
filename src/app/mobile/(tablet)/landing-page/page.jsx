import Image from 'next/image'

import Link from 'next/link'

import Logo from '@/@core/svg/Logo'

const Page = () => {
  return (
    <div
      className='flex items-center justify-center h-full bg-white relative overflow-hidden'
      style={{ background: 'linear-gradient(135deg, #fff 50%, #ffd580ad 50%)' }}
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
      <div className='absolute bottom-5 right-10 rounded-full bg-white px-3 pt-3 pb-2 cursor-pointer drop-shadow-sm hover:drop-shadow-lg'>
        <Link href='/mobile/slider-page'>
          <img
            src='/images/mobile/left-arrow.png'
            alt='App Logo'
            width={33}
            height={33}
            className='object-contain cursor-pointer rotate-180'
          />
        </Link>
      </div>
    </div>
  )
}

export default Page
