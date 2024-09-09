import { useContext, useState } from 'react'

import Image from 'next/image'

import { useRouter } from 'next/navigation'

import axios from 'axios'

import { Loader2 } from 'lucide-react'

import { AuthContext } from '@/context/AuthContext'
import RightArrow from '@/@menu/svg/RightArrow'
import BeerIcon from '@/@menu/svg/BeerIcon'
import { ENDPOINT } from '@/endpoints'

const TabletFooterCheckout = ({ slug }) => {
  const { cartItem, setOrderId } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      // Define your payload here
      const payload = {
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
        const orderId = response.data.details[0].orderId
        const amount = response.data.amount

        setOrderId(orderId)

        // Save the orderId in localStorage
        window.localStorage.setItem('currentOrder', JSON.stringify({ orderId, amount }))

        // router.push('/tablet/craft-keg/membership-card')
        router.push(`/tablet/${slug}/membership-card`)
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Error placing order:', error)
      setIsLoading(false)
    }
  }

  const productImages = {
    Tuborg: '/images/mobile/Tuborg-Logo.png',
    Heinekenn: '/images/mobile/Heineken-Logo.png',
    Budweiser: '/images/mobile/Budweiser-Logo.png',
    Corona: '/images/mobile/beer-corona.png',
    Miller: '/images/mobile/beer-miller.png',
    Guinness: '/images/mobile/Guinness-logo.png'
  }

  const imageSrc = productImages[cartItem.name] || '/images/mobile/Tuborg-Logo.png' // Fallback image

  return (
    <div className='fixed p-5 bg-white bottom-0 w-full max-w-[1020px] drop-shadow-md'>
      <div className='bg-white border-2 flex border-black'>
        <div className='py-5 flex-grow px-8 flex justify-between items-center'>
          {cartItem.length !== 0 ? (
            <>
              <div className='flex items-center justify-between w-fit'>
                {/* <h2 className='text-xl font-bold'>{cartItem.name}</h2> */}
                <Image src={imageSrc} className='object-contain' width={80} height={40} />
              </div>
              <div className='flex items-center justify-between w-full max-w-[170px]'>
                <div className='flex items-center gap-2 text-posPrimaryColors'>
                  <BeerIcon />
                  <div className='mt-1'>
                    <h2 className='text-xl font-black'>
                      {cartItem.value} <span className='ml-2 font-bold'> X 1 </span>
                    </h2>
                  </div>
                </div>
              </div>
              <div className='max-w-[150px]'>
                <h3 className='text-lg text-[#8a8a8a] font-bold'>${cartItem.regularPrice}</h3>
              </div>
            </>
          ) : (
            <p className='text-lg text-center w-full font-bold'>Your cart is empty</p>
          )}
        </div>
        {cartItem.length !== 0 && (
          <button
            disabled={isLoading}
            className='bg-posPrimaryColor p-3 pl-5 flex flex-col cursor-pointer text-black'
            onClick={handleCheckout}
          >
            <h2 className='text-2xl font-bold'>${cartItem.regularPrice.toFixed(2)}</h2>
            <div className='flex w-full gap-7 justify-between items-center'>
              <p className='text-lg uppercase font-black'>Checkout</p>
              {isLoading ? (
                <Loader2 className='animate-spin' />
              ) : (
                <RightArrow className='w-5 h-5   text-black' color='#000' />
              )}
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

export default TabletFooterCheckout
