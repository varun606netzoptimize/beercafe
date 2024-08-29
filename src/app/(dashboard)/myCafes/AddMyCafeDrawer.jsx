'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'

const baseURL = process.env.NEXT_PUBLIC_APP_URL

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
  FormLabel,
  TextField
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
  slug: yup.string().required('Cafe name is required'),
  location: yup.string().required('Location is required'),
  address: yup.string().required('Address is required'),
  description: yup.string().required('Description is required'),
  priceConversionRate: yup.number().required('Price conversion rate is required').positive('Must be positive')
})

const branchCafeSchema = yup.object().shape({
  name: yup.string().required('Cafe name is required'),
  slug: yup.string().required('Cafe name is required'),
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

export default function AddMyCafeDrawer({
  open,
  onClose,
  GetCafe,
  owners,
  cafes,
  updateCafeData,
  drawerType,
  setDrawerType
}) {
  const { authToken, currentUser } = React.useContext(AuthContext)
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

  useEffect(() => {
    if (drawerType === 'update' && updateCafeData) {
      setValue('name', updateCafeData.name)
      setValue('slug', updateCafeData.slug ? updateCafeData.slug : '')
      setValue('location', updateCafeData.location)
      setValue('address', updateCafeData.address)
      setValue('description', updateCafeData.description)
      setValue('priceConversionRate', updateCafeData.priceConversionRate)

      if (updateCafeData.parentId) {
        setRadioValue('branchCafe')
        setValue('parentCafe', updateCafeData.parentId)
      } else {
        setRadioValue('mainCafe')
      }
    } else if (drawerType === 'create') {
      reset()
      setRadioValue('mainCafe')
    }
  }, [drawerType, updateCafeData, setValue, reset])

  // Create cafe
  const createCafe = async data => {
    const url = ENDPOINT.CREATE_CAFE

    const mainCafeData = {
      name: data.name,
      location: data.location,
      slug: data.slug,
      address: data.address,
      description: data.description,
      priceConversionRate: data.priceConversionRate
    }

    const branchCafeData = {
      name: data.name,
      location: data.location,
      slug: data.slug,
      address: data.address,
      description: data.description,
      priceConversionRate: data.priceConversionRate,
      parentId: data.parentCafe
    }

    const finalData = radioValue === 'mainCafe' ? mainCafeData : branchCafeData

    console.log(finalData)

    setIsLoading(true)

    try {
      const response = await axios.post(url, finalData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })

      toast.success(data.name + ' Cafe Added')

      if (radioValue === 'mainCafe') {
        updateUser(response.data.id)
      } else {
        setIsLoading(false)
        onClose()
        GetCafe()
      }

      reset()
    } catch (err) {
      console.error('Error adding cafe:', err)
      toast.error(err.response.data.error ? err.response.data.error : 'failed to update cafe')
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async cafeId => {
    const url = ENDPOINT.UPDATE_USER

    const userData = {
      id: currentUser.id,
      cafeIds: [cafeId]
    }

    setIsLoading(true)

    try {
      const response = await axios.put(url, userData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })
    } catch (err) {
      toast.error('Failed to update user!')
      reset()
    } finally {
      setIsLoading(false)
      onClose()
      GetCafe()
    }
  }

  // Update cafe
  const updateCafe = async data => {
    const url = ENDPOINT.UPDATE_CAFE

    const mainCafeData = {
      id: updateCafeData.id,
      name: data.name,
      slug: data.slug,
      location: data.location,
      address: data.address,
      description: data.description,
      priceConversionRate: data.priceConversionRate
    }

    const branchCafeData = {
      id: updateCafeData.id,
      name: data.name,
      slug: data.slug,
      location: data.location,
      address: data.address,
      description: data.description,
      priceConversionRate: data.priceConversionRate,
      parentId: data.parentCafe
    }

    const finalData = radioValue === 'mainCafe' ? mainCafeData : branchCafeData

    setIsLoading(true)

    try {
      const response = await axios.put(url, finalData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })

      console.log('cafe added:', response.data)
      toast.success(data.name + ' Cafe Added')
      reset()
      onClose()
    } catch (err) {
      console.log('Error adding cafe:', err.response.data.error)
      toast.error(err.response.data.error ? err.response.data.error : 'failed to update cafe')
    } finally {
      setIsLoading(false)
      GetCafe()
      setDrawerType('create')
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
        onSubmit={handleSubmit(drawerType === 'create' ? createCafe : updateCafe)}
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

        <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', gap: '4px', marginTop: '-16px' }}>
          <Typography
            variant='p'
            color={'primary'}
            sx={{ fontWeight: '600', fontSize: '13px' }}
          >{`${baseURL}/cafe/`}</Typography>
          <Controller
            name='slug'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant='standard'
                size='small'
                placeholder='slug name'
                autoComplete='off'
                onChange={e => {
                  field.onChange(e.target.value)
                }}
                error={isSubmitted && !!errors.slug}
              />
            )}
          />
        </div>

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
          {isLoading ? (
            <CircularProgress color='inherit' size={20} />
          ) : drawerType === 'update' ? (
            'Update Cafe'
          ) : (
            'Add Cafe'
          )}
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
