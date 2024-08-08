'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel
} from '@mui/material'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'

// Validation schemas
const mainCafeSchema = yup.object().shape({
  name: yup.string().required('Cafe name is required'),
  location: yup.string().required('Location is required'),
  address: yup.string().required('Address is required'),
  description: yup.string().required('Description is required'),
  priceConversionRate: yup.number().required('Price conversion rate is required').positive('Must be positive')
})

const branchCafeSchema = yup.object().shape({
  name: yup.string().required('Cafe name is required'),
  location: yup.string().required('Location is required'),
  address: yup.string().required('Address is required'),
  description: yup.string().required('Description is required'),
  priceConversionRate: yup.number().required('Price conversion rate is required').positive('Must be positive'),
  parentCafe: yup.string().required('Parent cafe is required'),
  manager: yup.string().nullable()
})

const getValidationSchema = radioValue => {
  return radioValue === 'mainCafe' ? mainCafeSchema : branchCafeSchema
}

export default function AddCafeDrawer({
  open,
  onClose,
  GetCafe,
  owners,
  cafes,
  updateCafeData,
  drawerType,
  setDrawerType
}) {
  const { authToken, managers } = React.useContext(AuthContext)
  const [radioValue, setRadioValue] = useState('mainCafe')
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitted },
    trigger
  } = useForm({
    resolver: yupResolver(getValidationSchema(radioValue)),
    mode: 'onBlur',
    defaultValues: {
      radioValue: 'mainCafe'
    }
  })

  useEffect(() => {
    trigger()
  }, [radioValue, trigger])

  const handleChange = event => {
    const { value } = event.target

    setRadioValue(value)
  }

  // Create cafe
  const createCafe = async data => {
    console.log('createCafe called with data:', data)
    const url = ENDPOINT.CREATE_CAFE

    const mainCafeData = {
      name: data.name,
      location: data.location,
      address: data.address,
      description: data.description,
      priceConversionRate: data.priceConversionRate
    }

    const branchCafeData = {
      name: data.name,
      location: data.location,
      address: data.address,
      description: data.description,
      priceConversionRate: data.priceConversionRate,
      parentId: data.parentCafe
    }

    const finalData = radioValue === 'mainCafe' ? mainCafeData : branchCafeData

    setIsLoading(true)

    try {
      const response = await axios.post(url, finalData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })

      console.log('cafe added:', response.data)
      toast.success(data.name + ' Cafe Added')
      reset()
    } catch (err) {
      console.error('Error adding cafe:', err)
      toast.error('Failed to add cafe')
    } finally {
      setIsLoading(false)
      onClose()
      GetCafe()
    }
  }

  const DrawerList = (
    <Box sx={{ width: 400, padding: 4 }} role='presentation'>
      <FormControl>
        <FormLabel id='demo-controlled-radio-buttons-group'>Cafe Type</FormLabel>
        <RadioGroup
          aria-labelledby='demo-controlled-radio-buttons-group'
          name='radioValue'
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}
          value={radioValue}
          onChange={handleChange}
        >
          <FormControlLabel value='mainCafe' disabled={drawerType === 'update'} control={<Radio />} label='Main Cafe' />
          <FormControlLabel
            value='branchCafe'
            disabled={drawerType === 'update'}
            control={<Radio />}
            label='Branch Cafe'
          />
        </RadioGroup>
      </FormControl>

      <form
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit(createCafe)}
        style={{ marginTop: 16 }}
        className='flex flex-col gap-6'
      >
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Cafe Name'
              placeholder='Enter cafe name'
              autoComplete='off'
              onChange={e => {
                field.onChange(e.target.value)
              }}
              error={isSubmitted && !!errors.name}
            />
          )}
        />

        <Controller
          name='location'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Location'
              placeholder='Enter location'
              autoComplete='off'
              onChange={e => {
                field.onChange(e.target.value)
              }}
              error={isSubmitted && !!errors.location}
            />
          )}
        />

        <Controller
          name='address'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Address'
              placeholder='Enter address'
              autoComplete='off'
              onChange={e => {
                field.onChange(e.target.value)
              }}
              error={isSubmitted && !!errors.address}
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
              onChange={e => {
                field.onChange(e.target.value)
              }}
              error={isSubmitted && !!errors.description}
            />
          )}
        />

        <Controller
          name='priceConversionRate'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Price Conversion Rate'
              placeholder='Enter price conversion rate'
              type='number'
              autoComplete='off'
              onChange={e => {
                field.onChange(e.target.value)
              }}
              error={isSubmitted && !!errors.priceConversionRate}
            />
          )}
        />

        {radioValue === 'branchCafe' && (
          <Controller
            name='parentCafe'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={isSubmitted && errors.parentCafe}>
                <InputLabel>Parent Cafe</InputLabel>
                <Select
                  {...field}
                  label='Parent Cafe'
                  onChange={e => {
                    field.onChange(e.target.value)
                  }}
                  value={field.value || ''}
                >
                  {cafes.map(cafe => (
                    <MenuItem key={cafe.id} value={cafe.id}>
                      {cafe.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        )}

        <Button fullWidth variant='contained' type='submit'>
          {isLoading ? <CircularProgress color='inherit' size={20} /> : 'Add Cafe'}
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
        setDrawerType('create')
      }}
    >
      {DrawerList}
    </Drawer>
  )
}
