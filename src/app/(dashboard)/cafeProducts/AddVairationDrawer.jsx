'use client'

import * as React from 'react'
import { useState, useContext } from 'react'

import { Box, Button, Drawer, Typography, CircularProgress } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'

// Validation schema
const schema = yup.object().shape({
  value: yup.string().required('Value is required'),
  salePrice: yup.number().required('Sale price is required').positive(),
  regularPrice: yup.number().required('Regular price is required').positive(),
  points: yup.number().required('Points are required').positive().integer()
})

export default function AddVariationDrawer({
  open,
  onClose,
  setDialogOpen = null,
  productData,
  GetCafeProducts,
  myProductVariationData = null
}) {
  const { authToken, brands, cafeProducts } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  // Form submit handler
  const onSubmit = async data => {
    setIsLoading(true)

    const url = ENDPOINT.ADD_PRODUCT_VARIATION

    const productVariationData = {
      productId: productData.id,
      key: 'Quantity',
      ...data
    }

    try {
      const response = await axios.post(url, productVariationData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })

      console.log('added product variation', response.data)

      GetCafeProducts()
      onClose()

      if (myProductVariationData) {
        myProductVariationData.push(response.data)
        setDialogOpen(true)
      }
    } catch (err) {
      toast.error('Failed to add product variation')
      console.error('Error adding product:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Drawer content
  const DrawerList = (
    <Box sx={{ width: 400, padding: 4 }} role='presentation'>
      <Typography variant='h6' mb={2}>
        Add Product Variation
      </Typography>

      <form
        noValidate
        autoComplete='off'
        style={{ marginTop: 16 }}
        className='flex flex-col gap-6'
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name='salePrice'
          control={control}
          render={({ field }) => (
            <CustomTextField {...field} label='Sale Price' type='number' error={!!errors.salePrice} />
          )}
        />

        <Controller
          name='regularPrice'
          control={control}
          render={({ field }) => (
            <CustomTextField {...field} label='Regular Price' type='number' error={!!errors.regularPrice} />
          )}
        />

        <Controller
          name='value'
          control={control}
          render={({ field }) => <CustomTextField {...field} label='Value' error={!!errors.value} />}
        />

        <Controller
          name='points'
          control={control}
          render={({ field }) => <CustomTextField {...field} label='Points' type='number' error={!!errors.points} />}
        />

        <Button fullWidth variant='contained' type='submit'>
          {isLoading ? <CircularProgress color='inherit' size={20} /> : 'Submit'}
        </Button>
      </form>
    </Box>
  )

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={() => {
        onClose()

        if (setDialogOpen) {
          setDialogOpen(true)
        }
      }}
    >
      {DrawerList}
    </Drawer>
  )
}
