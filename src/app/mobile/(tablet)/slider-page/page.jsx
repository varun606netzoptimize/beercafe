'use client'

import * as React from 'react'

import Image from 'next/image'

import Autoplay from 'embla-carousel-autoplay'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'

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
    }
  ]

  return (
    <div className='h-screen'>
      <Card className="border-0">

        <CardContent className='flex aspect-square items-center p-0 justify-center relative h-screen w-full'>
          <div className='absolute top-5 left-4 z-20 rounded-full bg-white py-5 px-6 cursor-pointer drop-shadow-lg'>
            <Image src='/images/mobile/appLogo.png' alt='Beer Icon' width={70} height={80} />
          </div>
          <div className=''>
            <Carousel
              opts={{
                loop: true
              }}
              plugins={[plugin.current]}
              className='w-full max-w-full'
            >
              <CarouselContent>
                {sliderImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className='w-full h-screen'>
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
