const TabletTopBar = () => {
  return (
    <div className='flex justify-between items-center bg-gray-800 text-white p-4'>
      <div className='flex space-x-4'>
        {[...Array(8)].map((_, index) => (
          <div key={index} className='bg-gray-700 p-2 rounded cursor-pointer hover:bg-green-600'>
            Table {index + 1}
          </div>
        ))}
      </div>
      <button className='bg-green-600 px-4 py-2 rounded hover:bg-green-700'>New Table</button>
    </div>
  )
}

export default TabletTopBar
