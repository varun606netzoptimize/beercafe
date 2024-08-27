'use client'

import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import { redirect, useRouter } from 'next/navigation'

import axios from 'axios'
import { Box, Button, Card, CircularProgress, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'
import ViewProductVariation from '../cafeProducts/ViewProductVariation'
import DeleteProduct from '../cafeProducts/DeleteProduct'
import AddVariationDrawer from '../cafeProducts/AddVairationDrawer'
import AddAllProductDrawer from './AddAllProductDrawer'

export default function Page() {
  const { authToken, tokenCheck, currentUser, setPageTitle } = useContext(AuthContext)

  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTableRendering, setIsTableRendering] = useState(true)
  const [cafeProducts, setCafeProducts] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeletePop, setShowDeletePop] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)

  const [viewPrice, setViewPrice] = useState(false)
  const [variations, setVariations] = useState([])
  const [productData, setProductData] = useState(null)

  const [addVariationVisible, setAddVariationVisible] = useState(false)
  const [drawerType, setDrawerType] = useState('add')
  const [updateProductData, setUpdateProductData] = useState(null)

  useEffect(() => {
    if (tokenCheck) {
      if (!authToken.token) {
        redirect('/login')
      }

      setPageTitle('Manage My Products')
      GetCafeProducts()
    }
  }, [authToken])

  const columns = [
    {
      field: 'brand',
      headerName: 'Brand Name',
      flex: 1,
      renderCell: params => (
        <Box>
          <p>
            <strong>{params?.row?.Brand?.name}</strong>
          </p>
        </Box>
      )
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
      )
    },
    {
      field: 'cafe',
      headerName: 'Cafe',
      flex: 1,
      renderCell: params => (
        <Box>
          <p>{params?.row?.cafe?.name ? params?.row?.cafe?.name : 'no cafe assigned'}</p>
        </Box>
      )
    },
    { field: 'SKU', headerName: 'SKU', flex: 0.5 },
    { field: 'quantity', headerName: 'Quantity', flex: 0.5 },
    { field: 'description', headerName: 'Description', flex: 1 },
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
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: params => (
        <Box>
          <Button
            variant='outlined'
            color='info'
            size='small'
            sx={{ marginRight: 2 }}
            onClick={() => {
              setOpen(true)
              setDrawerType('update')
              setUpdateProductData(params?.row)
            }}
          >
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
      sortable: false
    }
  ]

  const GetCafeProducts = () => {
    const url = `${ENDPOINT.GET_ALL_PRODUCTS}`

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

  return (
    <div className='flex flex-col gap-6'>
      <Card>
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
      </Card>

      {isTableRendering ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <DataGrid
          loading={isLoading}
          rows={cafeProducts?.products}
          columns={columns}
          pagination
          rowCount={cafeProducts?.products?.length}
        />
      )}

      <ViewProductVariation
        open={viewPrice}
        setOpen={setViewPrice}
        ProductVariationData={variations}
        productData={productData}
        GetCafeProducts={GetCafeProducts}
        drawerType={drawerType}
        setDrawerType={setDrawerType}
      />

      <DeleteProduct
        open={showDeletePop}
        handleClose={() => setShowDeletePop(false)}
        deleteData={deleteItem}
        DeleteFunction={DeleteCafeProducts}
        isLoading={isDeleting}
      />

      <AddVariationDrawer
        open={addVariationVisible}
        onClose={() => setAddVariationVisible(false)}
        productData={productData}
        GetCafeProducts={GetCafeProducts}
        type={drawerType}
      />

      <AddAllProductDrawer
        open={open}
        onClose={() => {
          setOpen(false)
          setDrawerType('add')
        }}
        getProducts={GetCafeProducts}
        drawerType={drawerType}
        updateProductData={updateProductData}
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
