'use client'
import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import { redirect } from 'next/navigation'

import axios from 'axios'
import { styled } from '@mui/material/styles'
import { Box, Button, Card, TextField, Typography, CircularProgress, Dialog } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'
import AllCafesModal from './AllCafesModal'
import ConfirmDelete from '@/components/Modal/ConfirmDelete'
import AddOwnerDrawer from './AddOwnerDrawer'

export default function Page() {
  const { authToken, tokenCheck } = useContext(AuthContext)
  const [owners, setOwners] = useState({ users: [], pagination: null })
  const [isTableRendering, setIsTableRendering] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [drawerType, setDrawerType] = useState('create')
  const [updateOwnerData, setUpdateOwnerData] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteOwnerData, setDeleteOwnerData] = useState(null)

  const [open, setOpen] = useState(false)

  const [addOpen, setAddOpen] = useState(false)

  const [allCafes, setAllCafes] = useState(null)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const [totalRows, setTotalRows] = useState(0)

  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  const [searchQuery, setSearchQuery] = useState('')

  const toggleDrawer = newOpen => () => {
    setOpen(newOpen)
  }

  const toggleAddDrawer = newOpen => () => {
    setAddOpen(newOpen)
  }

  useEffect(() => {
    if (tokenCheck && !authToken.token) {
      redirect('/loginAs')
    }
  }, [authToken])

  useEffect(() => {
    if (authToken.token) {
      GetOwners()
    }
  }, [authToken, paginationModel.page, sortBy, sortOrder])

  const GetOwners = () => {
    const url = `${ENDPOINT.GET_USERS}?page=${paginationModel.page + 1}&size=10&sortBy=${sortBy}&sortOrder=${sortOrder}&userType=owner`

    console.log(url)

    setIsLoading(true)

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken.token
        }
      })
      .then(res => {
        setOwners({ users: res.data.users, pagination: res.data.pagination })
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
    const url = `${ENDPOINT.DELETE_USER}?id=${deleteOwnerData.id}`

    setDeleting(true)

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${authToken.token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        setOwners(prevOwners => ({
          users: prevOwners.users.filter(user => user.id !== deleteOwnerData.id),
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
        setDeleteOwnerData(null)
      })
  }

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'cafe',
      headerName: 'Cafe Owned',
      flex: 1,
      renderCell: params => (
        <Box>
          {params?.row?.ownedCafes[0]?.name ? (
            <>
              {params?.row?.ownedCafes[0]?.name}
              <Button
                variant='outlined'
                color='info'
                size='small'
                sx={{ marginLeft: 2 }}
                onClick={() => {
                  setAllCafes(params?.row?.ownedCafes)
                  setOpen(true)
                }}
              >
                View All
              </Button>
            </>
          ) : (
            'No Cafe'
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
              // Handle edit
              setUpdateOwnerData(params?.row)
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
              setDeleteOwnerData(params?.row)
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

  if (!authToken.token || authToken.role !== 'admin') {
    return null
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <Box sx={headerBox}>
          <Typography variant='h5'>Manage Cafe Owners</Typography>
          <Button
            variant='contained'
            size='medium'
            startIcon={<i className='tabler-briefcase' />}
            onClick={() => {
              setAddOpen(true)
              setDrawerType('create')
            }}
          >
            Add Cafe Owners
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
              rows={owners.users}
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
        deleteUserData={deleteOwnerData}
        setDeleteUserData={setDeleteOwnerData}
        DeleteFunction={DeleteManager}
        isLoading={deleting}
      />

      <AddOwnerDrawer
        open={addOpen}
        onClose={toggleAddDrawer(false)}
        toggleDrawer={toggleAddDrawer}
        GetOwners={GetOwners}
        drawerType={drawerType}
        setDrawerType={setDrawerType}
        updateOwnerData={updateOwnerData}
        setUpdateOwnerData={setUpdateOwnerData}
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
