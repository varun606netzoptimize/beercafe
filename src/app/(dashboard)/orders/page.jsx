'use client'

import { forwardRef, useContext, useEffect, useState } from 'react'

import { redirect } from 'next/navigation'

import axios from 'axios'
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  IconButton,
  Chip
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { format } from 'date-fns'

import padding from 'tailwindcss-logical/plugins/padding'

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
      field: 'customerName',
      headerName: 'Customer Name',
      flex: 1,
      renderCell: params => (
        <Box
          sx={{
            paddingLeft: '16px'
          }}
        >
          <p>
            <strong>
              {params?.row?.Customer ? (
                <>
                  {params?.row?.Customer?.firstname} {params?.row?.Customer?.lastname}{' '}
                </>
              ) : (
                'N/A'
              )}
            </strong>
          </p>
        </Box>
      ),
      filterable: false,
      headerClassName: 'first-column-header'
    },
    {
      field: 'cafeName',
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
      filterable: false,
      sortable: false
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      flex: 1,
      renderCell: params => (
        <Box>
          <Chip
            size='small'
            variant='tonal'
            color={params?.row?.paymentStatus == 'PAID' ? 'success' : 'warning'}
            label={params?.row?.paymentStatus}
          />
        </Box>
      ),
      filterable: false,
      sortable: false
    },
    {
      field: 'createdAt',
      headerName: 'Placed At',
      flex: 1,
      renderCell: params => (
        <Box>
          <p>
            {' '}
            {new Intl.DateTimeFormat('en-GB', {
              day: '2-digit',
              month: 'short', // For "May", use 'long' for full month names
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            }).format(new Date(params?.row?.createdAt))}
          </p>
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
            variant='none'
            color='info'
            size='small'
            sx={{ padding: 0, minWidth: '40px', minHeight: '40px', borderRadius: '50%' }}
            onClick={() => handleOpenModal(params.row)}
          >
            <i className='tabler-eye text-[22px] text-textSecondary border-none' />
          </Button>
        </Box>
      ),
      filterable: false,
      sortable: false
    }
  ]

  const handleSortChange = sortModel => {
    if (sortModel?.length > 0) {
      const { field, sort } = sortModel[0]

      getOrder({ sortBy: field, sortOrder: sort })
    } else {
      getOrder()
    }
  }

  const CustomInput = forwardRef((props, ref) => {
    const { label, start, end, ...rest } = props
    const startDate = start ? format(start, 'MM/dd/yyyy') : ''
    const endDate = end ? ` - ${format(end, 'MM/dd/yyyy')}` : ''
    const value = `${startDate}${endDate}`

    return <CustomTextField fullWidth inputRef={ref} {...rest} label={label} value={value} />
  })

  const handleQueryValueChange = value => {
    setQueryValue(value)

    // Call getOrder immediately after the input change
    getOrder({
      startDate: startDateRange ? format(startDateRange, 'yyyy-MM-dd') : null,
      endDate: endDateRange ? format(endDateRange, 'yyyy-MM-dd') : null,
      paymentStatus,
      queryValue: value // Use the updated value directly
    })
  }

  return (
    <div className='flex flex-col gap-6'>
      {isTableRendering ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Card>
          <CardContent
            sx={{
              padding: '16px' // Add padding for better separation from the table
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                flexWrap: 'wrap',
                gap: 2, // Add some space between items on small screens
                padding: 2, // Add padding for better separation from the table
                backgroundColor: 'background.paper', // Change background color for distinction
                borderRadius: 2 // Make the container rounded for a softer look
              }}
            >
              <form
                onSubmit={handleQueryValueSubmit}
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'space-between',
                  width: '100%',
                  gap: 16 // Adding consistent spacing between items
                }}
              >
                {/* Search Input */}
                <CustomTextField
                  value={queryValue}
                  onChange={e => handleQueryValueChange(e.target.value)}
                  sx={{
                    minWidth: 300,
                    marginBottom: 1
                  }}
                  placeholder='Search by Customer Name or Cafe'
                />

                {/* Payment Status Dropdown */}

                {/* Date Picker */}

                <CustomTextField
                  select
                  label='Payment Status'
                  id='payment-status'
                  value={paymentStatus}
                  onChange={handlePaymentStatusChange}
                  sx={{
                    minWidth: 150,
                    marginLeft: 'auto',
                    marginBottom: 1 // Margin adjustments for consistency
                  }}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value=''>All</MenuItem>
                  <MenuItem value='PAID'>Paid</MenuItem>
                  <MenuItem value='PENDING'>Unpaid</MenuItem>
                </CustomTextField>

                <AppReactDatepicker
                  selectsRange
                  monthsShown={2}
                  endDate={endDateRange}
                  selected={startDateRange}
                  startDate={startDateRange}
                  shouldCloseOnSelect={false}
                  id='date-range-picker-months'
                  onChange={handleOnChangeRange}
                  customInput={<CustomInput label='Select Date Range' end={endDateRange} start={startDateRange} />}
                  sx={{
                    minWidth: 200,
                    maxWidth: 250,
                    paddingBottom: 3,
                    marginLeft: 'auto'
                  }}
                />

                {/* Remove Filters Button */}
                <Button
                  variant='outlined'
                  color='error'
                  sx={{
                    marginLeft: 2,
                    marginBottom: 1,
                    paddingX: 3, // Add horizontal padding for a wider button
                    flexShrink: 0 // Prevent the button from shrinking on small screens
                  }}
                  onClick={handleRemoveFilters}
                >
                  Remove Filters
                </Button>
              </form>
            </Box>
          </CardContent>
          <Box sx={{ width: '100%' }}>
            <DataGrid
              rows={orders}
              columns={columns}
              disableSelectionOnClick
              components={{ NoRowsOverlay }}
              pageSizeOptions={[5, 10, 25]}
              autoHeight
              getRowId={row => row.id}
              onSortModelChange={handleSortChange}
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#3f51b5',
                  fontSize: '13px',
                  fontWeight: 'bold'
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  textTransform: 'uppercase'
                },
                '& .first-column-header': {
                  paddingLeft: '24px' // Custom right padding for the first column header
                }
              }}
            />
          </Box>
          <OrderDetails open={orderDeatilsOpen} order={selectedOrder} setOpen={setOrderDeatilsOpen} />
        </Card>
      )}
    </div>
  )
}

export default Page
