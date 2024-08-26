'use client'

import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '@/components/ui/carousel'
import { AuthContext } from '@/context/AuthContext'
import Image from 'next/image'
import { useContext } from 'react'
import { useRef } from 'react'

const CoffeeCard = ({ name = '', price = '', quantity = '', icon = '', onClick = () => {} }) => (
  <div
    className='py-4 px-2 max-w-[180px] bg-white rounded-2xl shadow-itemsShadowCustom cursor-pointer'
    onClick={onClick}
  >
    <div className={`w-16 h-16 rounded-full mx-auto mb-2`}>
      <Image src={icon} width={12} height={12} alt={icon} />
    </div>
    <p className='text-center text-sm font-semibold'>
      {name}
      <br />
      <span className='text-xs'>({quantity})</span>
    </p>
    <p className='text-center mt-2 text-gray-600'>${price}</p>
  </div>
)

const Page = () => {
  const beers = [
    { name: 'Heineken', price: 3.5, quantity: '330ml', icon: '' },
    { name: 'Heineken', price: 4.5, quantity: '500ml', icon: '' },
    { name: 'Heineken', price: 6.0, quantity: '750ml', icon: '' },
    { name: 'Budweiser', price: 3.0, quantity: '330ml', icon: '' },
    { name: 'Budweiser', price: 4.0, quantity: '500ml', icon: '' },
    { name: 'Budweiser', price: 5.5, quantity: '750ml', icon: '' },
    { name: 'Corona', price: 3.2, quantity: '330ml', icon: '' },
    { name: 'Corona', price: 4.2, quantity: '500ml', icon: '' },
    { name: 'Corona', price: 5.8, quantity: '750ml', icon: '' },
    { name: 'Guinness', price: 3.8, quantity: '330ml', icon: '' },
    { name: 'Guinness', price: 4.8, quantity: '500ml', icon: '' },
    { name: 'Guinness', price: 6.5, quantity: '750ml', icon: '' },
    { name: 'Stella Artois', price: 3.6, quantity: '330ml', icon: '' },
    { name: 'Stella Artois', price: 4.6, quantity: '500ml', icon: '' },
    { name: 'Stella Artois', price: 6.2, quantity: '750ml', icon: '' },
    { name: 'Carlsberg', price: 3.1, quantity: '330ml', icon: '' },
    { name: 'Carlsberg', price: 4.1, quantity: '500ml', icon: '' },
    { name: 'Carlsberg', price: 5.7, quantity: '750ml', icon: '' },
    { name: 'Beck’s', price: 3.3, quantity: '330ml', icon: '' },
    { name: 'Beck’s', price: 4.3, quantity: '500ml', icon: '' },
    { name: 'Beck’s', price: 5.9, quantity: '750ml', icon: '' },
    { name: 'Coors Light', price: 3.4, quantity: '330ml', icon: '' },
    { name: 'Coors Light', price: 4.4, quantity: '500ml', icon: '' },
    { name: 'Coors Light', price: 6.0, quantity: '750ml', icon: '' },
    { name: 'Miller', price: 3.2, quantity: '330ml', icon: '' },
    { name: 'Miller', price: 4.2, quantity: '500ml', icon: '' },
    { name: 'Miller', price: 5.8, quantity: '750ml', icon: '' },
    { name: 'Pilsner Urquell', price: 3.7, quantity: '330ml', icon: '' },
    { name: 'Pilsner Urquell', price: 4.7, quantity: '500ml', icon: '' },
    { name: 'Pilsner Urquell', price: 6.3, quantity: '750ml', icon: '' }
  ]

  const itemsPerSlide = 8
  const totalSlides = Math.ceil(beers.length / itemsPerSlide)

  const carouselRef = useRef(null)
  const { setCartItems, cartItems } = useContext(AuthContext)

  const handleAddToCart = beer => {
    setCartItems(prevCartItems => [...prevCartItems, beer])
    setCartItems([beer])
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
              <div className='grid grid-cols-4 gap-4 px-1 pb-5'>
                {beers.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((beer, index) => (
                  <CoffeeCard key={index} {...beer} onClick={() => handleAddToCart(beer)} />
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
