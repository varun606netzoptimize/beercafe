import clsx from 'clsx'

const TabletTopBar = () => {
  return (
    <div className='flex justify-between pr-8 items-center drop-shadow-xl bg-baseColor text-white'>
      <div className='flex'>
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className={clsx(
              'hover:bg-gray-700 group transition-all duration-300 cursor-pointer',
              index == 0 ? 'bg-gray-700 ' : ''
            )}
          >
            <div
              className={clsx(
                'flex flex-col items-center px-8 py-4 transition-all duration-300  ',
                index === 0 ? 'border-b-2 border-primary' : 'border-transparent'
              )}
            >
              <p className='text-sm'>Table</p>
              <h2 className='font-medium'>0{index + 1}</h2>
            </div>
          </div>
        ))}
      </div>
      <button className='bg-primary cursor-pointer px-4 py-2 rounded-full transition-all duration-300 border-2 hover:border-primary hover:bg-white'>
        New Table
      </button>
    </div>
  )
}

export default TabletTopBar
