import Link from 'next/link'

const menuItems = [
  { name: 'Drinks', href: '/mobile/drinks' },
  { name: 'Food', href: '/mobile/food' },
  { name: 'Bills', href: '/mobile/bills' },
  { name: 'Settings', href: '/mobile/settings' }
]

const TabletSideBar = () => {
  return (
    <div className='w-fit pt-24 bg-baseColor text-textColor p-0 sticky top-0 h-full'>
      {menuItems.map((item, index) => (
        <Link key={index} href={item.href} className='group transition-all duration-300'>
          <div className='flex flex-col items-center transition-all duration-300 px-4 py-6 hover:bg-gray-800 border-transparent border-l-2 rounded-xs group-hover:border-primary'>
            <p>{item.name}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default TabletSideBar
