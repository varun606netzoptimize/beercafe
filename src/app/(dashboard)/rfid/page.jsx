'use client'
import * as React from 'react'
import { useContext, useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import axios from 'axios'
import { Box, Card, CircularProgress, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'
import { format } from 'date-fns'

export default function Page() {
  const { authToken, tokenCheck, setPageTitle } = useContext(AuthContext)
  const [rfids, setRFIDs] = useState({ data: [], pagination: null })
  const [isTableRendering, setIsTableRendering] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const [totalRows, setTotalRows] = useState(0)

  const [sortBy, setSortBy] = useState('rfidNumber')
  const [sortOrder, setSortOrder] = useState('asc')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

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
      field: 'cafe',
      headerName: 'Cafe',
      flex: 1,
      renderCell: params => <Box>{params.row.Cafe ? params.row.Cafe.name : 'N/A'}</Box>
    },
    {
      field: 'customer',
      headerName: 'Customer',
      flex: 1,
      renderCell: params => <Box>{params.row.customerRFID ? params.row.customerRFID[0].Customer.firstname : 'N/A'}</Box>
    },
    {
      field: 'updatedAt',
      headerName: 'Last Updated',
      flex: 1,
      renderCell: params => <Box>{format(params.row.updatedAt, 'MMMM dd, yyyy')}</Box>
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
