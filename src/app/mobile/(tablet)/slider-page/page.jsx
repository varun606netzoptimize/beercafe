'use client'

import * as React from 'react'

import Image from 'next/image'

import Link from 'next/link'

import Autoplay from 'embla-carousel-autoplay'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import LeftArrow from '@/@menu/svg/LeftArrow'

const Page = () => {
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: false }))

  const sliderImages = [
    {
      src: '/images/mobile/jpeg/beer1.jpg',
      alt: 'Beer 1'
    },
    {
      src: '/images/mobile/jpeg/beer2.jpg',
      alt: 'Beer 2'
    },
    {
      src: '/images/mobile/jpeg/beer3.jpg',
      alt: 'Beer 3'
    },
    {
      src: '/images/mobile/jpeg/beer4.jpg',
      alt: 'Beer 4'
    },
    {
      src: '/images/mobile/jpeg/beer5.jpg',
      alt: 'Beer 5'
    },
    {
      src: '/images/mobile/jpeg/beer6.jpg',
      alt: 'Beer 6'
    }
  ]

  return (
    <div className='h-full min-[800px]:h-screen'>
      <Card className='border-0 h-full'>
        <CardContent className='flex aspect-square items-center p-0 justify-center relative h-full w-full'>
          <div>
            <div className='absolute top-0 left-0 h-[500px] w-[500px] bg-[#fff] rounded-full translate-x-[-50%] translate-y-[-50%] z-20 drop-shadow-2xl'></div>
            <Image
              src='/images/mobile/appLogo.png'
              className='absolute z-30 top-8 left-10'
              alt='Beer Icon'
              width={120}
              height={130}
            />
          </div>
          <Carousel
            opts={{
              loop: true
            }}
            plugins={[plugin.current]}
            className='w-full max-w-full h-full'
          >
            <CarouselContent className='h-full'>
              {sliderImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className='w-full h-full'>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      className='object-cover w-full h-full'
                      width={1024}
                      height={1024}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* <CarouselPrevious /> */}
            {/* <CarouselNext /> */}
          </Carousel>
          <div>
            {/* <div className='absolute bottom-0 right-0 h-[300px] w-[300px] bg-[#FFC85D] rounded-full translate-x-[50%] translate-y-[50%] z-20'></div> */}
            <Link href='/mobile/drinks'>
              <div className='absolute bottom-8 right-8 z-20 bg-posPrimaryColor rounded-posButtonRadius py-3 px-5 cursor-pointer text-white drop-shadow-lg hover:drop-shadow-2xl'>
                <div className='flex items-center gap-2'>
                  <p>Order Now</p>
                  <LeftArrow className='w-6 h-6' />
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
