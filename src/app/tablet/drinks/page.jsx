'use client'

import React, { useContext, useState } from 'react'

import TabletFooterCheckout from '@/components/TabletFooterCheckout/TabletFooterCheckout'
import TabletHeader from '@/components/TabletHeader/TabletHeader'
import ProductCardItem from '@/components/ProductCardItem/ProductCardItem'
import { AuthContext } from '@/context/AuthContext'

const Page = () => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedVariation, setSelectedVariation] = useState(null)
  const { beerProducts, addToCart } = useContext(AuthContext) // Get beerProducts from AuthContext

  const handleSelect = (productId, variationId) => {
    setSelectedProduct(productId)
    setSelectedVariation(variationId)

    const selectedProduct = beerProducts.find(product => product.id === productId)
    const selectedVariation = selectedProduct.variations.find(variation => variation.id === variationId)

    console.log(selectedProduct, selectedVariation)

    addToCart(selectedProduct, selectedVariation)
  }

  console.log(beerProducts, 'beerProducts')

  return (
    <>
      <div className='flex flex-col relative max-w-[1024px]'>
        <TabletHeader />
        <div className='px-10 mt-[140px] mb-[140px]'>
          {beerProducts.map(product => (
            <div key={product.id}>
              <ProductCardItem
                productId={product.id}
                imageSrc={product.image} // Use the image from beerProducts
                variations={product.variations} // Pass variations
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
