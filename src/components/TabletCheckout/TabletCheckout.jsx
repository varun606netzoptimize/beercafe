'use client'

import { AuthContext } from '@/context/AuthContext'
import { useContext } from 'react'

const TabletCheckout = () => {
  const { cartItems } = useContext(AuthContext)

  // Calculate the subtotal by summing the prices of all items in the cart
  const subtotal = cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)

  // You can add any additional charges or taxes if needed
  const total = subtotal

  return (
    <div className='w-full flex-3 bg-white rounded-2xl shadow-itemsShadowCustom py-5 pb-8 sticky top-0 h-fit'>
      <h2 className='text-xl font-semibold px-5'>Table 1</h2>

      {cartItems.length > 0 ? (
        <div className='flex flex-col relative'>
          <div className='border-b my-4 w-full border-gray-400'></div>

          {/* Display Cart Items */}
          <div className='space-y-4 mb-10 px-5'>
            {cartItems.map((item, index) => (
              <div key={index} className='flex justify-between'>
                <span>
                  {item.name} <small>({item.quantity})</small>
                </span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className='border-b my-4 w-full border-gray-400'></div>

          {/* Subtotal */}
          <div className='space-y-4 px-5'>
            <div className='flex justify-between font-semibold'>
              <span>SubTotal</span>
              <span>${subtotal}</span>
            </div>
          </div>

          <div className='border-b my-4 w-full border-gray-400'></div>

          {/* Total */}
          <div className='space-y-4 mb-4 px-5'>
            <div className='flex justify-between font-semibold'>
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className='px-5 mt-8 h-full'>
            <button className='w-full transition-all duration-300 bg-green-500 cursor-pointer text-white p-3 rounded-full hover:bg-green-700'>
              Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className='px-5 mt-8'>
          <p className='text-center text-gray-500'>Please add items to the cart.</p>
        </div>
      )}
    </div>
  )
}

export default TabletCheckout
