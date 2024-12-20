'use client'

import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import { redirect, useRouter, useSearchParams } from 'next/navigation'

import axios from 'axios'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { CornerDownRight } from 'lucide-react'

import { AuthContext } from '@/context/AuthContext'
import AddProductDrawer from './AddProductDrawer'
import { ENDPOINT } from '@/endpoints'
import DeleteProduct from './DeleteProduct'
import ViewProductVariation from './ViewProductVariation'
import AddVariationDrawer from './AddVariationDrawer'
import CustomTextField from '@/@core/components/mui/TextField'

export default function Page() {
  const { authToken, tokenCheck, currentUser, setPageTitle, setProducts, products, cafes } = useContext(AuthContext)

  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTableRendering, setIsTableRendering] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeletePop, setShowDeletePop] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)

  const [viewPrice, setViewPrice] = useState(false)
  const [variations, setVariations] = useState([])

  const [productData, setProductData] = useState(null)
  const [updateProductData, setUpdateProductData] = useState(null)
  const [addVariationVisible, setAddVariationVisible] = useState(false)
  const [drawerType, setDrawerType] = useState('add')
  const [queryValue, setQueryValue] = useState('')
  const [debounceTimer, setDebounceTimer] = useState(null)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const [sortingModel, setSortingModel] = useState({
    sortBy: 'brandName',
    sortOrder: 'asc'
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const paramsCafeID = searchParams.get('cafeId')
  const [cafeId, setCafeId] = useState(searchParams.get('cafeId') || 'all')

  useEffect(() => {
    if (tokenCheck) {
      if (!authToken.token) {
        redirect('/login')
      } else {
        getProducts()
      }

      setPageTitle('Products')
    }
  }, [authToken, cafeId])

  const getProducts = ({ sortBy, sortOrder, page, pageSize, queryValue } = {}) => {
    let url = `${ENDPOINT.GET_PRODUCT}`
    const params = []

    if (sortBy) params.push(`sortBy=${sortBy}`)
    if (sortOrder) params.push(`sortOrder=${sortOrder}`)
    if (page) params.push(`page=${page}`)
    if (pageSize) params.push(`pageSize=${pageSize}`)
    if (queryValue) params.push(`query=${queryValue}`)
    if (cafeId && cafeId !== 'all') params.push(`cafeId=${cafeId}`)

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

  const handleCafeChange = event => {
    const selectedCafeId = event.target.value

    if (selectedCafeId === 'all') {
      setCafeId('all')
    } else {
      setCafeId(selectedCafeId)
    }

    router.replace('/products', undefined, { shallow: true })
  }

  const columns = [
    {
      field: 'brandName',
      headerName: 'Brand Name',
      flex: 1,
      renderCell: params => (
        <Box
          sx={{
            paddingLeft: '16px'
          }}
        >
          <p>
            <strong>{params?.row?.Brand?.name}</strong>
          </p>
        </Box>
      ),
      headerClassName: 'first-column-header',
      minWidth: 180
    },
    {
      field: 'productName',
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
    {
      field: 'cafeName',
      headerName: 'Cafe',
      flex: 1,
      renderCell: params => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'left',
            height: '100%'
          }}
        >
          <Typography>
            <strong>
              <small>{params?.row?.Cafe.name}</small>
            </strong>
          </Typography>
          <Typography>
            <small>{params?.row?.Cafe.address}</small>
          </Typography>
        </Box>
      ),
      minWidth: 180
    },
    { field: 'SKU', headerName: 'SKU', flex: 1, sortable: false, minWidth: 100 },
    { field: 'quantity', headerName: 'Quantity', flex: 1, minWidth: 140 },

    // { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'productVariation',
      headerName: 'Product Variation',
      flex: 1,
      sortable: false,
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
      minWidth: 180
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
      sortable: false,
      minWidth: 180
    }
  ]

  const handleSortChange = sortModel => {
    console.log(sortModel, 'sortModel')

    if (sortModel?.length > 0) {
      const { field, sort } = sortModel[0]

      setSortingModel(prevSorting => ({
        ...prevSorting,
        sortBy: field,
        sortOrder: sort
      }))

      getProducts({ sortBy: field, sortOrder: sort, page: 0, pageSize: paginationModel.pageSize })
      setPaginationModel(prevModel => ({
        ...prevModel,
        page: 0,
        pageSize: prevModel.pageSize
      }))
    } else {
      getProducts({
        page: 0,
        pageSize: paginationModel.pageSize
      })
      setPaginationModel(prevModel => ({
        ...prevModel,
        page: 0,
        pageSize: prevModel.pageSize
      }))
    }
  }

  const handlePageSizeChange = pageInfo => {
    setPaginationModel(prevModel => ({
      ...prevModel,
      page: pageInfo.page,
      pageSize: pageInfo.pageSize
    }))

    getProducts({
      page: pageInfo.page + 1,
      pageSize: pageInfo.pageSize,
      sortBy: sortingModel.sortBy,
      sortOrder: sortingModel.sortOrder,
      queryValue
    })
  }

  const handleQueryValueChange = value => {
    setQueryValue(value)

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      // Call getOrder immediately after the input change
      getProducts({
        queryValue: value // Use the updated value directly
      })
    }, 500)

    setDebounceTimer(timer)
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <CardContent
          sx={{
            padding: '16px'
          }}
        >
          <Box sx={titleBoxStyle}>
            <TextField
              id='outlined-basic'
              label='Search'
              variant='outlined'
              size='small'
              onChange={e => handleQueryValueChange(e.target.value)}
            />

            <FormControl className='mr-auto'>
              <CustomTextField
                select
                label='Select Cafe'
                id='cafe-name'
                onChange={handleCafeChange}
                value={cafeId}
                className='min-w-[260px] lg:ml-auto'
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value='all'>All</MenuItem>
                {cafes.cafes?.map(data => [
                  <MenuItem key={data.id} value={data.id}>
                    {data.name}
                  </MenuItem>,
                  data.children?.map(child => (
                    <MenuItem key={child.id} value={child.id} style={{ paddingLeft: 24 }}>
                      {cafeId !== child.id && (
                        <>
                          <CornerDownRight size={16} />
                        </>
                      )}
                      {child.name}
                    </MenuItem>
                  ))
                ])}
              </CustomTextField>
            </FormControl>

            <Button
              variant='contained'
              size='medium'
              startIcon={<i className='tabler-bottle' />}
              onClick={() => {
                setOpen(true)
                setDrawerType('create')
                setUpdateProductData(null)
              }}
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
            rows={products?.data}
            columns={columns}
            paginationMode='server'
            paginationModel={paginationModel}
            pageSizeOptions={[5, 10, 25]}
            onPaginationModelChange={handlePageSizeChange}
            rowCount={products?.meta?.totalProductsCount}
            rowHeight={60}
            autoHeight
            disableSelectionOnClick={true}
            disableColumnFilter
            disableRowSelectionOnClick
            onSortModelChange={handleSortChange}
            sortingMode='server'
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

      <AddProductDrawer
        open={open}
        onClose={() => setOpen(false)}
        drawerType={drawerType}
        setDrawerType={setDrawerType}
        updateProductData={updateProductData}
        getProducts={getProducts}
      />

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
  alignItems: 'flex-end',
  justifyContent: 'space-between'
}
