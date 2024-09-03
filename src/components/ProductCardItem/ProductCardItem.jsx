import Image from 'next/image'

import clsx from 'clsx'

import Tick from '@/@menu/svg/Tick'

// Mapping of product names to image sources
const productImages = {
  Tuborg: '/images/mobile/Tuborg-Logo.png',
  Heinekenn : '/images/mobile/Heineken-Logo.png',
  Budweiser: '/images/mobile/Budweiser-Logo.png',
  Corona: '/images/mobile/Corona-Logo.png',
  Miller: '/images/mobile/Miller-Logo.png',
  Guinness: '/images/mobile/Guinness-logo.png',
}

const ProductCardItem = ({ productId, variations, selectedProduct, selectedVariation, onSelect, name }) => {
  // Determine the image source based on the product name
  const imageSrc = productImages[name] || '/images/mobile/Miller-Logo.png' // Fallback image

  return (
    <div className='flex py-8 justify-start w-full items-center gap-6 md:gap-14 pb-6 pl-5 border-b border-[#c4c4c4] transition-all duration-300'>
      <Image src={imageSrc} className='object-contain' width={110} height={100} alt='Product' />
      <div className='flex pb-2 gap-5 md:gap-6 w-full overflow-x-auto'>
        {variations.map(variation => (
          <div
            key={variation.id}
            onClick={() => onSelect(productId, variation.id)}
            className={clsx(
              'min-w-[170px] border-2 transition-all duration-300 uppercase flex flex-col cursor-pointer',
              selectedProduct === productId && selectedVariation === variation.id
                ? 'border-posPrimaryColor drop-shadow-xl'
                : 'border-[#c4c4c4]'
            )}
          >
            <div className='py-4 pl-5'>
              <p className='text-2xl font-black'>${variation.regularPrice}</p>
              <p className='text-lg text-[#b1b1b1] font-bold'>{variation.value}</p>
            </div>
            <div className='bg-posPrimaryColor transition-all duration-300 py-1 pt-2 px-3 pl-5 w-full flex justify-between items-center text-lg font-black'>
              <p className='transition-all duration-300'>
                {selectedProduct === productId && selectedVariation === variation.id ? 'SELECTED' : 'SELECT'}
              </p>
              <div className='h-fit w-fit transition-all duration-300'>
                {selectedProduct === productId && selectedVariation === variation.id ? <Tick /> : '+'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductCardItem
