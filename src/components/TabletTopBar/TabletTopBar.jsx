import clsx from 'clsx'

const TabletTopBar = () => {
  return (
    <div className='flex justify-between pr-8 flex-wrap items-center drop-shadow-xl bg-baseColor text-white'>
      <div className='flex flex-wrap'>
        {[...Array(4)].map((_, index) => (
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
                index === 0 ? 'border-b-2 border-posPrimaryColor' : 'border-transparent'
              )}
            >
              <p className='text-sm'>Table</p>
              <h2 className='font-medium'>0{index + 1}</h2>
            </div>
          </div>
        ))}
      </div>
      <button className='bg-posPrimaryColor text-black cursor-pointer px-3 py-3 rounded-posButtonRadius transition-all duration-300 border-2 hover:border-posPrimaryColor hover:bg-white flex items-center gap-1'>
        <span className='text-[24px] leading-3'>+</span> New Table
      </button>
    </div>
  )
}

export default TabletTopBar
