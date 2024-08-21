import Image from 'next/image'
import Link from 'next/link'

const footerItems = [
  {
    icon: '/images/mobile/home.png',
    title: 'Home',
    link: '#'
  },
  {
    icon: '/images/mobile/beer.png',
    title: 'Beer',
    link: '#'
  },
  {
    icon: '/images/mobile/food.png',
    title: 'Food',
    link: '#'
  },
  {
    icon: '/images/mobile/profile.png',
    title: 'Profile',
    link: '#'
  }
]

const MobileFooter = () => {
  return (
    <footer>
      <div className='w-full bg-black flex py-3 px-10'>
        <div className='flex justify-between w-full'>
          {footerItems.map((item, index) => (
            <Link key={index} href={item.link}>
              <div className='flex flex-col items-center justify-center gap-1 cursor-pointer'>
                <Image src={item.icon} alt={item.title} width={22} height={22} />
                <p className='text-white text-[10px]'>{item.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default MobileFooter
