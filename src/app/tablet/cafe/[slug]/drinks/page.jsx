'use client'

import React, { useContext, useEffect, useState } from 'react'

import { Loader2 } from 'lucide-react'

import TabletFooterCheckout from '@/components/TabletFooterCheckout/TabletFooterCheckout'
import TabletHeader from '@/components/TabletHeader/TabletHeader'
import ProductCardItem from '@/components/ProductCardItem/ProductCardItem'
import { AuthContext } from '@/context/AuthContext'

const Page = ({ params }) => {
  const { slug } = params
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedVariation, setSelectedVariation] = useState(null)
  const { beerProducts, addToCart, isProductsLoading, fetchCafeProducts } = useContext(AuthContext) // Get beerProducts from AuthContext

  const handleSelect = (productId, variationId) => {
    setSelectedProduct(productId)
    setSelectedVariation(variationId)

    const selectedProduct = beerProducts.find(product => product.id === productId)
    const selectedVariation = selectedProduct.variations.find(variation => variation.id === variationId)

    console.log(selectedProduct, selectedVariation)

    addToCart(selectedProduct, selectedVariation)
  }

  useEffect(() => {
    fetchCafeProducts(slug)
  }, [slug])

  console.log(beerProducts, 'beerProducts')

  return (
    <>
      <div className='flex flex-col relative h-full max-w-[1024px]'>
        <div className='fixed top-0 w-full max-w-[1024px] z-40'>
        <TabletHeader>
          <h1 className='text-[30px] md:text-[38px] font-black' style={{ textShadow: '0px 2px 0px #ffffff' }}>
          Pick Your Favorite Beer and the Quantity
          </h1>
          <p className='text-xl max-w-[650px] font-bold mt-3' >Your Ideal Brew Awaits – Select Now!</p>
        </TabletHeader>
        </div>
        <div className='px-6 md:px-10 mt-[140px] h-full mb-[140px]'>
          {isProductsLoading ? (
            <div className='flex w-full mt-10 justify-center items-center h-full'><Loader2 className='w-20 h-20 animate-spin' /></div>
          ) : (
            <>
              {!beerProducts ? (
                <div className='flex w-full mt-10 justify-center items-center h-full font-bold'>There is no products</div>
              ) : (
                <>
                  {beerProducts.map(product => (
                    <div key={product.id}>
                      <ProductCardItem
                        productId={product.id}
                        imageSrc={product.image} // Use the image from beerProducts
                        variations={product.variations} // Pass variations
                        selectedProduct={selectedProduct}
                        selectedVariation={selectedVariation}
                        onSelect={handleSelect}
                        {...product} // Pass handleSelect to add product to cart
                      />
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
        <TabletFooterCheckout />
      </div>
    </>
  )
}

export default Page
