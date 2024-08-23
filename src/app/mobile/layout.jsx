import localFont from 'next/font/local'

import { clsx } from 'clsx'

// Font files can be colocated inside of `pages`

const MobileLayout = ({ children }) => {
  return <div className={clsx('h-screen')}>{children}</div>
}

export default MobileLayout
