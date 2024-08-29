import { useContext } from 'react'

import Image from 'next/image'

import { AuthContext } from '@/context/AuthContext'
import LeftArrow from '@/@menu/svg/LeftArrow'

const TabletFooterCheckout = () => {
  const { cartItem } = useContext(AuthContext)

  console.log(cartItem, 'cartItem')

  return (
    <div className='fixed p-5 bg-white bottom-0 w-full max-w-[1020px]'>
      <div className='bg-white border-2 flex border-black'>
        <div className='py-5 flex-grow px-8 flex justify-between items-center'>
          {cartItem.length != 0 ? (
            <>
              <div className='flex items-center justify-between w-full max-w-[250px]'>
                <h2 className='text-xl'>{cartItem.name}</h2>
                <Image src={cartItem.image} className='object-contain' width={70} height={40} />
              </div>
              <div className='flex items-center justify-between w-full max-w-[160px]'>
                <h3 className='text-lg text-[#8a8a8a]'>{cartItem.size}</h3>
                <h2 className='text-xl'>X{cartItem.quantity}</h2>
              </div>
              <div className='max-w-[150px]'>
                <h3 className='text-lg text-[#8a8a8a]'>${cartItem.price}</h3>
              </div>
            </>
          ) : (
            <p className='text-lg text-center w-full'>Your cart is empty</p>
          )}
        </div>
        {cartItem.length != 0 && (
          <div className='bg-posPrimaryColor p-3 flex flex-col cursor-pointer'>
            <h2 className='text-2xl font-bold'>${(cartItem.price * cartItem.quantity).toFixed(2)}</h2>
            <div className='flex w-full gap-8 justify-between items-center'>
              <p className='text-lg uppercase font-bold'>Checkout</p>
              <LeftArrow className='w-6 h-6' />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TabletFooterCheckout
