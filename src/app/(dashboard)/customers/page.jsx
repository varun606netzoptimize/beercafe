'use client'
import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import { redirect } from 'next/navigation'

import axios from 'axios'
import { Box, Button, Card, CircularProgress, Typography } from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'
import AddUserDrawer from './AddUserDrawer'
import ConfirmDelete from '@/components/Modal/ConfirmDelete'
import ViewCafeModal from './ViewCafeModal'

export default function Page() {
  const { authToken, tokenCheck } = useContext(AuthContext)
  const [users, setUsers] = useState({ users: [], pagination: null })
  const [isTableRendering, setIsTableRendering] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [open, setOpen] = React.useState(false)
  const [drawerType, setDrawerType] = useState('create')
  const [updateUserData, setUpdateUserData] = useState(null)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteUserData, setDeleteUserData] = useState(null)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const [totalRows, setTotalRows] = useState(0)

  const [sortBy, setSortBy] = useState('firstname')
  const [sortOrder, setSortOrder] = useState('asc')

  const [cafes, setCafes] = useState(null)
  const [showCafes, setShowCafes] = useState(false)

  const toggleDrawer = newOpen => () => {
    setOpen(newOpen)
  }

  useEffect(() => {
    if (tokenCheck) {
      if (!authToken.token) {
        redirect('/login')
      }
    }
  }, [authToken])

  useEffect(() => {
    if (authToken.token) {
      GetUsers()
    }
  }, [authToken, paginationModel.page, sortBy, sortOrder])

  const GetUsers = () => {
    const url = `${ENDPOINT.GET_CUSTOMERS}?sortOrder=${sortOrder}&sortBy=${sortBy}`

    setIsLoading(true)
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken.token
        }
      })
      .then(res => {
        setUsers({ users: res.data.customers, pagination: res.data.pagination })
        setTotalRows(res.data.pagination.totalCustomers)
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
      .finally(() => {
        setIsTableRendering(false)
        setIsLoading(false)
      })
  }

  const DeleteUser = () => {
    const url = `${ENDPOINT.DELETE_USER}?id=${deleteUserData.id}`

    setDeleting(true)

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${authToken.token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        setUsers(prevUsers => ({
          users: prevUsers.users.filter(user => user.id !== deleteUserData.id),
          pagination: prevUsers.pagination
        }))
      })
      .catch(err => {
        console.log('Failed to delete user:', err.response ? err.response.data : err.message)
      })
      .finally(() => {
        setDeleting(false)
        setOpenDeleteDialog(false)
      })
  }

  function fullName(firstName, lastName) {
    return `${firstName} ${lastName}`
  }

  const columns = [
    {
      field: 'firstname',
      headerName: 'Name',
      flex: 1,
      renderCell: params => <Box>{fullName(params.row.firstname, params.row.lastname)}</Box>
    },
    { field: 'phoneNumber', headerName: 'Phone', flex: 1 },
    { field: 'points', headerName: 'Points', flex: 1 },
    {
      field: 'cafes',
      headerName: 'Cafes',
      flex: 1,
      renderCell: params => (
        <Box>
          <Button
            variant='outlined'
            color='info'
            size='small'
            sx={{ marginRight: 2 }}
            onClick={() => {
              setCafes(params?.row?.cafes)
              setShowCafes(true)
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
              setUpdateUserData(params.row)
              setDrawerType('update')
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
              setDeleteUserData(params.row)
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

  if (!authToken.token) {
    return null
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <Box sx={titleBoxStyle}>
          <Typography variant='h5'>Manage Customers</Typography>
          <Button
            variant='contained'
            size='medium'
            startIcon={<i className='tabler-user-plus' />}
            onClick={() => {
              setOpen(true)
              setDrawerType('create')
            }}
          >
            Add New User
          </Button>
        </Box>
      </Card>

      <Box sx={{ width: '100%' }}>
        {isTableRendering ? (
          <Box className='flex items-center justify-center h-full'>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <>
            <DataGrid
              loading={isLoading}
              rows={users.users}
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
          </>
        )}
      </Box>

      <AddUserDrawer
        open={open}
        drawerType={drawerType}
        onClose={toggleDrawer(false)}
        toggleDrawer={toggleDrawer}
        GetUsers={GetUsers}
        setDrawerType={setDrawerType}
        updateUserData={updateUserData}
        setUpdateUserData={setUpdateUserData}
      />

      <ConfirmDelete
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        deleteUserData={deleteUserData}
        setDeleteUserData={setDeleteUserData}
        DeleteFunction={DeleteUser}
        isLoading={deleting}
      />

      <ViewCafeModal open={showCafes} setOpen={setShowCafes} cafes={cafes} />
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
