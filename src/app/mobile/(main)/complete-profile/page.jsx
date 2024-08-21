'use client'

import { useState } from 'react'

import Link from 'next/link'

import { useSearchParams } from 'next/navigation'

import * as yup from 'yup'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import axios from 'axios'

import { CircularProgress } from '@mui/material'

import MobileButton from '@/components/MobileButton/MobileButton'
import { ENDPOINT } from '@/endpoints'

// Yup schema for form validation
const profileSchema = yup.object().shape({
  firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email format')
})

const CatergoryButtons = [
  { label: 'Lager beer' },
  { label: 'Bottle beer' },
  { label: 'Italian' },
  { label: 'Lager beer' },
  { label: 'Bottle beer' },
  { label: 'Italian' }
]

const Page = () => {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  const id = searchParams.get('id')

  console.log(id, 'searchPar')

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(profileSchema),
    mode: 'onSubmit'
  })

  const onSubmit = async data => {
    const url = ENDPOINT.UPDATE_CUSTOMER

    setIsLoading(true)

    try {
      const response = await axios.put(url, {
        id: id,
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email
      })

      console.log(response)
    } catch (e) {
      console.error('Error updating user:', e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className='px-4 pb-10 pt-6'>
        <div className='mb-8'>
          <Link href='#'>
            <img
              src='/images/mobile/left-arrow.png'
              alt='App Logo'
              width={33}
              height={33}
              className='object-contain cursor-pointer'
            />
          </Link>
        </div>
        <h2 className='text-titleColor'>Complete your profile</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-10 mt-8'>
            <div>
              <label className='text-lg'>First name</label>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type='text'
                    className={`w-full h-[46px] rounded-2xl border-2 border-black bg-transparent mt-3 px-5 text-lg ${
                      errors.firstName
                        ? 'border-error focus-visible:border-error outline-error'
                        : 'focus-visible:border-black'
                    }`}
                  />
                )}
              />
              {/* {errors.firstName && <p className='text-error text-sm'>{errors.firstName.message}</p>} */}
            </div>

            <div>
              <label className='text-lg'>Last name</label>
              <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type='text'
                    className={`w-full h-[46px] rounded-2xl border-2 border-black bg-transparent mt-3 px-5 text-lg ${
                      errors.lastName
                        ? 'border-error focus-visible:border-error outline-error'
                        : 'focus-visible:border-black'
                    }`}
                  />
                )}
              />
              {/* {errors.lastName && <p className='text-error text-sm'>{errors.lastName.message}</p>} */}
            </div>

            <div>
              <label className='text-lg'>Email</label>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type='email'
                    className={`w-full h-[46px] rounded-2xl border-2 border-black bg-transparent mt-3 px-5 text-lg ${
                      errors.email
                        ? 'border-error focus-visible:border-error outline-error'
                        : 'focus-visible:border-black'
                    }`}
                    placeholder='abc@gmail.com'
                  />
                )}
              />
              {/* {errors.email && <p className='text-error text-sm'>{errors.email.message}</p>} */}
            </div>
          </div>

          <div className='mt-10 flex flex-col'>
            <p>Food Preference(s)</p>
            <div className='mt-5 grid grid-cols-3 gap-7'>
              {CatergoryButtons.map((item, index) => (
                <button
                  type='button'
                  key={index}
                  className='hover:bg-primary bg-transparent min-w-[112px] border hover:border-transparent text-black text-base py-2 px-4 text-center rounded-2xl cursor-pointer w-fit hover:drop-shadow-md font-medium'
                  onClick={() => {}}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <MobileButton style='secondary' type='submit'>
            {isLoading ? <CircularProgress size={28} sx={{ color: '#F8C459' }} /> : '  Save profile info'}
          </MobileButton>
        </form>
      </div>
    </>
  )
}

export default Page
