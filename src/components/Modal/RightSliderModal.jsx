import clsx from 'clsx'

const RightSliderModal = ({ isOpen = false, onClose = () => {}, children }) => {
  return (
    <div
      className={clsx(
        'fixed inset-y-0 right-0 w-[80%] rounded-[12px] rounded-r-md drop-shadow-2xl  max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out',
        {
          'translate-x-0': isOpen,
          'translate-x-full': !isOpen
        }
      )}
    >
      <button className='absolute text-black text-lg z-30 bg-transparent top-4 right-4' onClick={onClose}>
        ✕
      </button>
      {children}
    </div>
  )
}

export default RightSliderModal
