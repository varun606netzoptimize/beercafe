'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { name: 'Drinks', href: '/mobile/drinks' },
  { name: 'Food', href: '/mobile/food' },
  { name: 'Bills', href: '/mobile/bills' },
  { name: 'Settings', href: '/mobile/settings' }
]

const TabletSideBar = () => {
  const pathname = usePathname()

  console.log(pathname)

  return (
    <div className='w-fit pt-[82px] bg-baseColor text-textColor p-0 sticky top-0 h-full'>
      {menuItems.map((item, index) => (
        <Link key={index} href={item.href} className='group transition-all duration-300'>
          <div
            className={`flex flex-col transition-all duration-300 bg-baseColor text-sm items-center px-3 py-6  border-l-2 rounded-xs group-hover:bg-gray-800 ${pathname === item.href ? 'bg-gray-800 border-l-2 !border-primary text-primary ' : 'border-transparent'}`}
          >
            <p className={`transition-all duration-300 ${pathname === item.href ? 'text-primary' : ''}`}>{item.name}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default TabletSideBar
