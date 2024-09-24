import React from 'react'

import { Box, Button, Dialog, DialogActions, Divider, Slide, Typography } from '@mui/material'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function OrderDetails({ open, setOpen, order }) {
  const handleClose = () => {
    setOpen(false)
  }

  console.log(order, 'Order Details')

  return (
    <>
      <Dialog
        open={open}
        fullWidth={'true'}
        maxWidth={'sm'}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <Box sx={{ padding: 6 }}>
          {/* Header */}
          <Typography variant='h5' component='h2' id='modal-modal-title' sx={{ mb: 3, fontWeight: 'bold' }}>
            Order Details
          </Typography>

          {/* Order Information */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'medium', color: 'gray' }}>
                Order ID:
              </Typography>
              <Typography variant='body1'>{order?.id}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'medium', color: 'gray' }}>
                Amount:
              </Typography>
              <Typography variant='body1'>${order?.amount.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'medium', color: 'gray' }}>
                Payment Mode:
              </Typography>
              <Typography variant='body1'>{order?.paymentMode}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'medium', color: 'gray' }}>
                Payment Status:
              </Typography>
              <Typography variant='body1'>{order?.paymentStatus}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'medium', color: 'gray' }}>
                Placed At:
              </Typography>
              <Typography variant='body1'>{new Date(order?.createdAt).toLocaleString()}</Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Customer Information */}
          <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold' }}>
            Customer Information
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'medium', color: 'gray' }}>
                Name:
              </Typography>
              <Typography variant='body1'>
                {order?.Customer?.firstname} {order?.Customer?.lastname}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'medium', color: 'gray' }}>
                Phone:
              </Typography>
              <Typography variant='body1'>{order?.Customer?.phoneNumber}</Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Cafe Information */}
          <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold' }}>
            Cafe Information
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'medium', color: 'gray' }}>
                Name:
              </Typography>
              <Typography variant='body1'>{order?.Cafe?.name}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'medium', color: 'gray' }}>
                Address:
              </Typography>
              <Typography variant='body1'>{order?.Cafe?.address}</Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Product Details with Educational Information */}
          <Typography variant='h6' sx={{ mb: 2, fontWeight: 'bold' }}>
            Product Details
          </Typography>

          {order?.details?.map(detail => (
            <Box key={detail.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 'medium', color: 'gray' }}>
                  Product Name:
                </Typography>
                <Typography variant='body1'>{detail?.productVariation?.product?.name}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 'medium', color: 'gray' }}>
                  SKU:
                </Typography>
                <Typography variant='body1'>{detail?.productVariation?.product?.SKU}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 'medium', color: 'gray' }}>
                  Quantity:
                </Typography>
                <Typography variant='body1'>{detail.quantity}</Typography>
              </Box>

            </Box>
          ))}
        </Box>
        <DialogActions>
          <Button variant='outlined' color='info' onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
