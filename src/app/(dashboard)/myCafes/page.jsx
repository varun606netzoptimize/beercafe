'use client'

import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import { redirect, useRouter } from 'next/navigation'

import axios from 'axios'
import { Box, Button, Card, CardContent, CircularProgress, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'
import ViewManagerModal from '../cafes/ViewManagerModal'
import DeleteCafe from '../cafes/DeleteCafe'
import AddMyCafeDrawer from './AddMyCafeDrawer'
import ArrowDownRight from '@/@menu/svg/ArrowDownRight'

export default function Page() {
  const router = useRouter()

  const { authToken, tokenCheck, currentUser, setPageTitle, setCafeProducts } = useContext(AuthContext)

  const [isDeleting, setDeleting] = useState(false)
  const [myCafes, setMyCafes] = useState(null)
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTableRendering, setIsTableRendering] = useState(true)
  const [viewManagers, setViewManagers] = useState(false)

  const [staff, setStaff] = useState({
    name: null,
    staff: []
  })

  const [drawerType, setDrawerType] = useState('create')
  const [updateCafeData, setUpdateCafeData] = useState(null)
  const [groupedCafes, setGroupedCafes] = useState([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

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
  }, [authToken, currentUser, debouncedSearch])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search) // Update the debounced search after delay
    }, 500) // 500ms delay

    return () => {
      clearTimeout(handler) // Clear the timeout on cleanup to prevent unnecessary API calls
    }
  }, [search])

  async function getMyCafes({ sortBy, sortOrder, page, pageSize, debouncedSearch } = {}) {
    let url = `${ENDPOINT.GET_MY_CAFES}`
    const params = []

    if (sortBy) params.push(`sortBy=${sortBy}`)
    if (sortOrder) params.push(`sortOrder=${sortOrder}`)
    if (page) params.push(`page=${page}`)
    if (pageSize) params.push(`pageSize=${pageSize}`)
    if (debouncedSearch) params.push(`search=${debouncedSearch}`)

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

        console.log(cafesData, "cafesData")

        setMyCafes(res.data)
        groupCafes(cafesData)
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

  const groupCafes = cafesData => {


    const parentCafes = cafesData.filter(cafe => cafe.parentId === null)
    const branches = cafesData.filter(cafe => cafe.parentId !== null)



    const grouped = parentCafes.map(parentCafe => {
      return {
        ...parentCafe,
        isParent: true,
        children: branches.filter(branch => branch.parentId === parentCafe.id)
      }
    })

    console.log(grouped, "groupCafes")

    setGroupedCafes(grouped.flatMap(cafe => [cafe, ...cafe.children]))
  }

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: params => {
        return(
        <Box sx={{ paddingLeft: params.row.parentId ? 6 : 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Show ArrowDownRight icon if not a parent */}
          {params.row.parentId && <ArrowDownRight sx={{ marginRight: 3 }} />}
          {!params.row.parentId ? <h3>{params.row.name}</h3> : <p>{params.row.name}</p>}
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
          {params.row.owners.length > 0 || params.row.users.length > 0 ? (
            <Button
              variant='outlined'
              color='info'
              size='small'
              sx={{ marginRight: 2 }}
              onClick={() => {
                const combinedManagers = [...params.row.owners, ...params.row.users]

                setViewManagers(true)

                setStaff({
                  name: params.row.name,
                  staff: combinedManagers
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
              router.push(`/cafeProducts`)
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

  const parentCafes = myCafes?.cafes?.filter(cafe => cafe.parentId === null)

  if (!authToken.token) {
    return null
  }

  const handleSortChange = sortModel => {
    console.log(sortModel, 'sortModel')

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
    console.log(pageInfo, 'pageInfo')
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
              onChange={e => {
                setSearch(e.target.value)
              }}
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
            rows={myCafes.cafes}
            columns={columns}
            paginationMode='server'
            paginationModel={paginationModel}
            pageSizeOptions={[5, 10, 25]}
            onPaginationModelChange={handlePageSizeChange}
            disableSelectionOnClick={true}
            disableColumnFilter
            disableRowSelectionOnClick
            rowCount={myCafes?.pagination?.totalCafes}
            onSortModelChange={handleSortChange}
            rowSelectionModel={[]}
            checkboxSelection={false}
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
