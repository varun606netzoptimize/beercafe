import { useContext } from 'react'

import Image from 'next/image'

import Link from 'next/link'

import { AuthContext } from '@/context/AuthContext'
import LeftArrow from '@/@menu/svg/LeftArrow'
import BeerIcon from '@/@menu/svg/BeerIcon'

const TabletFooterCheckout = () => {
  const { cartItem } = useContext(AuthContext)

  return (
    <div className='fixed p-5 bg-white bottom-0 w-full max-w-[1020px] drop-shadow-md'>
      <div className='bg-white border-2 flex border-black'>
        <div className='py-5 flex-grow px-8 flex justify-between items-center'>
          {cartItem.length != 0 ? (
            <>
              <div className='flex items-center justify-between w-full max-w-[250px]'>
                <h2 className='text-xl'>{cartItem.name}</h2>
                <Image src={cartItem.image} className='object-contain' width={70} height={40} />
              </div>
              <div className='flex items-center justify-between w-full max-w-[170px]'>
                <div className='flex items-center gap-2 text-posPrimaryColors'>
                  <BeerIcon />
                  <h3 className='text-lg text-[#8a8a8a]'>{cartItem.size}</h3>
                </div>
                <h2 className='text-xl'>X{cartItem.value}</h2>
              </div>
              <div className='max-w-[150px]'>
                <h3 className='text-lg text-[#8a8a8a]'>${cartItem.regularPrice}</h3>
              </div>
            </>
          ) : (
            <p className='text-lg text-center w-full'>Your cart is empty</p>
          )}
        </div>
        {cartItem.length != 0 && (
          <Link href='/tablet/membership-card'>
            <div className='bg-posPrimaryColor p-3 flex flex-col cursor-pointer'>
              <h2 className='text-2xl font-bold'>${(cartItem.regularPrice * cartItem.quantity).toFixed(2)}</h2>
              <div className='flex w-full gap-8 justify-between items-center'>
                <p className='text-lg uppercase font-bold'>Checkout</p>
                <LeftArrow className='w-6 h-6' />
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

export default TabletFooterCheckout
