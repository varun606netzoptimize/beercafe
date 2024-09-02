import localFont from 'next/font/local'

import { Inter } from 'next/font/google'

import clsx from 'clsx'

const inter = Inter({ subsets: ['latin'] })

const museoSlab = localFont({ src: '../../../public/fonts/MuseoSlab-700.woff2' })


const TabletLayout = ({ children }) => {
  return (
    <div
      className={clsx(
        'max-w-[1024px] relative h-full w-full mx-auto border-r border-l border-[#cdcdcd]',
        museoSlab.className
      )}
    >
      {children}
    </div>
  )
}

export default TabletLayout
