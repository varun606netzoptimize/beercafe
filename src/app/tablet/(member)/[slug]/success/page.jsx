'use client'

import { useContext } from 'react'

import { useRouter } from 'next/navigation'

import Image from 'next/image'

import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import TabletHeader from '@/components/TabletHeader/TabletHeader'
import { AuthContext } from '@/context/AuthContext'
import Link from '@/components/Link'

const Page = ({ params }) => {
  const { slug } = params
  const router = useRouter()

  const { remainingBalance } = useContext(AuthContext)

  const currentOrder = JSON.parse(window.localStorage.getItem('currentOrder'))

  const handleComplete = () => {
    router.push(`/tablet/cafe/${slug}/drinks`)
  }

  return (
    <>
      <TabletHeader>
        <h1 className='text-[30px] md:text-[38px] font-black' style={{ textShadow: '0px 2px 0px #ffffff' }}>
          Cheers to Refreshment!
        </h1>
        <p className='text-xl max-w-[650px] font-bold mt-3'>Your ice-cold beer is waiting. Enjoy it!</p>
      </TabletHeader>
      <div className='flex flex-col gap-0 mt-16 justify-center items-center w-full h-full text-center'>
        <div className='flex flex-col justify-center items-center gap-2'>
          <div className='flex flex-col justify-center  w-full h-[300px] items-center relative'>
            <CountdownCircleTimer
              isPlaying
              duration={30}
              colors={['#F7B801', '#F7B801', '#F7B801', '#F7B801']}
              colorsTime={[20, 10, 5, 0]}
              onComplete={handleComplete}
            >
              {({ remainingTime }) => <span className='text-2xl font-bold'>{remainingTime}</span>}
            </CountdownCircleTimer>
            <div className='absolute inset-0 flex justify-center -z-10 items-center'>
              <div className='relative'>
                <Image
                  src='/images/mobile/beer-pour.png'
                  className='rounded-2xl'
                  alt='Beer mug'
                  width={300}
                  height={300}
                />
                <div className='absolute inset-0 bg-black opacity-20 rounded-2xl z-10' />
              </div>
            </div>
          </div>
          <div className='w-full flex flex-col gap-10 justify-center px-16 pt-10'>
            <p className='text-xl max-w-[650px] font-bold mt-6'>Your Balance: ${Math.round(remainingBalance)}</p>
            <div className='flex items-center gap-2'>
              <Link href={`/tablet/cafe/${slug}/drinks`}>
                <button className='bg-yellow-500 cursor-pointer text-white font-bold text-lg py-3 px-5 rounded'>
                  Explore More Drinks
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
