'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

const footerItems = [
  {
    icon: '/images/mobile/home.png',
    hoverIcon: '/images/mobile/home-yellow.png',
    title: 'Home',
    link: '/mobile/home'
  },
  {
    icon: '/images/mobile/beer.png',
    hoverIcon: '/images/mobile/beer-yellow.png',
    title: 'Beer',
    link: '#'
  },
  {
    icon: '/images/mobile/food.png',
    hoverIcon: '/images/mobile/food-yellow.png',
    title: 'Food',
    link: '#'
  },
  {
    icon: '/images/mobile/profile.png',
    hoverIcon: '/images/mobile/profile-yellow.png',
    title: 'Profile',
    link: '#'
  }
]

const MobileFooter = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <footer>
      <div className='w-full bg-baseColor flex py-3 px-10'>
        <div className='flex justify-between w-full'>
          {footerItems.map((item, index) => (
            <Link key={index} href={item.link}>
              <div
                className='flex flex-col items-center justify-center gap-1 cursor-pointer transition duration-300'
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Image
                  src={hoveredIndex === index ? item.hoverIcon : item.icon}
                  alt={item.title}
                  width={22}
                  height={22}
                  className='transition duration-400'
                />
                <p
                  className={`${
                    hoveredIndex === index ? 'text-primary' : 'text-white'
                  } text-[10px] transition duration-200`}
                >
                  {item.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default MobileFooter
