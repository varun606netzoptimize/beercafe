'use client'

import BillIcon from '@/@menu/svg/BillIcon'
import DrinksIcon from '@/@menu/svg/DrinksIcon'
import FoodIcon from '@/@menu/svg/FoodIcon'
import SettingsIcon from '@/@menu/svg/SettingsIcon'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { name: 'Drinks', href: '/mobile/drinks', icon: <DrinksIcon /> },
  { name: 'Food', href: '#', icon: <FoodIcon /> },
  { name: 'Bills', href: '#', icon: <BillIcon /> },
  { name: 'Settings', href: '#', icon: <SettingsIcon /> }
]

const TabletSideBar = () => {
  const pathname = usePathname()

  console.log(pathname)

  return (
    <div className='w-fit pt-[82px] bg-baseColor drop-shadow-2xl text-textColor p-0 sticky top-0 h-full'>
      {menuItems.map((item, index) => (
        <Link key={index} href={item.href} className='group transition-all duration-300'>
          <div
            className={`flex flex-col transition-all gap-1 duration-300 bg-baseColor text-sm items-center px-3 py-5  border-l-2 rounded-xs group-hover:bg-gray-800 ${pathname === item.href ? 'bg-gray-800 border-l-2 !border-primary text-primary ' : 'border-transparent'}`}
          >
            {item.icon}
            <p className={`transition-all duration-300 ${pathname === item.href ? 'text-primary' : ''}`}>{item.name}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default TabletSideBar
