import localFont from 'next/font/local'

import { clsx } from 'clsx'

// Font files can be colocated inside of `pages`
const myFont = localFont({ src: './AvertaRegular.woff2' })

const MobileLayout = ({ children }) => {
  return <div className={clsx(myFont.className, 'h-full')}>{children}</div>
}

export default MobileLayout
