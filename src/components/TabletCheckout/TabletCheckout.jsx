const TabletCheckout = () => {
  return (
    <div className='w-full bg-white rounded-2xl shadow-lg py-4 sticky top-0 max-h-[400px] h-full'>
      <h2 className='text-xl font-semibold px-5 mb-4'>Table 1</h2>
      <div className='border-b my-4 w-full border-gray-400'></div>
      <div className='space-y-4 mb-10 px-5'>
        <div className='flex justify-between'>
          <span>Café Latte</span>
          <span>$3.20</span>
        </div>
      </div>
      <div className='border-b my-4 w-full border-gray-400'></div>

      <div className='space-y-4 mb-4 px-5'>
        <div className='flex justify-between font-semibold'>
          <span>SubTotal</span>
          <span>$3.20</span>
        </div>
        {/* <div className='flex justify-between'>
          <span>Tax</span>
          <span>$1.20</span>
        </div> */}
      </div>
      <div className='border-b my-4 w-full border-gray-400'></div>

      <div className='space-y-4 mb-4 px-5'>
        <div className='flex justify-between font-semibold'>
          <span>Total</span>
          <span>$3.20</span>
        </div>
      </div>

      <div className='px-5 mt-8'>
        <button className='w-full transition-all duration-300  bg-green-500 cursor-pointer text-white p-3 rounded-full hover:bg-green-700'>
          Checkout
        </button>
      </div>
    </div>
  )
}

export default TabletCheckout
