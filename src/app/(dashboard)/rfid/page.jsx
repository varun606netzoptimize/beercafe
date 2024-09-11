'use client'
import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import { redirect } from 'next/navigation'

import axios from 'axios'
import { Box, Button, Card, CircularProgress, TextField, Typography } from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'
import AddRFIDDrawer from './AddRFIDDrawer'
import ConfirmDelete from '@/components/Modal/ConfirmDelete'
import ViewCafeModal from './ViewCafeModal'
import { format } from 'date-fns'

export default function Page() {
  const { authToken, tokenCheck, setPageTitle } = useContext(AuthContext)
  const [rfids, setRFIDs] = useState({ data: [], pagination: null })
  const [isTableRendering, setIsTableRendering] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [open, setOpen] = React.useState(false)
  const [drawerType, setDrawerType] = useState('create')
  const [updateRFIDData, setUpdateRFIDData] = useState(null)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteRFIDsData, setDeleteRFIDsData] = useState(null)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const [totalRows, setTotalRows] = useState(0)

  const [sortBy, setSortBy] = useState('rfidNumber')
  const [sortOrder, setSortOrder] = useState('asc')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
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
      GetRFIDs()
      setPageTitle('Manager RFIDs')
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

  const GetRFIDs = () => {
    const url = `${ENDPOINT.GET_RFIDS}?sortOrder=${sortOrder}&sortBy=${sortBy}&search=${debouncedSearch}`

    setIsLoading(true)
    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken.token
        }
      })
      .then(res => {
        console.log(res.data)
        setRFIDs({ data: res.data })
        setTotalRows(10)
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
      .finally(() => {
        setIsTableRendering(false)
        setIsLoading(false)
      })
  }

  const DeleteRFIDs = () => {
    const url = `${ENDPOINT.DELETE_RFIDS}?id=${deleteRFIDsData.id}`

    setDeleting(true)

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${authToken.token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        setRFIDs(prevRFIDs => ({
          rfids: prevRFIDs.rfids.filter(rfid => rfid.id !== deleteRFIDsData.id),
          pagination: prevRFIDs.pagination
        }))
      })
      .catch(err => {
        console.log('Failed to delete rfid:', err.response ? err.response.data : err.message)
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
      field: 'rfidNumber',
      headerName: 'RFID Number',
      flex: 1
    },
    {
      field: 'expiry',
      headerName: 'Expiry Date',
      flex: 1,
      renderCell: params => <Box>{params.row.expiry ? format(params.row.expiry, 'MMMM dd, yyyy') : 'N/A'}</Box>
    },
    {
      field: 'updatedAt',
      headerName: 'Last Updated',
      flex: 1,
      renderCell: params => <Box>{format(params.row.updatedAt, 'MMMM dd, yyyy')}</Box>
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
              setUpdateRFIDData(params.row)
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
              setDeleteRFIDsData(params.row)
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
            startIcon={<i className='tabler-text-plus' />}
            onClick={() => {
              setOpen(true)
              setDrawerType('create')
            }}
          >
            Add New RFID
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
              rows={rfids.data}
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
                setSortBy(newSortModel[0]?.field ? newSortModel[0]?.field : 'rfidNumber')
                setSortOrder(newSortModel[0]?.sort ? newSortModel[0]?.sort : 'asc')
              }}
              rowSelectionModel={[]} // Set rowSelectionModel to an empty array
              checkboxSelection={false} // Disable checkbox selection
            />
          </>
        )}
      </Box>

      <AddRFIDDrawer
        open={open}
        drawerType={drawerType}
        onClose={toggleDrawer(false)}
        toggleDrawer={toggleDrawer}
        GetRFIDs={GetRFIDs}
        setDrawerType={setDrawerType}
        updateRFIDData={updateRFIDData}
        setUpdateRFIDData={setUpdateRFIDData}
      />

      <ConfirmDelete
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        deleteRFIDsData={deleteRFIDsData}
        setDeleteRFIDsData={setDeleteRFIDsData}
        DeleteFunction={DeleteRFIDs}
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
