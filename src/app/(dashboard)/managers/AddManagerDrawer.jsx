'use client'
import * as React from 'react'
import { useState } from 'react'

import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { Box, Button, CircularProgress, Drawer, MenuItem, Select, FormControl, InputLabel } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string().length(10).required('Phone number is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  dropdown: yup.string().required('Please select an option')
})

export default function AddManagerDrawer({
  open,
  onClose,
  drawerType,
  GetManagers,
  setDrawerType,
  updateManagerData,
  setUpdateManagerData
}) {
  const { authToken, cafes } = React.useContext(AuthContext)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const [errorState, setErrorState] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  React.useEffect(() => {
    if (drawerType === 'update' && updateManagerData) {
      setValue('dropdown', updateManagerData.cafe.id)
      setValue('name', updateManagerData.name)
      setValue('email', updateManagerData.email)
      setValue('phone', updateManagerData.phone)
      setValue('points', updateManagerData.points || 0)
    } else if (drawerType === 'create') {
      reset()
    }
  }, [drawerType, updateManagerData, setValue])

  const createManager = async data => {
    const url = ENDPOINT.ADD_MANAGER

    const userData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      cafeId: data.dropdown
    }

    setIsLoading(true)

    await axios
      .post(url, userData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })
      .then(res => {
        console.log('user added:', res.data)
      })
      .catch(err => {
        reset()
        console.log('failed to user data:', err.response)
      })
      .finally(() => {
        reset()
        GetManagers()
        setIsLoading(false)
        onClose()
        setUpdateManagerData(null)
      })
  }

  const updateManager = async data => {
    const url = ENDPOINT.UPDATE_MANAGER

    const userData = {
      id: updateManagerData.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      cafeId: data.dropdown
    }

    setIsLoading(true)

    try {
      const res = await axios.put(url, userData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('manager updated:', res.data)
      reset()
      GetManagers()
      onClose()
      setUpdateManagerData(null)
    } catch (err) {
      toast.error(err.response.data.message ? err.response.data.message : 'Failed to update manager')

      console.log('failed to update user data:', err.response)
    } finally {
      setIsLoading(false)
    }
  }

  const DrawerList = (
    <Box sx={{ width: 400, padding: 4 }} role='presentation'>
      <form
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit(drawerType === 'update' && updateManagerData ? updateManager : createManager)}
        style={{ marginTop: 16 }}
        className='flex flex-col gap-6'
      >
        <Controller
          name='dropdown'
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.dropdown} required>
              <InputLabel>Select Cafe</InputLabel>
              <Select
                {...field}
                label='Select Cafe'
                onChange={e => {
                  field.onChange(e.target.value)
                  errorState !== null && setErrorState(null)
                }}
                sx={{ width: '100%' }} // Match the width to the TextField
                {...(errors.dropdown && {
                  error: true,
                  helperText: errors.dropdown.message
                })}
              >
                {cafes.map(data => {
                  return (
                    <MenuItem value={data.id} key={data.id}>
                      {data.name}
                    </MenuItem>
                  )
                })}
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
              label='Name'
              placeholder='Enter full name'
              autoComplete='off' // Prevent autofill
              onChange={e => {
                field.onChange(e.target.value)
                errorState !== null && setErrorState(null)
              }}
              {...((errors.name || errorState !== null) && {
                error: true,
                helperText: errors?.name?.message || errorState?.message[0]
              })}
            />
          )}
        />

        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              type='email'
              label='Email'
              placeholder='Enter email'
              autoComplete='off' // Prevent autofill
              onChange={e => {
                field.onChange(e.target.value)
                errorState !== null && setErrorState(null)
              }}
              {...((errors.email || errorState !== null) && {
                error: true,
                helperText: errors?.email?.message || errorState?.message[0]
              })}
            />
          )}
        />

        <Controller
          name='phone'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              type='number'
              label='Phone Number'
              placeholder='Enter phone number'
              autoComplete='off' // Prevent autofill
              onChange={e => {
                field.onChange(e.target.value)
                errorState !== null && setErrorState(null)
              }}
              {...((errors.phone || errorState !== null) && {
                error: true,
                helperText: errors?.phone?.message || errorState?.message[0]
              })}
            />
          )}
        />

        <Controller
          name='password'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Password'
              placeholder='············'
              id='login-password'
              type={isPasswordShown ? 'text' : 'password'}
              autoComplete='new-password' // Prevent autofill
              onChange={e => {
                field.onChange(e.target.value)
                errorState !== null && setErrorState(null)
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              {...(errors.password && { error: true, helperText: errors.password.message })}
            />
          )}
        />

        <Controller
          name='confirmPassword'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Confirm Password'
              placeholder='············'
              type={isConfirmPasswordShown ? 'text' : 'password'}
              autoComplete='new-password' // Prevent autofill
              onChange={e => {
                field.onChange(e.target.value)
                errorState !== null && setErrorState(null)
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <i className={isConfirmPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              {...(errors.confirmPassword && { error: true, helperText: errors.confirmPassword.message })}
            />
          )}
        />

        <Button fullWidth variant='contained' type='submit'>
          {isLoading ? (
            <CircularProgress color='text' size={20} />
          ) : drawerType === 'update' ? (
            'Update Manager'
          ) : (
            'Add Manager'
          )}
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
          setValue()
          setUpdateManagerData(null)
        }}
      >
        {DrawerList}
      </Drawer>

    </>
  )
}
