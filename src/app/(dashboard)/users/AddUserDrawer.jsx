import React, { useState, useContext, useEffect } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  phone: yup
    .string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  firstDropdown: yup.string().required('This field is required'),
  secondDropdown: yup.string().notRequired()
})

export default function AddUserDrawer({ open, onClose, drawerType, setDrawerType, cafes, GetUsers, updateUserData }) {
  const { authToken } = useContext(AuthContext)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  const handleClickShowPassword = () => setIsPasswordShown(!isPasswordShown)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(!isConfirmPasswordShown)

  useEffect(() => {
    if (drawerType === 'update' && updateUserData) {
      setValue('name', updateUserData.name)
      setValue('email', updateUserData.email)
      setValue('phone', updateUserData.phoneNumber || '')
      setValue(
        'firstDropdown',
        updateUserData.userType === 'owner' ? '66b3583586109427057d98a0' : '66b3583586109427057d98a1'
      )

      // Populate secondDropdown if applicable
      if (updateUserData.cafes && updateUserData.cafes.length > 0) {
        setValue('secondDropdown', updateUserData.cafes[0].id) // Assuming you want to use the first cafe if multiple are available
      } else {
        setValue('secondDropdown', '')
      }
    } else if (drawerType === 'create') {
      reset()
    }
  }, [drawerType, updateUserData, setValue, reset])

  const createUser = async data => {
    const url = ENDPOINT.CREATE_USER

    const userData = {
      name: data.name,
      email: data.email,
      password: data.password,
      phoneNumber: data.phone,
      password: data.password,
      userTypeId: data.firstDropdown
    }

    if (data.secondDropdown) {
      userData.cafeIds = [data.secondDropdown]
    }

    console.log(userData)

    setIsLoading(true)

    try {
      const response = await axios.post(url, userData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })

      toast.success('User created successfully!')
    } catch (err) {
      toast.error('Failed to create user!')
      reset()
    } finally {
      setIsLoading(false)
      onClose()
      reset()
      GetUsers()
      setDrawerType('create')
    }
  }

  const updateUser = async data => {
    const url = ENDPOINT.UPDATE_USER

    const userData = {
      id: updateUserData.id,
      name: data.name,
      email: data.email,
      password: data.password,
      phoneNumber: data.phone,
      password: data.password,
      userTypeId: data.firstDropdown
    }

    if (data.secondDropdown) {
      userData.cafeIds = [data.secondDropdown]
    }

    setIsLoading(true)

    try {
      const response = await axios.put(url, userData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })

      toast.success('User created successfully!')
    } catch (err) {
      toast.error('Failed to create user!')
      reset()
    } finally {
      setIsLoading(false)
      onClose()
      reset()
      GetUsers()
      setDrawerType('create')
    }
  }

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
        <Box sx={{ width: 400, padding: 4 }} role='presentation'>
          <form
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit(drawerType === 'create' ? createUser : updateUser)}
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
                  label='Name'
                  placeholder='Enter full name'
                  error={!!errors.name}
                  helperText={errors.name?.message}
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
                  error={!!errors.email}
                  helperText={errors.email?.message}
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
                  placeholder='Enter Phone Number'
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
            <FormControl fullWidth error={!!errors.firstDropdown}>
              <InputLabel>User Type</InputLabel>
              <Controller
                name='firstDropdown'
                control={control}
                render={({ field }) => (
                  <Select {...field} label='User Type'>
                    <MenuItem value='66b3583586109427057d98a0'>Owner</MenuItem>
                    <MenuItem value='66b3583586109427057d98a1'>Manager</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
            <FormControl fullWidth error={!!errors.secondDropdown}>
              <InputLabel>Cafe</InputLabel>
              <Controller
                name='secondDropdown'
                control={control}
                render={({ field }) => (
                  <Select {...field} label='Cafe'>
                    {cafes.map(data => {
                      return (
                        <MenuItem value={data.id} key={data.id}>
                          {data.name}
                        </MenuItem>
                      )
                    })}
                  </Select>
                )}
              />
            </FormControl>
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Password'
                  placeholder='············'
                  type={isPasswordShown ? 'text' : 'password'}
                  autoComplete='new-password'
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                          <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
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
                  autoComplete='new-password'
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
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
                />
              )}
            />
            <Button fullWidth variant='contained' type='submit'>
              {isLoading ? (
                <CircularProgress color='inherit' size={20} />
              ) : drawerType === 'update' ? (
                'Update Owner'
              ) : (
                'Add Owner'
              )}
            </Button>
          </form>
        </Box>
      </Drawer>
      <ToastContainer />
    </>
  )
}
