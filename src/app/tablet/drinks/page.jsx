'use client'

import React, { useContext, useState } from 'react'

import TabletFooterCheckout from '@/components/TabletFooterCheckout/TabletFooterCheckout'
import TabletHeader from '@/components/TabletHeader/TabletHeader'
import ProductCardItem from '@/components/ProductCardItem/ProductCardItem'
import { AuthContext } from '@/context/AuthContext'

// Define the products array with variations and unique IDs
const products = [
  {
    id: 'prod1',
    name: 'Corona Beer',
    image: '/images/mobile/corona.png',
    variations: [
      { id: 'var1', size: '250ml', price: '1.50' },
      { id: 'var2', size: '500ml', price: '2.50' }
    ]
  },
  {
    id: 'prod2',
    name: 'Heineken Beer',
    image: '/images/mobile/corona.png',
    variations: [
      { id: 'var3', size: '330ml', price: '2.00' },
      { id: 'var4', size: '750ml', price: '3.00' }
    ]
  },
  {
    id: 'prod3',
    name: 'Budweiser Beer',
    image: '/images/mobile/corona.png',
    variations: [
      { id: 'var5', size: '300ml', price: '1.80' },
      { id: 'var6', size: '600ml', price: '2.80' }
    ]
  }
]

const Page = () => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedVariation, setSelectedVariation] = useState(null)
  const { addToCart } = useContext(AuthContext)

  const handleSelect = (productId, variationId) => {
    setSelectedProduct(productId)
    setSelectedVariation(variationId)

    const selectedProduct = products.find(product => product.id === productId)
    const selectedVariation = selectedProduct.variations.find(variation => variation.id === variationId)

    console.log(selectedProduct, selectedVariation)

    addToCart(selectedProduct, selectedVariation) // Add selected product to cart
  }

  return (
    <>
      <div className='flex flex-col relative max-w-[1024px]'>
        <TabletHeader />
        <div className='px-10 mt-[140px] mb-[140px]'>
          {products.map(product => (
            <div key={product.id}>
              <ProductCardItem
                productId={product.id}
                imageSrc={product.image}
                variations={product.variations}
                selectedProduct={selectedProduct}
                selectedVariation={selectedVariation}
                onSelect={handleSelect} // Pass handleSelect to add product to cart
              />
            </div>
          ))}
        </div>
        <TabletFooterCheckout />
      </div>
    </>
  )
}

export default Page
