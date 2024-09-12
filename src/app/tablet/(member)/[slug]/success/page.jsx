'use client'

import { useContext, useEffect, useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { CircularProgress, Box } from '@mui/material'
import TimerIcon from '@mui/icons-material/Timer'

import TabletHeader from '@/components/TabletHeader/TabletHeader'
import { AuthContext } from '@/context/AuthContext'
import Link from '@/components/Link'

const Page = ({ params }) => {
  const { slug } = params
  const router = useRouter()

  const { remainingBalance } = useContext(AuthContext)

  const currentOrder = JSON.parse(window.localStorage.getItem('currentOrder'))

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress => prevProgress + 1)
    }, 200)

    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (progress >= 200) {
      router.push(`/tablet/cafe/${slug}/drinks`)
    }
  }, [progress])

  return (
    <>
      <TabletHeader>
        <h1 className='text-[30px] md:text-[38px] font-black' style={{ textShadow: '0px 2px 0px #ffffff' }}>
          Cheers!
        </h1>
        <p className='text-xl max-w-[650px] font-bold mt-3'>
          Your perfectly chilled beer is ready to be enjoyed. <br /> Grab your glass and take that first delicious sip!
        </p>
      </TabletHeader>
      <div className='flex flex-col gap-0 mt-16 justify-center items-center w-full h-full text-center'>
        <div className='flex flex-col justify-center items-center gap-2'>
          <Image
            src='/images/mobile/beer-pour.png'
            alt='beer'
            className='rounded-[12px] max-h-[300px] md:max-h-full w-11/12 md:w-full drop-shadow-lg object-cover'
            width={900}
            height={500}
          />
        </div>
        <p className='text-xl max-w-[650px] font-bold mt-3'>Your Balance ${Math.round(remainingBalance)}</p>

        <div className='w-full flex justify-end px-16 pt-10'>
        <div className='flex items-center gap-2'>
          <Link href={`/tablet/cafe/${slug}/drinks`}>
            <p className='text-[20px] md:text-[20px] font-black'>Go to home</p>
          </Link>
          <Box position='relative' display='inline-flex'>
            <CircularProgress variant='determinate' className='text-posPrimaryColor' value={progress} color={'inherit'} />
            <Box position='absolute' top='58%' left='50%' sx={{ transform: 'translate(-50%, -50%)' }}>
              <TimerIcon color='action' className='text-posPrimaryColor' />
            </Box>
          </Box>
        </div>
        </div>
      </div>
    </>
  )
}

export default Page
