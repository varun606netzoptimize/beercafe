'use client'
import * as React from 'react'
import { useState } from 'react'

import { Box, Button, CircularProgress, Drawer, Typography } from '@mui/material'
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
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string().length(10).required('Phone number is required')
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
      setValue('name', updateUserData.name)
      setValue('email', updateUserData.email)
      setValue('phone', updateUserData.phone)
      setValue('points', updateUserData.points || 0)
    } else if (drawerType === 'create') {
      reset()
    }
  }, [drawerType, updateUserData, setValue])

  const CreateUser = async data => {
    const url = ENDPOINT.ADD_USER

    const userData = {
      name: data.name,
      email: data.email,
      phone: data.phone
    }

    const userDataPoints = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      points: Number(data.points)
    }

    const apiUserData = !data.points || data.points == '' ? userData : userDataPoints

    setIsLoading(true)

    await axios
      .post(url, apiUserData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })
      .then(res => {
        console.log('user added:', apiUserData, res.data)
        GetUsers()
        onClose()
        setUpdateUserData(null)
      })
      .catch(err => {
        toast.error(err.response.data.message ? err.response.data.message : 'Failed to add user')
        console.log('failed to add user data:', err.response.data)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const UpdateUser = async data => {
    const url = ENDPOINT.UPDATE_USER

    const userData = {
      id: updateUserData.id,
      name: data.name,
      email: data.email,
      phone: data.phone
    }

    const userDataPoints = {
      id: updateUserData.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      points: Number(data.points)
    }

    const apiUserData = !data.points || data.points === '' ? userData : userDataPoints

    console.log(apiUserData)

    setIsLoading(true)

    try {
      const res = await axios.put(url, apiUserData, {
        headers: {
          Authorization: `Bearer ${authToken.token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('user updated:', res.data)
      GetUsers()
      onClose()
      setUpdateUserData(null)
    } catch (err) {
      toast.error(err.response.data.message ? err.response.data.message : 'Failed to update user')
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
        onSubmit={handleSubmit(drawerType === 'update' && updateUserData ? UpdateUser : CreateUser)}
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
          ) : drawerType == 'update' ? (
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
      <ToastContainer />
      <Drawer
        anchor='right'
        open={open}
        onClose={() => {
          onClose()
          reset()
          setUpdateUserData(null)
          setValue()
        }}
      >
        {DrawerList}
      </Drawer>
    </>
  )
}
