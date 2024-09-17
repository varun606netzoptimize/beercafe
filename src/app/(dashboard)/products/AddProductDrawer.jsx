'use client'

import * as React from 'react'
import { useState, useContext } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'
import { CornerDownRight } from 'lucide-react'

// Validation schema
const productSchema = yup.object().shape({
  cafe: yup.string().required('Cafe is required'),
  brand: yup.string().required('Brand is required'),
  name: yup.string().required('Product name is required'),
  sku: yup.string().required('SKU is required'),
  description: yup.string().required('Description is required'),
  quantity: yup.number().required('Quantity is required').positive('Must be a positive number'),
  imageUrl: yup.string().required('Image URL is required').url('Must be a valid URL')
})

export default function AddProductDrawer({ open, onClose, getProducts }) {
  const { authToken, brands, cafeProducts, cafes } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted }
  } = useForm({
    resolver: yupResolver(productSchema),
    mode: 'onBlur'
  })

  const onSubmit = async data => {
    setIsLoading(true)

    const productData = {
      brandId: data.brand,
      cafeId: data.cafe,
      name: data.name,
      SKU: data.sku,
      description: data.description,
      quantity: data.quantity,
      image: data.imageUrl
    }

    try {
      const response = await axios.post(ENDPOINT.CREATE_PRODUCT, productData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })

      console.log('Product added:', response.data)
      toast.success(data.name + ' Product Added')
      reset()
      onClose()
      getProducts()
    } catch (err) {
      console.error('Error adding product:', err)
      toast.error('Failed to add product')
    } finally {
      setIsLoading(false)
    }
  }

  const DrawerList = (
    <Box sx={{ width: 400, padding: 4 }} role='presentation'>
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        <Controller
          name='cafe'
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={isSubmitted && !!errors.cafe}>
              <InputLabel>Select Cafe</InputLabel>
              <Select
                {...field}
                label='Select Cafe'
                onChange={e => field.onChange(e.target.value)}
                value={field.value || ''}
              >
                {cafes.cafes?.map(data => (
                  <>
                    <MenuItem value={data.id}>{data.name}</MenuItem>
                    {data.children?.map(child => (
                      <MenuItem key={child.id} value={child.id} style={{ paddingLeft: 24 }}>
                        <CornerDownRight size={16} />
                        {`${child.name}`}
                      </MenuItem>
                    ))}
                  </>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name='brand'
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={isSubmitted && !!errors.brand}>
              <InputLabel>Select Brand</InputLabel>
              <Select
                {...field}
                label='Select Brand'
                onChange={e => field.onChange(e.target.value)}
                value={field.value || ''}
              >
                {brands?.map(data => (
                  <MenuItem value={data.id} key={data.id}>
                    {data.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Product Name'
              placeholder='Enter product name'
              autoComplete='off'
              error={isSubmitted && !!errors.name}
            />
          )}
        />

        <Controller
          name='sku'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='SKU'
              placeholder='Enter SKU'
              autoComplete='off'
              error={isSubmitted && !!errors.sku}
            />
          )}
        />

        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Description'
              placeholder='Enter description'
              autoComplete='off'
              error={isSubmitted && !!errors.description}
            />
          )}
        />

        <Controller
          name='quantity'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Quantity'
              placeholder='Enter quantity'
              type='number'
              autoComplete='off'
              error={isSubmitted && !!errors.quantity}
            />
          )}
        />

        <Controller
          name='imageUrl'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Image URL'
              placeholder='Enter image URL'
              autoComplete='off'
              error={isSubmitted && !!errors.imageUrl}
            />
          )}
        />

        <Button fullWidth variant='contained' type='submit'>
          {isLoading ? <CircularProgress color='inherit' size={20} /> : 'Add Product'}
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
        reset()
      }}
    >
      {DrawerList}
    </Drawer>
  )
}
