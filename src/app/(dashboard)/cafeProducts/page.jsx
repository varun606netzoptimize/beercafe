'use client'

import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import { redirect, useRouter, useSearchParams } from 'next/navigation'

import axios from 'axios'
import { Box, Button, Card, CardContent, CircularProgress, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { AuthContext } from '@/context/AuthContext'
import AddProductDrawer from './AddProductDrawer'
import { ENDPOINT } from '@/endpoints'
import DeleteProduct from './DeleteProduct'
import ViewProductVariation from './ViewProductVariation'
import AddVariationDrawer from './AddVairationDrawer'

export default function Page() {
  const { cafeProducts, setCafeProducts, authToken, tokenCheck, currentUser, setPageTitle } = useContext(AuthContext)

  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTableRendering, setIsTableRendering] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeletePop, setShowDeletePop] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)

  const [viewPrice, setViewPrice] = useState(false)
  const [variations, setVariations] = useState([])

  const [productData, setProductData] = useState(null)
  const [addVariationVisible, setAddVariationVisible] = useState(false)
  const [drawerType, setDrawerType] = useState('add')
  const searchParams = useSearchParams()

  const paramsCafeID = searchParams.get('cafeId')

  useEffect(() => {
    if (tokenCheck) {
      if (!authToken.token) {
        redirect('/login')
      }

      setPageTitle(cafeProducts?.cafe?.name + ' Products')
    }
  }, [authToken])

  useEffect(() => {
    if (authToken.token) {
      if (currentUser) {
        GetCafeProducts()
      }
    }
  }, [authToken])

  console.log(paramsCafeID, 'paramsCafeID')

  useEffect(() => {
    if (paramsCafeID) {
      getProducts({ cafeId: paramsCafeID })
    }
  }, [paramsCafeID])

  const getProducts = ({ sortBy, sortOrder, page, pageSize, queryValue, cafeId } = {}) => {
    let url = `${ENDPOINT.GET_PRODUCTS_BY_CAFE_ID}`
    const params = []

    if (cafeId) params.push(`cafeId=${cafeId}`)
    if (sortBy) params.push(`sortBy=${sortBy}`)
    if (sortOrder) params.push(`sortOrder=${sortOrder}`)
    if (page) params.push(`page=${page}`)
    if (pageSize) params.push(`pageSize=${pageSize}`)
    if (queryValue) params.push(`query=${queryValue}`)

    // If any parameters exist, join them with '&' and append to URL
    if (params.length > 0) {
      url += `?${params.join('&')}`
    }

    setIsLoading(true)

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })
      .then(res => {
        setProducts(res.data)
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
      .finally(() => {
        setIsLoading(false)
        setIsTableRendering(false)
      })
  }

  const GetCafeProducts = () => {
    const url = `${ENDPOINT.GET_CAFE_PRODUCTS}/${cafeProducts.cafe.id}`

    console.log(':url', url)

    setIsLoading(true)

    axios
      .get(url)
      .then(res => {
        setCafeProducts({ cafe: cafeProducts.cafe, products: res.data })
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
      .finally(() => {
        setIsLoading(false)
        setIsTableRendering(false)
      })
  }

  const DeleteCafeProducts = () => {
    const url = `${ENDPOINT.DELETE_PRODUCT}`

    const data = {
      id: deleteItem.id
    }

    setIsDeleting(true)

    axios
      .request({
        url,
        method: 'DELETE',
        data
      })
      .then(res => {
        GetCafeProducts()
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
      .finally(() => {
        setIsDeleting(false)
        setShowDeletePop(false)
        setDeleteItem(null)
      })
  }

  const columns = [
    {
      field: 'brand',
      headerName: 'Brand Name',
      flex: 1,
      renderCell: params => (
        <Box sx={{ paddingLeft: 4 }}>
          <p>
            <strong>{params?.row?.Brand?.name}</strong>
          </p>
        </Box>
      ),
      headerClassName: 'first-column-header',
      minWidth: 180
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1,
      renderCell: params => (
        <Box>
          <p>
            <strong>{params?.row?.name}</strong>
          </p>
        </Box>
      ),
      minWidth: 180
    },
    { field: 'SKU', headerName: 'SKU', flex: 1, minWidth: 100 },
    { field: 'quantity', headerName: 'Quantity', flex: 1, minWidth: 140 },
    { field: 'description', headerName: 'Description', flex: 1, minWidth: 180 },
    {
      field: 'productVariation',
      headerName: 'Product Variation',
      flex: 1,
      renderCell: params => (
        <>
          {params?.row?.variations?.length ? (
            <Button
              variant='outlined'
              color='info'
              size='small'
              onClick={() => {
                setViewPrice(true)
                setVariations(params?.row?.variations)
                setProductData(params?.row)
              }}
            >
              View
            </Button>
          ) : (
            <Button
              variant='contained'
              color='primary'
              startIcon={<i className='tabler-cash-register' />}
              size='small'
              onClick={() => {
                setAddVariationVisible(true)
                setProductData(params?.row)
              }}
            >
              Add
            </Button>
          )}
        </>
      ),
      minWidth: 220
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: params => (
        <Box>
          <Button variant='outlined' color='info' size='small' sx={{ marginRight: 2 }} onClick={() => {}}>
            Edit
          </Button>
          <Button
            variant='outlined'
            color='error'
            size='small'
            sx={{ marginLeft: 2 }}
            onClick={() => {
              setDeleteItem(params?.row)
              setShowDeletePop(true)
            }}
          >
            Delete
          </Button>
        </Box>
      ),
      sortable: false,
      minWidth: 180
    }
  ]

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <CardContent>
          <Box sx={titleBoxStyle}>
            <TextField id='outlined-basic' label='Search' variant='outlined' size='small' onChange={e => {}} />
            <Button
              variant='contained'
              size='medium'
              startIcon={<i className='tabler-bottle' />}
              onClick={() => setOpen(true)}
            >
              Add Product
            </Button>
          </Box>
        </CardContent>

        {isTableRendering ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <DataGrid
            loading={isLoading}
            rows={cafeProducts?.products}
            columns={columns}
            pagination
            rowCount={cafeProducts?.products?.length}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#3f51b5',
                fontSize: '13px',
                fontWeight: 'bold'
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                textTransform: 'uppercase'
              },
              '& .first-column-header': {
                paddingLeft: '24px'
              }
            }}
          />
        )}
      </Card>

      <AddProductDrawer open={open} onClose={() => setOpen(false)} getProducts={GetCafeProducts} />

      <DeleteProduct
        open={showDeletePop}
        handleClose={() => setShowDeletePop(false)}
        deleteData={deleteItem}
        DeleteFunction={DeleteCafeProducts}
        isLoading={isDeleting}
      />

      <ViewProductVariation
        open={viewPrice}
        setOpen={setViewPrice}
        ProductVariationData={variations}
        productData={productData}
        GetCafeProducts={GetCafeProducts}
        drawerType={drawerType}
        setDrawerType={setDrawerType}
      />

      <AddVariationDrawer
        open={addVariationVisible}
        onClose={() => setAddVariationVisible(false)}
        productData={productData}
        GetCafeProducts={GetCafeProducts}
        type={drawerType}
      />
    </div>
  )
}

const titleBoxStyle = {
  py: 2,
  rowGap: 2,
  px: 3,
  columnGap: 4,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between'
}
