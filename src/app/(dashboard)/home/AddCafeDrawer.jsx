'use client'
import * as React from 'react'
import { useState } from 'react'

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

import { Controller, useForm } from 'react-hook-form'
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
  option: yup.string().required('Option is required')
})

const branchCafeSchema = yup.object().shape({
  name: yup.string().required('Cafe name is required'),
  location: yup.string().required('Location is required'),
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
    formState: { errors }
  } = useForm({
    resolver: yupResolver(getValidationSchema(radioValue)),
    defaultValues: {
      radioValue: 'mainCafe'
    }
  })

  React.useEffect(() => {
    if (drawerType === 'update' && updateCafeData) {
      if (updateCafeData.parentId) {
        setRadioValue('branchCafe')
        setValue('name', updateCafeData.name)
        setValue('location', updateCafeData.location)
        setValue('parentCafe', updateCafeData.parentId)
        setValue('manager', updateCafeData.managerId)
      } else {
        setRadioValue('mainCafe')
        setValue('name', updateCafeData.name)
        setValue('location', updateCafeData.location)
        setValue('option', updateCafeData.ownerId)
      }
    } else if (drawerType === 'create') {
      reset()
    }
  }, [drawerType, updateCafeData, setValue])

  const handleChange = event => {
    const { value } = event.target

    setRadioValue(value)
  }

  // Create cafe
  const createCafe = async data => {
    const url = ENDPOINT.CREATE_CAFE

    const mainCafeData = {
      name: data.name,
      location: data.location,
      ownerId: data.option
    }

    const branchCafeData = {
      name: data.name,
      location: data.location,
      parentId: data.parentCafe,
      ...(data.manager && { managerId: data.manager })
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

      console.log('cafe added:', response.data)
      toast.success(data.name + ' Cafe Added')
      reset()
    } catch (err) {
      toast.error('Failed to add cafe')
    } finally {
      setIsLoading(false)
      onClose()
      GetCafe()
    }
  }

  // Create cafe
  const updateCafe = async data => {
    const url = ENDPOINT.UPDATE_CAFE

    const mainCafeData = {
      id: updateCafeData.id,
      name: data.name,
      location: data.location,
      ownerId: data.option
    }

    const branchCafeData = {
      id: updateCafeData.id,
      name: data.name,
      location: data.location,
      parentId: data.parentCafe,
      ...(data.manager && { managerId: data.manager })
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
    } catch (err) {
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
        onSubmit={handleSubmit(drawerType === 'update' && updateCafeData ? updateCafe : createCafe)}
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
              error={!!errors.name}
              helperText={errors.name?.message}
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
              error={!!errors.location}
              helperText={errors.location?.message}
            />
          )}
        />

        {radioValue === 'mainCafe' ? (
          <Controller
            name='option'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Cafe Owner</InputLabel>
                <Select
                  {...field}
                  label='Cafe Owner'
                  onChange={e => {
                    field.onChange(e.target.value)
                  }}
                  error={!!errors.option}
                  defaultValue=''
                >
                  {owners.users?.map(data => (
                    <MenuItem value={data.id} key={data.id}>
                      {data.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.option && <Typography color='error'>{errors.option.message}</Typography>}
              </FormControl>
            )}
          />
        ) : (
          <>
            <Controller
              name='parentCafe'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Parent Cafe</InputLabel>
                  <Select
                    {...field}
                    label='Parent Cafe'
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    error={!!errors.parentCafe}
                    defaultValue=''
                  >
                    {cafes.map(data => (
                      <MenuItem value={data.id} key={data.id}>
                        {data.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.parentCafe && <Typography color='error'>{errors.parentCafe.message}</Typography>}
                </FormControl>
              )}
            />
            <Controller
              name='manager'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Manager</InputLabel>
                  <Select
                    {...field}
                    label='Manager'
                    onChange={e => {
                      field.onChange(e.target.value)
                    }}
                    error={!!errors.manager}
                    defaultValue=''
                  >
                    {managers.managers.map(data => (
                      <MenuItem value={data.id} key={data.id}>
                        {data.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.manager && <Typography color='error'>{errors.manager.message}</Typography>}
                </FormControl>
              )}
            />
          </>
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
