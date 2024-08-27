'use client'

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import MobileButton from '@/components/MobileButton/MobileButton'

const Page = () => {
  const router = useRouter()

  const [userId, setUserId] = useState(null)

  useEffect(() => {
    // Extract id number from query parameters
    const queryId = new URLSearchParams(window.location.search).get('id')

    if (queryId) {
      setUserId(queryId)
    }
  }, [])

  return (
    <div className='w-full'>
      <h2 className='text-2xl md:text-[30px] text-left w-full text-titleColor'>Complete your profile</h2>
      <p className='text-lg md:text-[20px] mt-3 mb-3'>
        Complete your profile now to get bonus 20 points which can be redeemed for purchasing beer or food later.
      </p>

      <div className='flex flex-col justify-center gap-8'>
        <MobileButton onClick={() => router.push(`/mobile/complete-profile?id=${userId}`)}>
          Complete your profile
        </MobileButton>
        <button className='underline bg-transparent text-lg cursor-pointer' onClick={() => router.push('/mobile/home')}>
          Skip
        </button>
      </div>
    </div>
  )
}

export default Page
