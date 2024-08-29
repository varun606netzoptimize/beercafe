import { Inter } from 'next/font/google'

import clsx from 'clsx'

const inter = Inter({ subsets: ['latin'] })

const TabletLayout = ({ children }) => {
  return (
    <div
      className={clsx(
        'max-w-[1024px] relative h-full w-full mx-auto border-r border-l border-[#cdcdcd]',
        inter.className
      )}
    >
      {children}
    </div>
  )
}

export default TabletLayout
