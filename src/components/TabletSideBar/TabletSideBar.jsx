import Link from 'next/link'

const menuItems = [
  { name: 'Drinks', href: '/menu/drinks' },
  { name: 'Food', href: '/menu/food' },
  { name: 'Bills', href: '/menu/bills' },
  { name: 'Settings', href: '/menu/settings' }
]

const TabletSideBar = () => {
  return (
    <div className='w-28 bg-blue-900 text-white p-4 sticky top-0 h-full'>
      {menuItems.map(item => (
        <Link href={item.href}>
          <p className='block p-2 hover:bg-blue-700 rounded-md transition-colors'>{item.name}</p>
        </Link>
      ))}
    </div>
  )
}

export default TabletSideBar
