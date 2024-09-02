import { useContext } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { useRouter } from 'next/navigation'

import axios from 'axios'

import { AuthContext } from '@/context/AuthContext'
import LeftArrow from '@/@menu/svg/LeftArrow'
import BeerIcon from '@/@menu/svg/BeerIcon'
import { ENDPOINT } from '@/endpoints'

const TabletFooterCheckout = () => {
  const { cartItem, setOrderId } = useContext(AuthContext)
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      // Define your payload here
      const payload = {
        customerId: '66b5b48891105005829357ac',
        amount: Number((cartItem.regularPrice * cartItem.quantity).toFixed(2)),
        paymentMode: 'Credit Card',
        paymentStatus: 'PENDING',
        details: [
          {
            quantity: cartItem.value, // Update if necessary
            amount: cartItem.regularPrice,
            productVariationId: cartItem.id // Use the correct identifier
          }
        ]
      }

      // Make the API call
      const response = await axios.post(ENDPOINT.PLACE_ORDER, payload)

      if (response.data) {
        setOrderId(response.data.details[0].orderId)
        router.push('/tablet/membership-card')
      }
    } catch (error) {
      console.error('Error placing order:', error)
    }
  }

  const productImages = {
    Tuborg: '/images/mobile/Tuborg-Logo.png',
    Heinekenn : '/images/mobile/Heineken-Logo.png',
    Budweiser: '/images/mobile/Budweiser-Logo.png'
  }


  console.log(cartItem, 'cartItem');
  const imageSrc = productImages[cartItem.name] || '/images/mobile/Tuborg-Logo.png' // Fallback image

  return (
    <div className='fixed p-5 bg-white bottom-0 w-full max-w-[1020px] drop-shadow-md'>
      <div className='bg-white border-2 flex border-black'>
        <div className='py-5 flex-grow px-8 flex justify-between items-center'>
          {cartItem.length !== 0 ? (
            <>
              <div className='flex items-center justify-between w-full max-w-[200px] md:max-w-[250px]'>
                <h2 className='text-xl'>{cartItem.name}</h2>
                <Image src={imageSrc} className='object-contain' width={70} height={40} />
              </div>
              <div className='flex items-center justify-between w-full max-w-[170px]'>
                <div className='flex items-center gap-2 text-posPrimaryColors'>
                  <BeerIcon />
                  <div>
                  <h2 className='text-xl'>{cartItem.value} <span className='ml-2'> X 1 </span></h2>
                  </div>
                </div>
              </div>
              <div className='max-w-[150px]'>
                <h3 className='text-lg text-[#8a8a8a]'>${cartItem.regularPrice}</h3>
              </div>
            </>
          ) : (
            <p className='text-lg text-center w-full'>Your cart is empty</p>
          )}
        </div>
        {cartItem.length !== 0 && (
          <div className='bg-posPrimaryColor p-3 flex flex-col cursor-pointer' onClick={handleCheckout}>
            <h2 className='text-2xl font-bold'>${(cartItem.regularPrice).toFixed(2)}</h2>
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
