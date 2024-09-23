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
  FormLabel
} from '@mui/material'

import IconButton from '@mui/material/IconButton'

import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'
import Link from 'next/link'

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
  const [slug, setSlug] = useState(null)

  const [loadingSlug, setLoadingSlug] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitted },
    trigger
  } = useForm({
    resolver: yupResolver(getValidationSchema(radioValue)),
    mode: 'onBlur',
    defaultValues: {
      radioValue: 'mainCafe'
    }
  })

  const nameValue = watch('name')

  const cleanSlug = name => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  useEffect(() => {
    trigger()
  }, [radioValue, trigger])

  useEffect(() => {
    if (nameValue && drawerType === 'create') {
      fetchSlug()
    }
  }, [nameValue, setValue, authToken.token])

  const fetchSlug = async () => {
    setLoadingSlug(true)

    try {
      const cleanedSlug = cleanSlug(nameValue)

      const response = await axios.post(
        ENDPOINT.GENERATE_SLUG,
        { baseSlug: cleanedSlug },
        {
          headers: {
            Authorization: `Bearer ${authToken.token}`
          }
        }
      )

      setSlug(response.data.slug)
    } catch (error) {
      console.error('Error generating slug:', error)
    } finally {
      setLoadingSlug(false)
    }
  }

  const handleChange = event => {
    const { value } = event.target

    setRadioValue(value)
  }

  useEffect(() => {
    if (drawerType === 'update' && updateCafeData) {
      setValue('name', updateCafeData.name)
      setSlug(updateCafeData.slug ? updateCafeData.slug : '')
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
    } else {
      reset()
      setSlug(null)
      setRadioValue('mainCafe')
    }
  }, [drawerType, updateCafeData, setValue, reset])

  const createCafe = async data => {
    const url = ENDPOINT.CREATE_CAFE

    const mainCafeData = {
      name: data.name,
      slug: slug,
      location: data.location,
      address: data.address,
      description: data.description,
      priceConversionRate: data.priceConversionRate
    }

    const branchCafeData = {
      name: data.name,
      location: data.location,
      slug: slug,
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

      toast.success(data.name + ' Cafe Added')

      if (radioValue === 'mainCafe') {
        updateUser(response.data.id)
      } else {
        setIsLoading(false)
        onClose()
        setSlug(null)
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
      setSlug(null)
      onClose()
      GetCafe()
    }
  }

  const updateCafe = async data => {
    const url = ENDPOINT.UPDATE_CAFE

    const mainCafeData = {
      id: updateCafeData.id,
      name: data.name,
      slug: slug,
      location: data.location,
      address: data.address,
      description: data.description,
      priceConversionRate: data.priceConversionRate
    }

    const branchCafeData = {
      id: updateCafeData.id,
      name: data.name,
      slug: slug,
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

      console.log('cafe updated:', response.data)
      toast.success(data.name + ' Cafe Updated')
      reset()
      setSlug(null)
      onClose()
    } catch (err) {
      console.log('Error updating cafe:', err.response.data.error)
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

        <div style={{ marginTop: '-20px', display: 'flex', alignItems: 'center' }}>
          <Link href={`${baseURL}/cafe/${slug}`}>
            <Typography variant='p' color={'primary'} sx={{ fontWeight: '600', fontSize: '14px' }}>
              {`${baseURL}/cafe/${slug}`}
            </Typography>
          </Link>

          {loadingSlug ? (
            <CircularProgress size={14} style={{ marginLeft: '2px' }} />
          ) : (
            <IconButton size='small' onClick={fetchSlug} style={{ marginLeft: slug ? '-4px' : '-6px' }}>
              <i className='tabler-reload text-[16px]' />
            </IconButton>
          )}
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
              autoComplete='off'
              type='number'
              error={isSubmitted && !!errors.priceConversionRate}
            />
          )}
        />

        {radioValue === 'branchCafe' && (
          <Controller
            name='parentCafe'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id='parent-cafe-label'>Parent Cafe</InputLabel>
                <Select
                  {...field}
                  labelId='parent-cafe-label'
                  label='Parent Cafe'
                  error={isSubmitted && !!errors.parentCafe}
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

        <Button type='submit' variant='contained' color='primary' sx={{ marginTop: 2 }} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : drawerType === 'create' ? 'Create Cafe' : 'Update Cafe'}
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
        setSlug(null)
      }}
    >
      {DrawerList}
    </Drawer>
  )
}
