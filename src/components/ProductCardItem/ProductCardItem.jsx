import React from 'react'

import Image from 'next/image'

const ProductCardItem = ({ productId, imageSrc, variations, selectedProduct, selectedVariation, onSelect }) => {
  return (
    <div className='flex py-8 justify-start w-full items-center gap-14 pb-8 pl-5 border-b border-[#c4c4c4]'>
      <Image src={imageSrc} className='object-contain' width={150} height={100} />
      <div className='flex gap-6 w-full'>
        {variations.map(variation => (
          <div
            key={variation.id}
            onClick={() => onSelect(productId, variation.id)}
            className={`max-w-[130px] w-full border-2 transition-all duration-300 ${
              selectedProduct === productId && selectedVariation === variation.id
                ? 'border-posPrimaryColor drop-shadow-xl'
                : 'border-[#c4c4c4]'
            } uppercase flex flex-col cursor-pointer`}
          >
            <div className='py-4 pl-5'>
              <p className='text-2xl font-bold'>${variation.price}</p>
              <p className='text-lg text-[#b1b1b1] font-medium'>{variation.size}</p>
            </div>
            <div className='bg-posPrimaryColor transition-all duration-300 py-1 px-3 pl-5 w-full flex justify-between text-lg font-bold'>
              <p>SELECT</p>
              <p
                className={`${selectedProduct === productId && selectedVariation === variation.id ? 'text-black' : ''}`}
              >
                {selectedProduct === productId && selectedVariation === variation.id ? '✔️' : '+'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductCardItem
