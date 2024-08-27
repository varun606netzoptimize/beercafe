'use client'

import { useContext, useState, useRef } from 'react'

import Image from 'next/image'

import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '@/components/ui/carousel'
import { AuthContext } from '@/context/AuthContext'

const CoffeeCard = ({
  id = '',
  name = '',
  price = '',
  quantity = '',
  icon = '',
  onClick = () => {},
  isSelected = false
}) => (
  <div
    className={`py-4 px-2 max-w-[160px] bg-white border-2 rounded-2xl shadow-itemsShadowCustom cursor-pointer ${
      isSelected ? 'border-2 border-posPrimaryColor' : 'border-transparent'
    }`}
    onClick={onClick}
  >
    <div className={`w-16 h-16 rounded-full mx-auto mb-2`}>
      <Image src={icon} className='object-contain' width={64} height={64} alt={icon} />
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
    // { id: 1, name: 'Heineken', price: 3.5, quantity: '330ml', icon: '/images/mobile/beers/heineken.jpg' },
    // { id: 2, name: 'Heineken', price: 4.5, quantity: '500ml', icon: '/images/mobile/beers/heineken.jpg' },
    // { id: 3, name: 'Heineken', price: 6.0, quantity: '750ml', icon: '/images/mobile/beers/heineken.jpg' },
    // { id: 4, name: 'Budweiser', price: 3.0, quantity: '330ml', icon: '/images/mobile/beers/budweiser.jpg' },
    // { id: 5, name: 'Budweiser', price: 4.0, quantity: '500ml', icon: '/images/mobile/beers/budweiser.jpg' },
    // { id: 6, name: 'Budweiser', price: 5.5, quantity: '750ml', icon: '/images/mobile/beers/budweiser.jpg' },
    // { id: 7, name: 'Corona', price: 3.2, quantity: '330ml', icon: '/images/mobile/beers/corona.jpg' },
    // { id: 8, name: 'Corona', price: 4.2, quantity: '500ml', icon: '/images/mobile/beers/corona.jpg' },
    // { id: 9, name: 'Corona', price: 5.8, quantity: '750ml', icon: '/images/mobile/beers/corona.jpg' },
    { id: 10, name: 'Guinness', price: 3.8, quantity: '330ml', icon: '/images/mobile/beers/guinness.jpg' },
    { id: 11, name: 'Guinness', price: 4.8, quantity: '500ml', icon: '/images/mobile/beers/guinness.jpg' },
    { id: 12, name: 'Guinness', price: 6.5, quantity: '750ml', icon: '/images/mobile/beers/guinness.jpg' },

    // { id: 13, name: 'Stella Artois', price: 3.6, quantity: '330ml', icon: '/images/mobile/beers/stella-artois.jpg' },
    // { id: 14, name: 'Stella Artois', price: 4.6, quantity: '500ml', icon: '/images/mobile/beers/stella-artois.jpg' },
    // { id: 15, name: 'Stella Artois', price: 6.2, quantity: '750ml', icon: '/images/mobile/beers/stella-artois.jpg' },
    { id: 16, name: 'Carlsberg', price: 3.1, quantity: '330ml', icon: '/images/mobile/beers/carlsberg.jpg' },
    { id: 17, name: 'Carlsberg', price: 4.1, quantity: '500ml', icon: '/images/mobile/beers/carlsberg.jpg' },
    { id: 18, name: 'Carlsberg', price: 5.7, quantity: '750ml', icon: '/images/mobile/beers/carlsberg.jpg' },
    { id: 19, name: 'Beck’s', price: 3.3, quantity: '330ml', icon: '/images/mobile/beers/becks.jpg' },
    { id: 20, name: 'Beck’s', price: 4.3, quantity: '500ml', icon: '/images/mobile/beers/becks.jpg' },
    { id: 21, name: 'Beck’s', price: 5.9, quantity: '750ml', icon: '/images/mobile/beers/becks.jpg' },
    { id: 22, name: 'Coors Light', price: 3.4, quantity: '330ml', icon: '/images/mobile/beers/cors-light.jpg' },
    { id: 23, name: 'Coors Light', price: 4.4, quantity: '500ml', icon: '/images/mobile/beers/cors-light.jpg' },
    { id: 24, name: 'Coors Light', price: 6.0, quantity: '750ml', icon: '/images/mobile/beers/cors-light.jpg' },
    { id: 25, name: 'Miller', price: 3.2, quantity: '330ml', icon: '/images/mobile/beers/miller.jpg' },
    { id: 26, name: 'Miller', price: 4.2, quantity: '500ml', icon: '/images/mobile/beers/miller.jpg' },
    { id: 27, name: 'Miller', price: 5.8, quantity: '750ml', icon: '/images/mobile/beers/miller.jpg' },
    { id: 28, name: 'Pilsner Urquell', price: 3.7, quantity: '330ml', icon: '/images/mobile/beers/pilsner.jpg' },
    { id: 29, name: 'Pilsner Urquell', price: 4.7, quantity: '500ml', icon: '/images/mobile/beers/pilsner.jpg' },
    { id: 30, name: 'Pilsner Urquell', price: 6.3, quantity: '750ml', icon: '/images/mobile/beers/pilsner.jpg' }
  ]

  const itemsPerSlide = 8
  const totalSlides = Math.ceil(beers.length / itemsPerSlide)

  const carouselRef = useRef(null)
  const { setCartItems } = useContext(AuthContext)
  const [selectedBeerId, setSelectedBeerId] = useState(null) // State to keep track of the selected card by ID

  const handleAddToCart = beer => {
    setSelectedBeerId(beer.id) // Set the selected card by ID
    // setCartItems(prevCartItems => [...prevCartItems, beer])
    setCartItems([beer])
  }

  return (
    <div className='w-full max-w-[650px] md:max-w-full'>
      <Carousel
        ref={carouselRef}
        className='w-fit'
        onSelect={index => setActiveSlide(index)} // Update active slide on carousel change
      >
        <CarouselContent>
          {[...Array(totalSlides)].map((_, slideIndex) => (
            <CarouselItem key={slideIndex}>
              <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-4 px-1 pb-5'>
                {beers.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((beer, index) => (
                  <CoffeeCard
                    key={beer.id}
                    {...beer}
                    onClick={() => handleAddToCart(beer)}
                    isSelected={selectedBeerId === beer.id} // Apply selected style based on ID
                  />
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
