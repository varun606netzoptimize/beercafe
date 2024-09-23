import localFont from 'next/font/local'

import clsx from 'clsx'

// const museoSlab = localFont({ src: '../../../public/fonts/MuseoSlab-700.woff2' })

const museoSlab = localFont({
  src: [
    {
      path: '../../../public/fonts/MuseoSlab-700.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/MuseoSlab-900.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/MuseoSlab-100.woff2',
      weight: '100',
      style: 'normal',
    }
  ]
})

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
