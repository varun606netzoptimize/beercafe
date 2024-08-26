import Link from 'next/link'

const menuItems = [
  { name: 'Drinks', href: '/mobile/drinks' },
  { name: 'Food', href: '/mobile/food' },
  { name: 'Bills', href: '/mobile/bills' },
  { name: 'Settings', href: '/mobile/settings' }
]

const TabletSideBar = () => {
  return (
    <div className='w-28 bg-baseColor text-textColor p-4 sticky top-0 h-full'>
      {menuItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <p
            className={`block p-2 rounded-md transition-colors ${
              item.name === 'Beer'
                ? 'bg-secondary text-titleColor hover:bg-primary hover:text-baseColor'
                : 'hover:bg-primary hover:text-baseColor'
            }`}
          >
            {item.name}
          </p>
        </Link>
      ))}
    </div>
  )
}

export default TabletSideBar
