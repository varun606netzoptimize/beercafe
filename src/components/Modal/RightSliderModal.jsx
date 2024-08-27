import clsx from 'clsx'

const RightSliderModal = ({ isOpen = false, onClose = () => {}, children }) => {
  return (
    <>
      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-20"
          onClick={onClose}
        />
      )}

      <div
        className={clsx(
          'fixed inset-y-0 right-0 w-[80%] max-w-md bg-white shadow-lg z-30 rounded-[12px] drop-shadow-2xl transform transition-transform duration-300 ease-in-out',
          {
            'translate-x-0': isOpen,
            'translate-x-full': !isOpen
          }
        )}
      >
        <button
          className='absolute text-black text-lg z-40 bg-transparent top-4 right-4'
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </>
  )
}

export default RightSliderModal
