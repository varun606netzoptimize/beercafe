'use client'

import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import { redirect } from 'next/navigation'

import axios from 'axios'
import { styled } from '@mui/material/styles'
import { Box, Button, Card, CircularProgress, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'
import AddCafeDrawer from './AddCafeDrawer'
import ViewManagerModal from './ViewManagerModal'
import DeleteCafe from './DeleteCafe'

export default function Page() {
  const { authToken, tokenCheck, cafes, setCafes } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isTableRendering, setIsTableRendering] = useState(true)
  const [totalRows, setTotalRows] = useState(0)
  const [sortOrder, setSortOrder] = useState('asc')
  const [sortBy, setSortBy] = useState('name')

  const [updateCafeData, setUpdateCafeData] = useState(null)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const [isDeleting, setDeleting] = useState(false)

  const [open, setOpen] = useState(false)
  const [drawerType, setDrawerType] = useState('create')
  const [groupedCafes, setGroupedCafes] = useState([])

  const [viewManagers, setViewManagers] = useState(false)
  const [managers, setManagers] = useState(null)

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
      GetCafe()
    }
  }, [authToken, paginationModel.page, sortBy, sortOrder])

  const GetCafe = () => {
    const url = `${ENDPOINT.GET_CAFES}?page=${paginationModel.page + 1}&size=10&sortBy=${sortBy}&sortOrder=${sortOrder}`

    setIsLoading(true)

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken.token
        }
      })
      .then(res => {
        const cafesData = res.data.cafes

        setCafes({ cafes: cafesData, pagination: res.data.pagination })
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
        GetCafe()
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
      field: 'owner',
      headerName: 'Owner',
      flex: 1,
      renderCell: params => <Box>{params.row.owner?.name}</Box>
    },
    {
      field: 'manager',
      headerName: 'Manager',
      flex: 1,
      renderCell: params => (
        <Box>
          {params.row.users.length > 0 ? (
            <Button
              variant='outlined'
              color='info'
              size='small'
              sx={{ marginRight: 2 }}
              onClick={() => {
                setViewManagers(true)
                setManagers(params.row.users)
              }}
            >
              View
            </Button>
          ) : (
            <p style={{ color: '#808390' }}>No managers assigned</p>
          )}
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

  const parentCafes = cafes.cafes.filter(cafe => cafe.parentId === null)

  if (!authToken.token) {
    return null
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <Box sx={titleBoxStyle}>
          <Typography variant='h5'>Manage Cafe</Typography>
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

      <AddCafeDrawer
        open={open}
        onClose={() => setOpen(false)}
        drawerType={drawerType}
        setDrawerType={setDrawerType}
        GetCafe={GetCafe}
        cafes={parentCafes}
        updateCafeData={updateCafeData}
      />

      <ViewManagerModal open={viewManagers} setOpen={setViewManagers} managers={managers} />

      <DeleteCafe
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        deleteCafeData={deleteCafeData}
        setDeleteCafeData={setDeleteCafeData}
        isLoading={isDeleting}
        DeleteFunction={DeleteCafeFN}
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
