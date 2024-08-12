'use client'
import * as React from 'react'
import { useState } from 'react'

import { Box, Button, CircularProgress, Drawer } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import CustomTextField from '@core/components/mui/TextField'
import { ENDPOINT } from '@/endpoints'
import { AuthContext } from '@/context/AuthContext'

const schema = yup.object().shape({
  firstname: yup.string().required('First Name is required'),
  lastname: yup.string().required('Last Name is required'),
  phoneNumber: yup.string().length(10, 'Phone number must be 10 digits').required('Phone number is required'),
  points: yup.number().optional()
})

export default function AddUserDrawer({ open, onClose, GetUsers, updateUserData, setUpdateUserData, drawerType }) {
  const { authToken } = React.useContext(AuthContext)

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

  React.useEffect(() => {
    if (drawerType === 'update' && updateUserData) {
      setValue('firstname', updateUserData.firstname)
      setValue('lastname', updateUserData.lastname)
      setValue('phoneNumber', updateUserData.phoneNumber)
      setValue('points', updateUserData.points || 0)
    } else if (drawerType === 'create') {
      reset()
    }
  }, [drawerType, updateUserData, setValue, reset])

  const CreateUser = async data => {
    const url = ENDPOINT.CREATE_CUSTOMER

    const userData = {
      firstname: data.firstname,
      lastname: data.lastname,
      phoneNumber: data.phoneNumber,
      points: Number(data.points)
    }

    setIsLoading(true)

    try {
      const res = await axios.post(url, userData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })

      console.log('User added:', userData, res.data)
      GetUsers()
      onClose()
      reset()
      setUpdateUserData(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add user')
      console.log('Failed to add user data:', err.response?.data)
    } finally {
      setIsLoading(false)
    }
  }

  const UpdateUser = async data => {
    const url = ENDPOINT.UPDATE_CUSTOMER

    const userData = {
      id: updateUserData.id,
      firstname: data.firstname,
      lastname: data.lastname,
      phoneNumber: data.phoneNumber,
      points: Number(data.points)
    }

    setIsLoading(true)

    try {
      const res = await axios.put(url, userData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('User updated:', res.data)
      GetUsers()
      onClose()
      setUpdateUserData(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user')
      console.log('Failed to update user data:', err.response)
    } finally {
      setIsLoading(false)
    }
  }

  const DrawerList = (
    <Box sx={{ width: 400, padding: 4 }} role='presentation'>
      <form
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit(drawerType === 'update' && updateUserData ? UpdateUser : CreateUser)}
        style={{ marginTop: 16 }}
        className='flex flex-col gap-6'
      >
        <Controller
          name='firstname'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='First Name'
              placeholder='Enter first name'
              onChange={e => {
                field.onChange(e.target.value)
                errorState !== null && setErrorState(null)
              }}
              {...((errors.firstname || errorState !== null) && {
                error: true,
                helperText: errors?.firstname?.message || errorState?.message
              })}
            />
          )}
        />

        <Controller
          name='lastname'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Last Name'
              placeholder='Enter last name'
              onChange={e => {
                field.onChange(e.target.value)
                errorState !== null && setErrorState(null)
              }}
              {...((errors.lastname || errorState !== null) && {
                error: true,
                helperText: errors?.lastname?.message || errorState?.message
              })}
            />
          )}
        />

        <Controller
          name='phoneNumber'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              type='number'
              label='Phone Number'
              placeholder='Enter phoneNumber number'
              onChange={e => {
                field.onChange(e.target.value)
                errorState !== null && setErrorState(null)
              }}
              {...((errors.phoneNumber || errorState !== null) && {
                error: true,
                helperText: errors?.phoneNumber?.message || errorState?.message
              })}
            />
          )}
        />

        <Controller
          name='points'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              type='number'
              label='Points'
              placeholder='Enter points'
              onChange={e => {
                field.onChange(e.target.value)
                errorState !== null && setErrorState(null)
              }}
            />
          )}
        />

        <Button fullWidth variant='contained' type='submit'>
          {isLoading ? (
            <CircularProgress color='text' size={20} />
          ) : drawerType === 'update' ? (
            'Update User'
          ) : (
            'Add User'
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
          setUpdateUserData(null)
        }}
      >
        {DrawerList}
      </Drawer>
      <ToastContainer />
    </>
  )
}
