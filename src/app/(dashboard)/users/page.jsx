'use client'
import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import { redirect } from 'next/navigation'

import axios from 'axios'
import { Box, Button, Card, Typography, CircularProgress, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'
import AllCafesModal from './AllCafesModal'
import ConfirmDelete from '@/components/Modal/ConfirmDelete'
import AddOwnerDrawer from './AddUserDrawer'

export default function Page() {
  const { authToken, tokenCheck, cafes, setPageTitle, users, setUsers } = useContext(AuthContext)
  const [isTableRendering, setIsTableRendering] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [drawerType, setDrawerType] = useState('create')
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteUserData, setDeleteUserData] = useState(null)

  const [updateUserData, setUpdateUserData] = useState(null)

  const [open, setOpen] = useState(false)

  const [addOpen, setAddOpen] = useState(false)

  const [allCafes, setAllCafes] = useState(null)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const [totalRows, setTotalRows] = useState(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  const toggleDrawer = newOpen => () => {
    setOpen(newOpen)
  }

  const toggleAddDrawer = newOpen => () => {
    setAddOpen(newOpen)
  }

  useEffect(() => {
    if (tokenCheck && !authToken.token) {
      redirect('/login')
    }
  }, [authToken])

  useEffect(() => {
    if (authToken.token) {
      GetUsers()
      setPageTitle('Manage Users')
    }
  }, [authToken, paginationModel.page, sortBy, sortOrder, debouncedSearch])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search) // Update the debounced search after delay
    }, 500) // 500ms delay

    return () => {
      clearTimeout(handler) // Clear the timeout on cleanup to prevent unnecessary API calls
    }
  }, [search])

  const GetUsers = () => {
    const url = `${ENDPOINT.GET_USERS}?page=${paginationModel.page + 1}&size=10&sortBy=${sortBy}&sortOrder=${sortOrder}&userType=owner&search=${debouncedSearch}`

    setIsLoading(true)

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken.token
        }
      })
      .then(res => {
        setUsers({ users: res.data.users, pagination: res.data.pagination })
        setTotalRows(res.data.pagination.totalUsers)
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
      .finally(() => {
        setIsLoading(false)
        setIsTableRendering(false)
      })
  }

  const DeleteManager = () => {
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
        setUsers(prevOwners => ({
          users: prevOwners.users.filter(user => user.id !== deleteUserData.id),
          pagination: {
            ...prevOwners.pagination,
            totalUsers: prevOwners.pagination.totalUsers - 1
          }
        }))
      })
      .catch(err => {
        console.log('Failed to delete manager:', err.response ? err.response.data : err.message)
      })
      .finally(() => {
        setDeleting(false)
        setOpenDeleteDialog(false)
        setDeleteUserData(null)
      })
  }

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: params => {
        return (
          <Box>
            <p>{params?.row?.name}</p>
          </Box>
        )
      }
    },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phoneNumber', headerName: 'Phone', flex: 1 },
    { field: 'userType', headerName: 'Role', flex: 1, renderCell: params => <p>{params?.row?.userType?.type}</p> },
    {
      field: 'cafe',
      headerName: 'Cafe',
      flex: 1,
      renderCell: params => {
        return (
          <Box>
            <p>{params?.row?.cafeUsers[0]?.cafe?.name}</p>
          </Box>
        )
      }
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
              // Handle edit
              setUpdateUserData(params?.row)
              setDrawerType('update')
              setAddOpen(true)
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
              setDeleteUserData(params?.row)
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
        <Box sx={headerBox}>
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
              setAddOpen(true)
              setDrawerType('create')
            }}
          >
            Add Cafe User
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
                setSortBy(newSortModel[0]?.field ? newSortModel[0]?.field : 'name')
                setSortOrder(newSortModel[0]?.sort ? newSortModel[0]?.sort : 'asc')
              }}
              rowSelectionModel={[]}
              checkboxSelection={false}
            />
          </>
        )}
      </Box>

      <AllCafesModal open={open} setOpen={setOpen} cafes={allCafes} />

      <ConfirmDelete
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        deleteUserData={deleteUserData}
        setDeleteUserData={setDeleteUserData}
        DeleteFunction={DeleteManager}
        isLoading={deleting}
      />

      <AddOwnerDrawer
        open={addOpen}
        onClose={toggleAddDrawer(false)}
        drawerType={drawerType}
        updateUserData={updateUserData}
        setDrawerType={setDrawerType}
        cafes={cafes.cafes}
        GetUsers={GetUsers}
      />
    </div>
  )
}

const headerBox = {
  py: 2,
  rowGap: 2,
  px: 3,
  columnGap: 4,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between'
}
