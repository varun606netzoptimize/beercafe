'use client'

import { useContext, useEffect, useState } from 'react'

import { redirect } from 'next/navigation'

import axios from 'axios'

import { Box, Button, CircularProgress, Typography } from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'
import OrderDetails from './OrderDeatils'

const Page = () => {
  const { authToken, tokenCheck, setPageTitle, setOrders, orders } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isTableRendering, setIsTableRendering] = useState(true)
  const [orderDeatilsOpen, setOrderDeatilsOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null);

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
        console.log(res.data, 'orders')
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

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setOrderDeatilsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setOrderDeatilsOpen(false);
  };

  const columns = [
    // {
    //   field: 'id',
    //   headerName: 'Order ID',
    //   flex: 1,
    //   renderCell: (params) => (
    //     <Box>
    //       <Typography>
    //         <strong>{params?.row?.id}</strong>
    //       </Typography>
    //     </Box>
    //   )
    // },
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

  return (
    <div className='flex flex-col gap-6'>
      {isTableRendering ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <DataGrid
          loading={isLoading}
          rows={orders}
          columns={columns}
          pagination
          rowCount={orders?.length}

          // getRowHeight={() => 'auto'}
        />
      )}

      <OrderDetails setOpen={setOrderDeatilsOpen} open={orderDeatilsOpen} order={selectedOrder} />
    </div>
  )
}

export default Page
