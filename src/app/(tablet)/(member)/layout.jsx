
import clsx from 'clsx'


const layout = ({ children }) => {
  return (
    <div className={clsx('relative w-full h-full overflow-hidden')}>
      {/* <div className='absolute -top-[1060px] -left-[420px] w-[1220px] h-[1180px] bg-[#F9CA5B] opacity-100 rounded-full drop-shadow-md'></div> */}
      {children}
      {/* <div className='absolute -bottom-[1050px] -right-[580px] w-[1200px] h-[1200px] bg-[#F9CA5B] opacity-100 rounded-full drop-shadow-[2px_4px_6px_rgba(0,0,0,1)]  '></div> */}
    </div>
  )
}

export default layout
