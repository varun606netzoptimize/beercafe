import Image from "next/image"

import { Loader2 } from "lucide-react"

const BeerLoader = () => {
  return (
    <div className='flex items-center flex-col gap-5 justify-center h-full'>
    <Image src='/images/mobile/appLogo.png' alt='App Logo' width={220} height={230} className='object-contain' />
    <Loader2 size='xl' className='w-10 h-10 animate-spin text-posPrimaryColor' />
  </div>
  )
}

export default BeerLoader
