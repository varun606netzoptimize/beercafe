'use client'

import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import { redirect, useRouter } from 'next/navigation'

import Link from 'next/link'

import axios from 'axios'
import { Box, Button, Card, CardContent, CircularProgress, TextField, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'
import ViewManagerModal from '../cafes/ViewManagerModal'
import DeleteCafe from '../cafes/DeleteCafe'
import AddMyCafeDrawer from './AddMyCafeDrawer'
import ArrowDownRight from '@/@menu/svg/ArrowDownRight'

const baseURL = process.env.NEXT_PUBLIC_APP_URL

export default function Page() {
  const router = useRouter()

  const { authToken, tokenCheck, currentUser, setPageTitle, setCafeProducts } = useContext(AuthContext)

  const [isDeleting, setDeleting] = useState(false)
  const [myCafes, setMyCafes] = useState(null)
  const [myCafesMetadata, setMyCafesMetaData] = useState(null)
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTableRendering, setIsTableRendering] = useState(true)
  const [viewManagers, setViewManagers] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState(null)

  const [staff, setStaff] = useState({
    name: null,
    staff: []
  })

  const [drawerType, setDrawerType] = useState('create')
  const [updateCafeData, setUpdateCafeData] = useState(null)
  const [queryValue, setQueryValue] = useState('')

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const [sortingModel, setSortingModel] = useState({
    sortBy: 'name',
    sortOrder: 'asc'
  })

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteCafeData, setDeleteCafeData] = useState(null)

  useEffect(() => {
    if (tokenCheck) {
      if (!authToken.token) {
        redirect('/login')
      }
    }
  }, [authToken])

  useEffect(() => {
    if (authToken.token) {
      if (currentUser) {
        getMyCafes()
        setPageTitle('Manage My Cafes')
      }
    }
  }, [authToken, currentUser])

  const combineCafe = cafes => {
    // Combine parent and child

    const totalCafes = []

    if (cafes.length > 0) {
      cafes.forEach(cafe => {
        totalCafes.push(cafe)

        if (cafe.children.length > 0) {
          cafe.children.forEach(child => {
            totalCafes.push(child)
          })
        }
      })
    }

    return totalCafes
  }

  async function getMyCafes({ sortBy, sortOrder, page, pageSize, search } = {}) {
    let url = `${ENDPOINT.GET_MY_CAFES}`
    const params = []

    if (sortBy) params.push(`sortBy=${sortBy}`)
    if (sortOrder) params.push(`sortOrder=${sortOrder}`)
    if (page) params.push(`page=${page}`)
    if (pageSize) params.push(`pageSize=${pageSize}`)
    if (search) params.push(`search=${search}`)

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
        const cafesData = res.data.cafes

        setMyCafesMetaData(res.data.meta)

        const totalCafes = combineCafe(cafesData)

        console.log(totalCafes, 'totalCafes')

        setMyCafes(totalCafes)
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
      .finally(() => {
        setIsLoading(false)
        setIsTableRendering(false)
      })
  }

  const DeleteCafeFN = () => {
    const url = `${ENDPOINT.DELETE_CAFE}?cafeId=${deleteCafeData?.id}`

    setDeleting(true)

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${authToken.token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        getMyCafes()
      })
      .catch(err => {
        console.log('Failed to delete manager:', err.response ? err.response.data : err.message)
      })
      .finally(() => {
        setDeleting(false)
        setOpenDeleteDialog(false)
        setDeleteCafeData(null)
      })
  }

  const handleQueryValueChange = value => {
    setQueryValue(value)

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      // Call getOrder immediately after the input change
      getMyCafes({
        search: value // Use the updated value directly
      })
    }, 500)

    setDebounceTimer(timer)
  }

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: params => {
        console.log(params, 'params')

        return (
          <Box
            className='h-full flex items-center'
            sx={{ paddingLeft: params.row.parentId ? 6 : 4, display: 'flex', alignItems: 'center', gap: 2 }}
          >
            {/* Show ArrowDownRight icon if not a parent */}
            <Link className='group' href={`${baseURL}/cafe/${params.row.slug}`} target='_blank'>
              {params.row.parentId ? (
                <Typography className='text-[#121212] group-hover:text-[#7367f0] transition duration-300 text-sm flex no-wrap text-wrap h-full items-center gap-2'>
                  {params.row.parentId && <ArrowDownRight sx={{ marginRight: 3 }} />}
                  {!params.row.parentId ? <h3>{params.row.name}</h3> : <p>{params.row.name}</p>}
                </Typography>
              ) : (
                <Typography className='text-[#121212] group-hover:text-[#7367f0] transition duration-300 text-md'>
                  {!params.row.parentId ? <h3>{params.row.name}</h3> : <p>{params.row.name}</p>}
                </Typography>
              )}
            </Link>
            <Tooltip placement='top' title={`${baseURL}/cafe/${params.row.slug}`}>
              <i className='tabler-info-circle text-[18px] cursor-pointer' />
            </Tooltip>
          </Box>
        )
      },
      headerClassName: 'first-column-header',
      minWidth: 200
    },
    { field: 'location', headerName: 'Location', flex: 1, minWidth: 150 },
    { field: 'address', headerName: 'Address', flex: 1, minWidth: 150 },
    {
      field: 'staff',
      headerName: 'Staff',
      flex: 1,
      renderCell: params => (
        <Box>
          {params.row.cafeUsers.length > 0 ? (
            <Button
              variant='outlined'
              color='info'
              size='small'
              sx={{ marginRight: 2 }}
              onClick={() => {
                setViewManagers(true)

                setStaff({
                  name: params.row.name,
                  staff: params.row.cafeUsers
                })
              }}
            >
              View
            </Button>
          ) : (
            <p style={{ color: '#808390' }}>No manager assigned</p>
          )}
        </Box>
      ),
      sortable: false,
      minWidth: 100
    },
    {
      field: 'products',
      headerName: 'Products',
      flex: 1,
      renderCell: params => (
        <Box>
          <Button
            variant='outlined'
            color='primary'
            size='small'
            sx={{ marginRight: 2 }}
            onClick={() => {
              router.push(`/products?cafeId=${params?.row.id}`)
              setCafeProducts({ cafe: params?.row, products: null })
            }}
          >
            View
          </Button>
        </Box>
      ),
      sortable: false,
      minWidth: 130
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
              setUpdateCafeData(params.row)
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
              setOpenDeleteDialog(true)
              setDeleteCafeData(params.row)
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

  const parentCafes = myCafes?.filter(cafe => cafe.parentId === null)

  if (!authToken.token) {
    return null
  }

  const handleSortChange = sortModel => {
    if (sortModel?.length > 0) {
      const { field, sort } = sortModel[0]

      setSortingModel(prevSorting => ({
        ...prevSorting,
        sortBy: field,
        sortOrder: sort
      }))

      getMyCafes({ sortBy: field, sortOrder: sort, page: 0, pageSize: paginationModel.pageSize })
      setPaginationModel(prevModel => ({
        ...prevModel,
        page: 0,
        pageSize: prevModel.pageSize
      }))
    } else {
      getMyCafes({
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

    getMyCafes({
      page: pageInfo.page + 1,
      pageSize: pageInfo.pageSize,
      sortBy: sortingModel.sortBy,
      sortOrder: sortingModel.sortOrder
    })
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
              value={queryValue}
              id='outlined-basic'
              label='Search'
              variant='outlined'
              size='small'
              onChange={e => handleQueryValueChange(e.target.value)}
            />
            <Button
              variant='contained'
              size='medium'
              startIcon={<i className='tabler-briefcase' />}
              onClick={() => {
                setOpen(true)
                setDrawerType('create')
                setUpdateCafeData(null)
              }}
            >
              Add Cafe
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
            rows={myCafes}
            columns={columns}
            paginationMode='server'
            paginationModel={paginationModel}
            pageSizeOptions={[5, 10, 25]}
            onPaginationModelChange={handlePageSizeChange}
            disableSelectionOnClick={true}
            disableColumnFilter
            disableRowSelectionOnClick
            rowCount={myCafesMetadata?.totalCafesCount}
            onSortModelChange={handleSortChange}
            rowSelectionModel={[]}
            checkboxSelection={false}
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

      <ViewManagerModal open={viewManagers} setOpen={setViewManagers} staff={staff} />

      <DeleteCafe
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        deleteCafeData={deleteCafeData}
        setDeleteCafeData={setDeleteCafeData}
        isLoading={isDeleting}
        DeleteFunction={DeleteCafeFN}
      />

      <AddMyCafeDrawer
        open={open}
        onClose={() => setOpen(false)}
        drawerType={drawerType}
        setDrawerType={setDrawerType}
        GetCafe={getMyCafes}
        updateCafeData={updateCafeData}
        cafes={parentCafes}
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
