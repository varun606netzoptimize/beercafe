'use client'

import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '@/components/ui/carousel'
import { AuthContext } from '@/context/AuthContext'
import { useContext } from 'react'
import { useRef } from 'react'

const CoffeeCard = ({ name = 'beer', price = '100', color = 'white', onClick = () => {} }) => (
  <div className='py-4 px-2 bg-white rounded-2xl drop-shadow-xl cursor-pointer' onClick={onClick}>
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
    { name: 'Cafe au lait', price: 5.45, color: 'bg-yellow-200' },
    { name: 'Cafe au lait', price: 5.45, color: 'bg-yellow-200' },
    { name: 'Cafe Bombon', price: 2.22, color: 'bg-blue-200' },
    { name: 'Cafe au lait', price: 5.45, color: 'bg-yellow-200' },
    { name: 'Cafe Bombon', price: 2.22, color: 'bg-blue-200' },
    { name: 'Cafe au lait', price: 5.45, color: 'bg-yellow-200' }
  ]

  const itemsPerSlide = 8
  const totalSlides = Math.ceil(coffees.length / itemsPerSlide)

  const carouselRef = useRef(null)
  const { setCartItems, cartItems } = useContext(AuthContext)

  const handleAddToCart = coffee => {
    setCartItems(prevCartItems => [...prevCartItems, coffee])
    setCartItems([coffee])
    console.log(cartItems)
  }

  return (
    <div className='w-full'>
      <Carousel
        ref={carouselRef}
        className='w-full'
        onSelect={index => setActiveSlide(index)} // Update active slide on carousel change
      >
        <CarouselContent>
          {[...Array(totalSlides)].map((_, slideIndex) => (
            <CarouselItem key={slideIndex}>
              <div className='grid grid-cols-4 gap-4 pb-5'>
                {coffees.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((coffee, index) => (
                  <CoffeeCard key={index} {...coffee} onClick={() => handleAddToCart(coffee)} />
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className='mt-10'>
          <CarouselDots />
        </div>
      </Carousel>
    </div>
  )
}

export default Page
