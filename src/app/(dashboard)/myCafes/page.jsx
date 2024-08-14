'use client'

import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import { redirect, useRouter } from 'next/navigation'

import axios from 'axios'
import { Box, Button, Card, CircularProgress, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'
import ViewManagerModal from '../cafes/ViewManagerModal'
import DeleteCafe from '../cafes/DeleteCafe'
import AddMyCafeDrawer from './AddMyCafeDrawer'

export default function Page() {
  const router = useRouter()

  const { authToken, tokenCheck, currentUser, setPageTitle, setCafeProducts } = useContext(AuthContext)

  const [isDeleting, setDeleting] = useState(false)
  const [myCafes, setMyCafes] = useState({ cafes: [], pagination: {} })
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTableRendering, setIsTableRendering] = useState(true)
  const [totalRows, setTotalRows] = useState(0)
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

  const [sortOrder, setSortOrder] = useState('asc')
  const [sortBy, setSortBy] = useState('name')
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
        GetMyCafes()
        setPageTitle('Manage My Cafes')
      }
    }
  }, [authToken, paginationModel.page, sortBy, sortOrder, currentUser, debouncedSearch])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search) // Update the debounced search after delay
    }, 500) // 500ms delay

    return () => {
      clearTimeout(handler) // Clear the timeout on cleanup to prevent unnecessary API calls
    }
  }, [search])

  async function GetMyCafes() {
    const url = `${ENDPOINT.GET_MY_CAFES}?ownerId=${currentUser?.id}&page=${paginationModel.page + 1}&size=10&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${debouncedSearch}`

    setIsLoading(true)

    axios
      .get(url, {})
      .then(res => {
        const cafesData = res.data.cafes

        setMyCafes({ cafes: cafesData, pagination: res.data.pagination })
        setTotalRows(res.data.pagination.totalCafes)
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
        GetMyCafes()
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

    setGroupedCafes(grouped.flatMap(cafe => [cafe, ...cafe.children]))
  }

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: params => (
        <Box sx={{ paddingLeft: params.row.isParent ? 0 : 4 }}>
          {params.row.isParent ? <h3> {params.row.name}</h3> : <p>{params.row.name}</p>}
        </Box>
      )
    },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
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
      )
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
      sortable: false
    }
  ]

  const parentCafes = myCafes.cafes.filter(cafe => cafe.parentId === null)

  if (!authToken.token) {
    return null
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card>
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
            onClick={() => setOpen(true)}
          >
            Add Cafe
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
          rows={groupedCafes}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          pageSizeOptions={[10]}
          rowCount={totalRows}
          paginationMode='server'
          onPaginationModelChange={setPaginationModel}
          sortingMode='server'
          onSortModelChange={newSortModel => {
            setSortBy(newSortModel[0]?.field ? newSortModel[0]?.field : 'name')
            setSortOrder(newSortModel[0]?.sort ? newSortModel[0]?.sort : 'asc')
          }}
          rowSelectionModel={[]}
          checkboxSelection={false}
        />
      )}

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
        GetCafe={GetMyCafes}
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
