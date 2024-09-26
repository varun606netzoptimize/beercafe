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
  const [startDateRange, setStartDateRange] = useState(new Date())
  const [endDateRange, setEndDateRange] = useState(new Date())
  const [paymentStatus, setPaymentStatus] = useState('')
  const [customerName, setCustomerName] = useState('')

  useEffect(() => {
    if (tokenCheck) {
      if (!authToken.token) {
        redirect('/login')
      } else {
        getOrders()
      }

      setPageTitle('Orders')
    }
  }, [authToken])

  const getOrders = () => {
    const url = `${ENDPOINT.GET_ALL_ORDERS}`

    setIsLoading(true)

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })
      .then(res => {
        setOrders(res.data)
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
      .finally(() => {
        setIsLoading(false)
        setIsTableRendering(false)
      })
  }

  const getOrderByDate = (startDate, endDate, paymentStatus, customerName) => {
    let url = `${ENDPOINT.GET_ORDER_BY_DATE}`

    // Append date parameters if they are provided
    if (startDate) url += `?startDate=${startDate}`
    if (endDate) url += startDate ? `&endDate=${endDate}` : `?endDate=${endDate}`
    if (paymentStatus)
      url += startDate || endDate ? `&paymentStatus=${paymentStatus}` : `?paymentStatus=${paymentStatus}`
    if (customerName) url += startDate || endDate || paymentStatus ? `&query=${customerName}` : `?query=${customerName}`

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

    // Call getOrderByDate only if at least one of the dates is selected
    if (start || end) {
      const formattedStartDate = start ? format(start, 'yyyy-MM-dd') : null
      const formattedEndDate = end ? format(end, 'yyyy-MM-dd') : null

      getOrderByDate(formattedStartDate, formattedEndDate, paymentStatus, customerName)
    }
  }

  const handleRemoveFilters = () => {
    setStartDateRange(new Date())
    setEndDateRange(new Date())
    setPaymentStatus('')
    setCustomerName('')
    getOrders()
  }

  const handlePaymentStatusChange = event => {
    const selectedStatus = event.target.value

    setPaymentStatus(selectedStatus)

    if (startDateRange && endDateRange) {
      const formattedStartDate = format(startDateRange, 'yyyy-MM-dd')
      const formattedEndDate = format(endDateRange, 'yyyy-MM-dd')

      getOrderByDate(formattedStartDate, formattedEndDate, selectedStatus, customerName)
    }
  }

  const handleCustomerNameSubmit = event => {
    event.preventDefault()

    if (startDateRange && endDateRange) {
      const formattedStartDate = format(startDateRange, 'yyyy-MM-dd')
      const formattedEndDate = format(endDateRange, 'yyyy-MM-dd')

      getOrderByDate(formattedStartDate, formattedEndDate, paymentStatus, customerName)
    }
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
      )
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
      )
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
      )
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
      )
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
      )
    },
    {
      field: 'createdAt',
      headerName: 'Placed At',
      flex: 1,
      renderCell: params => (
        <Box>
          <p>{new Date(params?.row?.createdAt).toLocaleString()}</p>
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
            onClick={() => handleOpenModal(params.row)}
          >
            Details
          </Button>
        </Box>
      ),
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
            <form onSubmit={handleCustomerNameSubmit} style={{ display: 'flex', alignItems: 'end' }}>
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
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
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
