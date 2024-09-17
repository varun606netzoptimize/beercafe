'use client'

import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import { redirect, useRouter } from 'next/navigation'

import axios from 'axios'
import { Box, Button, Card, CircularProgress, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { AuthContext } from '@/context/AuthContext'
import AddProductDrawer from './AddProductDrawer'
import { ENDPOINT } from '@/endpoints'
import DeleteProduct from './DeleteProduct'
import ViewProductVariation from './ViewProductVariation'
import AddVariationDrawer from './AddVairationDrawer'

export default function Page() {
  const { authToken, tokenCheck, currentUser, setPageTitle, setProducts, products } = useContext(AuthContext)

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

  useEffect(() => {
    if (tokenCheck) {
      if (!authToken.token) {
        redirect('/login')
      }

      setPageTitle('Products')
    }
  }, [authToken])

  useEffect(() => {
    if (authToken.token) {
      getProducts()
    }
  }, [authToken])

  const getProducts = () => {
    const url = `${ENDPOINT.GET_PRODUCT}`

    console.log(':url', url)

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

  const DeleteProducts = () => {
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
        getProducts()
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
          <Typography>
            <strong>
              <small>{params?.row?.Cafe.name}</small>
            </strong>
          </Typography>
          <Typography>
            <small>{params?.row?.Cafe.address}</small>
          </Typography>
        </Box>
      )
    },
    { field: 'SKU', headerName: 'SKU', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 1 },
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
      sortable: false
    }
  ]

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

      {isTableRendering && products?.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <DataGrid
          loading={isLoading}
          rows={products}
          columns={columns}
          pagination
          rowCount={products?.length}
          // getRowHeight={() => 'auto'}
        />
      )}

      <AddProductDrawer open={open} onClose={() => setOpen(false)} getProducts={getProducts} />

      <DeleteProduct
        open={showDeletePop}
        handleClose={() => setShowDeletePop(false)}
        deleteData={deleteItem}
        DeleteFunction={DeleteProducts}
        isLoading={isDeleting}
      />

      <ViewProductVariation
        open={viewPrice}
        setOpen={setViewPrice}
        ProductVariationData={variations}
        productData={productData}
        getProducts={getProducts}
        drawerType={drawerType}
        setDrawerType={setDrawerType}
      />

      <AddVariationDrawer
        open={addVariationVisible}
        onClose={() => setAddVariationVisible(false)}
        productData={productData}
        getProducts={getProducts}
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
