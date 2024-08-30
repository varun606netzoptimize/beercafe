'use client'

import { useContext, useEffect, useState } from 'react'

import Link from 'next/link'

import axios from 'axios'
import { toast } from 'react-toastify'

import { ENDPOINT } from '@/endpoints'
import LeftArrow from '@/@menu/svg/LeftArrow'
import { AuthContext } from '@/context/AuthContext'

const Page = ({ params }) => {
  const { slug } = params
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch the cafe data based on slug
  const fetchData = async () => {
    setIsLoading(true)

    try {
      const response = await axios.get(`${ENDPOINT.SLUG_CAFE}/${slug}`)

      if (response.data) {
        console.log('API Response:', response.data)
        setData(response.data)

        // toast.success(`Data for ${slug} fetched successfully!`)
      } else {
        toast.error('No data found for this URL')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data. URL might be incorrect.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (slug) {
      fetchData()
    }
  }, [slug])

  return (
    <div className='h-screen w-full'>
      {/* Show loading message while cafe data is being fetched */}
      {isLoading && (
        <div className='flex items-center justify-center h-full'>
          <p>Loading...</p>
        </div>
      )}

      {/* Show the video once the cafe data is loaded */}
      {!isLoading && data && (
        <video className='w-full h-full object-cover' autoPlay muted>
          <source src="https://videocdn.cdnpk.net/videos/b66fe15c-3e6c-489f-82a3-2172d0b3092e/horizontal/previews/watermarked/large.mp4" type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Button to navigate, only shown after data is loaded */}
      {!isLoading && data && (
        <Link href= {`/tablet/cafe/${slug}/drinks`}>
          <div className='absolute bottom-8 right-8 z-20 bg-posPrimaryColor rounded-posButtonRadius py-3 px-5 cursor-pointer text-white drop-shadow-lg hover:drop-shadow-2xl'>
            <div className='flex items-center gap-2'>
              <p>Order Now</p>
              <LeftArrow className='w-6 h-6' />
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}

export default Page
