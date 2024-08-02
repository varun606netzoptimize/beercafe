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
  Typography
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import axios from 'axios'

import { toast } from 'react-toastify'

import { data } from 'autoprefixer'

import CustomTextField from '@core/components/mui/TextField'
import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required('Cafe name is required'),
  location: yup.string().required('Location is required'),
  option: yup.string().required('Option is required')
})

export default function AddCafeDrawer({ open, onClose, GetCafe, owners }) {
  const { authToken } = React.useContext(AuthContext)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const [isLoading, setIsLoading] = useState(false)

  // Create cafe
  const createCafe = async data => {
    const url = ENDPOINT.CREATE_CAFE

    const cafeData = {
      name: data.name,
      location: data.location,
      ownerId: data.option
    }

    setIsLoading(true)

    await axios
      .post(url, cafeData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })
      .then(res => {
        console.log('user added:', res.data)
        toast.success(data.name + ' Cafe Added')
        reset()
      })
      .catch(err => {
        reset()
        console.log('failed to user data:', err.response)
      })
      .finally(() => {
        setIsLoading(false)
        onClose()
        GetCafe()
      })
  }

  const DrawerList = (
    <Box sx={{ width: 400, padding: 4 }} role='presentation'>
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
              {...(errors.name && {
                error: true
              })}
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
              autoComplete='off' // Prevent autofill
              onChange={e => {
                field.onChange(e.target.value)
              }}
              {...(errors.location && {
                error: true
              })}
            />
          )}
        />

        <Controller
          name='option'
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Option</InputLabel>
              <Select
                {...field}
                label='Option'
                onChange={e => {
                  field.onChange(e.target.value)
                }}
                error={!!errors.option}
                defaultValue=''
              >
                {owners.users?.map(data => {
                  return (
                    <MenuItem value={data.id} key={data.id}>
                      {data.name}
                    </MenuItem>
                  )
                })}
                {/* Add more options here if needed */}
              </Select>
              {errors.option && <Typography color='error'>{errors.option.message}</Typography>}
            </FormControl>
          )}
        />

        <Button fullWidth variant='contained' type='submit'>
          {isLoading ? <CircularProgress color='text' size={20} /> : 'Add Cafe'}
        </Button>
      </form>
    </Box>
  )

  return (
    <>
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
    </>
  )
}
