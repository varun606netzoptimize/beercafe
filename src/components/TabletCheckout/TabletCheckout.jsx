const TabletCheckout = () => {
  return (
    <div className='w-80 bg-white shadow-lg p-6 sticky top-0 h-full'>
      <h2 className='text-xl font-semibold mb-4'>Table 1</h2>
      <div className='space-y-4 mb-6'>
        {/* Example order items */}
        <div className='flex justify-between'>
          <span>Café Latte</span>
          <span>$3.20</span>
        </div>
        <div className='flex justify-between'>
          <span>Espresso</span>
          <span>$1.00</span>
        </div>
      </div>
      <button className='w-full bg-green-600 text-white p-3 rounded hover:bg-green-700'>Checkout</button>
    </div>
  )
}

export default TabletCheckout
