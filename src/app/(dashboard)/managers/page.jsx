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
import AddManagerDrawer from './AddManagerDrawer'
import ConfirmDelete from '@/components/Modal/ConfirmDelete'

export default function Page() {
  const { authToken, tokenCheck } = useContext(AuthContext)
  const [managers, setManagers] = useState({ managers: [], pagination: null })
  const [isLoading, setIsLoading] = useState(false)
  const [deleting, setDeleting] = useState({})
  const [open, setOpen] = React.useState(false)
  const [drawerType, setDrawerType] = useState('create')
  const [updateManagerData, setUpdateManagerData] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteManagerData, setDeleteManagerData] = useState(null)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const [totalRows, setTotalRows] = useState(0)

  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  const toggleDrawer = newOpen => () => {
    setOpen(newOpen)
  }

  useEffect(() => {
    if (tokenCheck && !authToken.token) {
      redirect('/loginAs')
    }
  }, [authToken])

  useEffect(() => {
    if (authToken.token) {
      GetManagers()
    }
  }, [authToken, paginationModel.page, sortBy, sortOrder])

  const GetManagers = () => {
    const url = `${ENDPOINT.GET_USERS}?page=${paginationModel.page + 1}&size=10&sortBy=${sortBy}&sortOrder=${sortOrder}&userType=manager`

    console.log(url)

    setIsLoading(true)

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken.token
        }
      })
      .then(res => {
        console.log(res.data)

        setManagers({ managers: res.data.users, pagination: res.data.pagination })
        setTotalRows(res.data.pagination.totalUsers)
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const DeleteManager = () => {
    const url = ENDPOINT.DELETE_MANAGER
    const userId = deleteManagerData.id

    setDeleting(prev => ({ ...prev, [userId]: true }))

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${authToken.token}`,
          'Content-Type': 'application/json'
        },
        data: { id: userId }
      })
      .then(res => {
        console.log('Manager deleted:', res.data)
        setManagers(prevManagers => prevManagers.filter(manager => manager.id !== userId))
      })
      .catch(err => {
        console.log('Failed to delete manager:', err.response ? err.response.data : err.message)
      })
      .finally(() => {
        setDeleting(prev => ({ ...prev, [userId]: false }))
        setOpenDeleteDialog(false)
        setDeleteManagerData(null)
      })
  }

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'cafe', headerName: 'Cafe', flex: 1, renderCell: params => params?.row?.managedCafes[0]?.name },
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
              // Handle edit
              setUpdateManagerData(params?.row)
              setDrawerType('update')
              setOpen(true)
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
              setDeleteManagerData(params?.row)
              setOpenDeleteDialog(true)
            }}
          >
            Delete
          </Button>
        </Box>
      ),
      sortable: false
    }
  ]

  console.log('managers:', managers)

  if (!authToken.token || authToken.role !== 'admin') {
    return null
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <Box
          sx={{
            py: 2,
            rowGap: 2,
            px: 3,
            columnGap: 4,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant='h5'>Manage Managers</Typography>
          <Button
            variant='contained'
            size='medium'
            startIcon={<i className='tabler-briefcase' />}
            onClick={() => {
              setOpen(true)
              setDrawerType('create')
            }}
          >
            Add Manager
          </Button>
        </Box>
      </Card>

      <Box sx={{ width: '100%' }}>
        <DataGrid
          loading={isLoading}
          rows={managers.managers}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          pageSizeOptions={[10]}
          rowCount={totalRows}
          paginationMode='server'
          onPaginationModelChange={setPaginationModel}
          sortingMode='server'
          onSortModelChange={newSortModel => {
            console.log('newSortModel:', newSortModel[0]?.field, newSortModel[0]?.sort)
            setSortBy(newSortModel[0]?.field ? newSortModel[0]?.field : 'name')
            setSortOrder(newSortModel[0]?.sort ? newSortModel[0]?.sort : 'asc')
          }}
          rowSelectionModel={[]} // Set rowSelectionModel to an empty array
          checkboxSelection={false} // Disable checkbox selection
        />
      </Box>

      <AddManagerDrawer
        open={open}
        onClose={toggleDrawer(false)}
        toggleDrawer={toggleDrawer}
        GetManagers={GetManagers}
        drawerType={drawerType}
        setDrawerType={setDrawerType}
        updateManagerData={updateManagerData}
        setUpdateManagerData={setUpdateManagerData}
      />

      <ConfirmDelete
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        deleteUserData={deleteManagerData}
        setDeleteUserData={setDeleteManagerData}
        DeleteFunction={DeleteManager}
      />
    </div>
  )
}
