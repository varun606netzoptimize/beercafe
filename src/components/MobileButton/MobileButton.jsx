import { clsx } from 'clsx'

const MobileButton = ({ children, style = '', ...rest }) => {
  return (
    <>
      {style !== 'secondary' ? (
        <button
          className={clsx(
            'w-full mt-10 flex items-center justify-center bg-black rounded-2xl h-[50px] cursor-pointer drop-shadow-md'
          )}
          {...rest}
        >
          <p className='text-primary text-xl'>{children}</p>
        </button>
      ) : (
        <button
          className={clsx(
            'w-full mt-10 flex items-center justify-center bg-primary rounded-2xl h-[50px] cursor-pointer drop-shadow-md'
          )}
          {...rest}
        >
          <p className='text-black text-xl font-semibold'>{children}</p>
        </button>
      )}
    </>
  )
}

export default MobileButton
