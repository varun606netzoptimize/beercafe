'use client'

import * as React from 'react'
import { useState, useContext, useEffect } from 'react'

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
  key: yup.string().required('Value is required'),
  salePrice: yup.number().required('Sale price is required').positive(),
  regularPrice: yup.number().required('Regular price is required').positive(),
  points: yup.number().required('Points are required').positive().integer()
})

export default function AddVariationDrawer({
  open,
  onClose,
  setDialogOpen = null,
  productData,
  getProducts,
  myProductVariationData = null,
  updateData = null,
  type
}) {
  const { authToken } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      key: '',
      value: '',
      salePrice: '',
      regularPrice: '',
      points: ''
    }
  })

  useEffect(() => {
    if (type === 'update' && updateData) {
      // Pre-fill the form with updateData values
      setValue('key', updateData.key)
      setValue('value', updateData.value)
      setValue('salePrice', updateData.salePrice)
      setValue('regularPrice', updateData.regularPrice)
      setValue('points', updateData.points)
    }
  }, [type, updateData, setValue])

  // Form submit handler
  const onSubmit = async data => {
    console.log('onSubmit function called')
    setIsLoading(true)

    const url = ENDPOINT.ADD_PRODUCT_VARIATION

    const productVariationData = {
      productId: productData.id,
      ...data
    }

    try {
      const response = await axios.post(url, productVariationData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })

      if (myProductVariationData) {
        myProductVariationData.push(response.data)
        setDialogOpen(true)
      }

      getProducts()
      onClose()
    } catch (err) {
      console.error('Error adding product:', err.response ? err.response.data : err.message)
      toast.error('Failed to add product variation')
    } finally {
      setIsLoading(false)
    }
  }

  const onUpdate = async data => {
    console.log('onSubmit function called')
    setIsLoading(true)

    const url = ENDPOINT.UPDATE_PRODUCT_VARIATION

    const productVariationData = {
      variationId: updateData.id,
      ...data
    }

    try {
      const response = await axios.put(url, productVariationData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })

      getProducts()
      onClose()

      if (myProductVariationData) {
        const index = myProductVariationData.findIndex(item => item.id === updateData.id)

        if (index !== -1) {
          myProductVariationData[index] = response.data
        }

        setDialogOpen(true)
      }
    } catch (err) {
      console.error('Error updating product:', err.response ? err.response.data : err.message)
      toast.error('Failed to update product variation')
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
        onSubmit={handleSubmit(type == 'add' ? onSubmit : onUpdate)}
      >
        <Controller
          name='key'
          control={control}
          render={({ field }) => <CustomTextField {...field} label='Key' error={!!errors.key} />}
        />

        <Controller
          name='value'
          control={control}
          render={({ field }) => <CustomTextField {...field} label='Value' error={!!errors.value} />}
        />

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
          name='points'
          control={control}
          render={({ field }) => <CustomTextField {...field} label='Points' type='number' error={!!errors.points} />}
        />

        <Button fullWidth variant='contained' type='submit'>
          {isLoading ? <CircularProgress color='inherit' size={20} /> : type == 'add' ? 'Submit' : 'Update'}
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
        reset() // Reset the form when the drawer closes

        if (setDialogOpen) {
          setDialogOpen(true)
        }
      }}
    >
      {DrawerList}
    </Drawer>
  )
}
