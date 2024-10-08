'use client'

import { useContext, useEffect, useState } from 'react'

import Link from 'next/link'

import Image from 'next/image'

import axios from 'axios'
import { toast } from 'react-toastify'

import { Loader2 } from 'lucide-react'

import { ENDPOINT } from '@/endpoints'
import RightArrow from '@/@menu/svg/RightArrow'
import { AuthContext } from '@/context/AuthContext'
import Logo from '@/@core/svg/Logo'
import BeerLoader from '@/components/BeerLoader/BeerLoader'

const Page = ({ params }) => {
  const { slug } = params
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const  { setCafeId } = useContext(AuthContext);

  // Fetch the cafe data based on slug
  const fetchData = async () => {
    setIsLoading(true)

    try {
      const response = await axios.get(`${ENDPOINT.SLUG_CAFE}/${slug}`)

      if (response.data) {
        console.log('API Response:', response.data);
        setCafeId(response.data.id)
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
    <div className='h-dvh w-full'>
      {/* Show loading message while cafe data is being fetched */}
      {isLoading && <BeerLoader />}

      {/* Show the video once the cafe data is loaded */}
      {!isLoading && data && (
        <video className='w-full h-full object-cover' autoPlay loop muted>
          <source src={data.videoUrl} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Button to navigate, only shown after data is loaded */}
      {!isLoading && data && (
        <Link href={`/cafe/${slug}/drinks`}>
          <div className='absolute bottom-8 right-8 z-20 bg-posPrimaryColor rounded-posButtonRadius py-3 px-5 cursor-pointer text-white drop-shadow-lg hover:drop-shadow-2xl'>
            <div className='flex items-center gap-3 font-bold'>
              <p>Order Now</p>
              <RightArrow className='w-5 h-5 text-white' />
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}

export default Page
