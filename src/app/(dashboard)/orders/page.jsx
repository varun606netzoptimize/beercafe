'use client'

import { forwardRef, useContext, useEffect, useState } from 'react'

import { redirect } from 'next/navigation'

import axios from 'axios'
import { Box, Button, CircularProgress, Typography, Select, MenuItem, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { format } from 'date-fns'

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'
import OrderDetails from './OrderDeatils'
import AppReactDatepicker from '@/@core/components/date-picker'
import CustomTextField from '@/@core/components/mui/TextField'

const NoRowsOverlay = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <Typography variant='body1' color='textSecondary'>
      No orders found for this date range.
    </Typography>
  </Box>
)

const Page = () => {
  const { authToken, tokenCheck, setPageTitle, setOrders, orders } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isTableRendering, setIsTableRendering] = useState(true)
  const [orderDeatilsOpen, setOrderDeatilsOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [startDateRange, setStartDateRange] = useState(null)
  const [endDateRange, setEndDateRange] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState('')
  const [queryValue, setQueryValue] = useState('')

  useEffect(() => {
    if (tokenCheck) {
      if (!authToken.token) {
        redirect('/login')
      } else {
        getOrder()
      }

      setPageTitle('Orders')
    }
  }, [authToken])

  const getOrder = ({ startDate, endDate, paymentStatus, queryValue, sortBy, sortOrder } = {}) => {
    let url = `${ENDPOINT.GET_ORDERS}`
    const params = []

    // Conditionally append query parameters
    if (startDate) params.push(`startDate=${startDate}`)
    if (endDate) params.push(`endDate=${endDate}`)
    if (paymentStatus) params.push(`paymentStatus=${paymentStatus}`)
    if (queryValue) params.push(`query=${queryValue}`)
    if (sortBy) params.push(`sortBy=${sortBy}`)
    if (sortOrder) params.push(`sortOrder=${sortOrder}`)

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
      .then(response => {
        const orders = response.data

        setOrders(orders)
      })
      .catch(error => {
        console.error('Error fetching orders:', error)
      })
      .finally(() => {
        setIsLoading(false)
        setIsTableRendering(false)
      })
  }

  const handleOpenModal = order => {
    setSelectedOrder(order)
    setOrderDeatilsOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedOrder(null)
    setOrderDeatilsOpen(false)
  }

  const handleOnChangeRange = dates => {
    const [start, end] = dates

    setStartDateRange(start || null) // Allow start date to be null
    setEndDateRange(end || null) // Allow end date to be null

    // Call getOrder only if at least one of the dates is selected
    if (start || end) {
      const formattedStartDate = start ? format(start, 'yyyy-MM-dd') : null
      const formattedEndDate = end ? format(end, 'yyyy-MM-dd') : null

      getOrder({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        paymentStatus,
        queryValue
      })
    }
  }

  const handleRemoveFilters = () => {
    setStartDateRange(null)
    setEndDateRange(null)
    setPaymentStatus('')
    setQueryValue('')
    getOrder()

    // getOrder({sortBy:'amount', sortOrder: 'desc'})
  }

  const handlePaymentStatusChange = event => {
    const selectedStatus = event.target.value

    setPaymentStatus(selectedStatus)

    getOrder({
      startDate: startDateRange ? format(startDateRange, 'yyyy-MM-dd') : null,
      endDate: endDateRange ? format(endDateRange, 'yyyy-MM-dd') : null,
      paymentStatus: selectedStatus,
      queryValue
    })
  }

  const handleQueryValueSubmit = event => {
    event.preventDefault()

    getOrder({
      startDate: startDateRange ? format(startDateRange, 'yyyy-MM-dd') : null,
      endDate: endDateRange ? format(endDateRange, 'yyyy-MM-dd') : null,
      paymentStatus,
      queryValue
    })
  }

  const columns = [
    {
      field: 'customer',
      headerName: 'Customer Name',
      flex: 1,
      renderCell: params => (
        <Box>
          <p>
            <strong>
              {params?.row?.Customer?.firstname} {params?.row?.Customer?.lastname}
            </strong>
          </p>
        </Box>
      ),
      filterable: false
    },
    {
      field: 'cafe',
      headerName: 'Cafe',
      flex: 1,
      renderCell: params => (
        <Box>
          <Typography>
            <strong>
              <small>{params?.row?.Cafe.name}</small>
            </strong>
          </Typography>
          <Typography>
            <small>{params?.row?.Cafe.address}</small>
          </Typography>
        </Box>
      ),
      filterable: false
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      renderCell: params => (
        <Box>
          <p>
            <strong>${params?.row?.amount.toFixed(2)}</strong>
          </p>
        </Box>
      ),
      filterable: false
    },
    {
      field: 'paymentMode',
      headerName: 'Payment Mode',
      flex: 1,
      renderCell: params => (
        <Box>
          <p>
            <strong>{params?.row?.paymentMode}</strong>
          </p>
        </Box>
      ),
      filterable: false
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      flex: 1,
      renderCell: params => (
        <Box>
          <p>
            <strong>{params?.row?.paymentStatus}</strong>
          </p>
        </Box>
      ),
      filterable: false
    },
    {
      field: 'createdAt',
      headerName: 'Placed At',
      flex: 1,
      renderCell: params => (
        <Box>
          <p>{new Date(params?.row?.createdAt).toLocaleString()}</p>
        </Box>
      ),
      filterable: false
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
            onClick={() => handleOpenModal(params.row)}
          >
            Details
          </Button>
        </Box>
      ),
      filterable: false,
      sortable: false
    }
  ]

  const CustomInput = forwardRef((props, ref) => {
    const { label, start, end, ...rest } = props
    const startDate = start ? format(start, 'MM/dd/yyyy') : ''
    const endDate = end ? ` - ${format(end, 'MM/dd/yyyy')}` : ''
    const value = `${startDate}${endDate}`

    return <CustomTextField fullWidth inputRef={ref} {...rest} label={label} value={value} />
  })

  return (
    <div className='flex flex-col gap-6'>
      {isTableRendering ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'end', width: '100%' }}>
            <form onSubmit={handleQueryValueSubmit} style={{ display: 'flex', alignItems: 'end' }}>
              {/* Date Picker */}
              <AppReactDatepicker
                selectsRange
                monthsShown={2}
                endDate={endDateRange}
                selected={startDateRange}
                startDate={startDateRange}
                shouldCloseOnSelect={false}
                id='date-range-picker-months'
                onChange={handleOnChangeRange}
                customInput={<CustomInput label='Search Orders by Date' end={endDateRange} start={startDateRange} />}
              />
              {/* Payment Status Dropdown */}
              <Select
                label='Payment Status'
                value={paymentStatus}
                onChange={handlePaymentStatusChange}
                displayEmpty
                sx={{ marginLeft: 2, marginBottom: 1, minWidth: 150 }}
              >
                <MenuItem value=''>All Payment Status</MenuItem>
                <MenuItem value='PAID'>Paid</MenuItem>
                <MenuItem value='PENDING'>Unpaid</MenuItem>
              </Select>
              {/* Customer Name Input */}
              <TextField
                label='Customer Name'
                value={queryValue}
                onChange={e => setQueryValue(e.target.value)}
                sx={{ marginLeft: 2, marginBottom: 1 }}
              />
              <Button type='submit' variant='contained' color='primary' sx={{ marginLeft: 2 }}>
                Search
              </Button>
              <Button variant='outlined' color='error' sx={{ marginLeft: 2 }} onClick={handleRemoveFilters}>
                Remove Filters
              </Button>
            </form>
          </Box>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={orders}
              columns={columns}
              disableSelectionOnClick
              components={{ NoRowsOverlay }}
              pageSizeOptions={[5, 10, 25]}
              autoHeight
              getRowId={row => row.id}
            />
          </Box>
          <OrderDetails open={orderDeatilsOpen} order={selectedOrder} setOpen={setOrderDeatilsOpen} />
        </>
      )}
    </div>
  )
}

export default Page
