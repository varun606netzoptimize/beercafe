import Image from 'next/image'

import HomeBeerLogo from '@/@core/svg/HomeBeerLogo'
import MobileHeader from '@/components/MobileHeader/MobileHeader'

const sampleImages = [
  {
    link: '/images/mobile/sample-banner.png'
  },
  {
    link: '/images/mobile/sample-banner-2.png'
  },
  {
    link: '/images/mobile/sample-banner-2.png'
  }
]

const Page = () => {
  return (
    <div>
      <MobileHeader />
      <div className='mt-10 px-5 pb-10'>
        <div className='flex items-center gap-5'>
          <HomeBeerLogo />
          <div>
            <h3 className='text-xl font-light'>Cheers Peter,</h3>
            <h2 className='text-[26px]'>Welcome to the beer cafe</h2>
          </div>
        </div>
        <div className='mt-10'>
          <div className='w-full rounded-[10px]  py-4 px-3 flex items-center justify-between shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
            <Image src='/images/mobile/offer.png' alt='offer' width={36} height={36} />
            <div className='flex flex-col '>
              <h2 className='text-primary text-2xl'>Unlock 20 reward points now!!!</h2>
              <p className='text-bases'>Complete your profile today and start sipping!</p>
            </div>
          </div>
        </div>
        <div className='mt-9 flex flex-col gap-6 justify-center items-center'>
          {sampleImages.map((item, index) => (
            <div key={index} className='w-fit drop-shadow-md mx-auto'>
              <Image src={item.link} className='object-cover' alt='banner' width={397} height={169} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Page
