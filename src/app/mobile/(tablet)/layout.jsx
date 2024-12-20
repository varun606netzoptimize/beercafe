import { Inter } from 'next/font/google'

import clsx from 'clsx'

const inter = Inter({ subsets: ['latin'] })

const TabelLayout = ({ children }) => {
  return (
    <div
      className={clsx(
        'max-w-[1024px] h-full w-full mx-auto  border-r border-l overflow-hidden border-[#cdcdcd]',
        inter.className
      )}
    >
      {children}
    </div>
  )
}

export default TabelLayout
