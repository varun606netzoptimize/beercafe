'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useRef, useState } from 'react'

const CoffeeCard = ({ name = 'beer', price = '100', color = 'white' }) => (
  <div className='p-4 bg-white rounded-lg shadow-md'>
    <div className={`w-16 h-16 rounded-full ${color} mx-auto mb-2`}>{/* Heart icon here */}</div>
    <p className='text-center font-semibold'>{name}</p>
    <p className='text-center text-gray-600'>${price}</p>
  </div>
)

const Page = () => {
  const coffees = [
    { name: 'Cafe Bombon', price: 2.22, color: 'bg-blue-200' },
    { name: 'Cafe au lait', price: 5.45, color: 'bg-yellow-200' },
    { name: 'Cafe Bombon', price: 2.22, color: 'bg-blue-200' },
    { name: 'Cafe au lait', price: 5.45, color: 'bg-yellow-200' },
    { name: 'Cafe Bombon', price: 2.22, color: 'bg-blue-200' },
    { name: 'Cafe au lait', price: 5.45, color: 'bg-yellow-200' },
    { name: 'Cafe Bombon', price: 2.22, color: 'bg-blue-200' },
    { name: 'Cafe au lait', price: 5.45, color: 'bg-yellow-200' },
    { name: 'Cafe Bombon', price: 2.22, color: 'bg-blue-200' },
    { name: 'Cafe au lait', price: 5.45, color: 'bg-yellow-200' },
    { name: 'Cafe Bombon', price: 2.22, color: 'bg-blue-200' },
    { name: 'Cafe Bombon', price: 2.22, color: 'bg-blue-200' },
    { name: 'Cafe au lait', price: 5.45, color: 'bg-yellow-200' },
    { name: 'Cafe Bombon', price: 2.22, color: 'bg-blue-200' },
    { name: 'Cafe au lait', price: 5.45, color: 'bg-yellow-200' },
    { name: 'Cafe Bombon', price: 2.22, color: 'bg-blue-200' },
    { name: 'Cafe au lait', price: 5.45, color: 'bg-yellow-200' },
    { name: 'Cafe Bombon', price: 2.22, color: 'bg-blue-200' },
    { name: 'Cafe au lait', price: 5.45, color: 'bg-yellow-200' },
    { name: 'Cafe Bombon', price: 2.22, color: 'bg-blue-200' },
    { name: 'Cafe au lait', price: 5.45, color: 'bg-yellow-200' },
    { name: 'Cafe Bombon', price: 2.22, color: 'bg-blue-200' },
    { name: 'Cafe au lait', price: 5.45, color: 'bg-yellow-200' }
    // ... add all coffee items
  ]

  const itemsPerSlide = 8
  const totalSlides = Math.ceil(coffees.length / itemsPerSlide)

  const carouselRef = useRef(null)
  const [activeSlide, setActiveSlide] = useState(0)

  const handleSlideClick = index => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo(index)
      setActiveSlide(index)
    }
  }

  return (
    <Carousel
      ref={carouselRef}
      className='w-full'
      onSelect={index => setActiveSlide(index)} // Update active slide on carousel change
    >
      <CarouselContent>
        {[...Array(totalSlides)].map((_, slideIndex) => (
          <CarouselItem key={slideIndex}>
            <div className='grid grid-cols-4 gap-4'>
              {coffees.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((coffee, index) => (
                <CoffeeCard key={index} {...coffee} />
              ))}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className='flex justify-center w-full py-2 gap-2'>
        {[...Array(totalSlides)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-16 rounded-full cursor-pointer transition-colors ${
              activeSlide === index ? 'bg-blue-500' : 'bg-gray-200'
            }`}
            onClick={() => handleSlideClick(index)}
          />
        ))}
      </div>
    </Carousel>
  )
}

export default Page
