'use client'

import { forwardRef, useContext, useEffect, useState } from 'react'

import { redirect } from 'next/navigation'

import axios from 'axios'

import { Box, Button, CircularProgress, Typography } from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'

import { format, addDays } from 'date-fns'

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
  const [endDateRange, setEndDateRange] = useState(null)

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

  const getOrderByDate = (startDate, endDate) => {
    const url = `${ENDPOINT.GET_ORDER_BY_DATE}?startDate=${startDate}&endDate=${endDate}`

    setIsLoading(true) // Start loading state

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
        setIsLoading(false) // Reset loading state
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

    setStartDateRange(start)
    setEndDateRange(end)

    if (start && end) {
      const formattedStartDate = format(start, 'yyyy-MM-dd')
      const formattedEndDate = format(end, 'yyyy-MM-dd')

      // Call the getOrderByDate function with the formatted dates
      getOrderByDate(formattedStartDate, formattedEndDate)
    }
  }

  const handleRemoveFilters = () => {
    setStartDateRange(null)
    setEndDateRange(null)
    getOrders() // Fetch all orders when filters are removed
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
            <Button
              variant='outlined'
              color='secondary'
              size='small'
              onClick={handleRemoveFilters}
              sx={{ marginLeft: 2, marginBottom: 1 }}
            >
              Remove Filters
            </Button>
          </Box>
          <DataGrid
            loading={isLoading}
            rows={orders}
            columns={columns}
            pagination
            rowCount={orders?.length}
            components={{
              NoRowsOverlay
            }}
          />
        </>
      )}

      <OrderDetails setOpen={setOrderDeatilsOpen} open={orderDeatilsOpen} order={selectedOrder} />
    </div>
  )
}

export default Page
