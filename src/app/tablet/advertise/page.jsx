import Link from 'next/link'

import LeftArrow from '@/@menu/svg/LeftArrow'

const Page = () => {
  return (
    <div className='h-screen w-full'>
      <video className='w-full h-full object-fill' autoPlay muted>
        <source src='/videos/beer-video.mp4' type='video/mp4' />
        Your browser does not support the video tag.
      </video>
      <Link href='/tablet/drinks'>
        <div className='absolute bottom-8 right-8 z-20 bg-posPrimaryColor rounded-posButtonRadius py-3 px-5 cursor-pointer text-white drop-shadow-lg hover:drop-shadow-2xl'>
          <div className='flex items-center gap-2'>
            <p>Order Now</p>
            <LeftArrow className='w-6 h-6' />
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Page
