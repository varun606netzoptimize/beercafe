'use client'

// React Imports
import { useContext, useEffect, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import classnames from 'classnames'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// Component Imports
import axios from 'axios'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'
import { ENDPOINT } from '@/endpoints'
import { AuthContext } from '@/context/AuthContext'

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const phoneSchema = yup.object().shape({
  phone: yup.string().length(10).required('Phone number is required')
})

const otpSchema = yup.object().shape({
  otp: yup.string().length(6).required('OTP is required')
})

export default function UserLogin({ mode }) {
  const { authToken, setAuthToken } = useContext(AuthContext)

  // States
  const [errorState, setErrorState] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userPhone, setUserPhone] = useState(null)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(phoneSchema)
  })

  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors }
  } = useForm({
    resolver: yupResolver(otpSchema)
  })

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const onPhoneSubmit = async data => {
    const url = ENDPOINT.REQUEST_OTP

    const userData = {
      phone: data.phone
    }

    setIsLoading(true)

    await axios
      .post(url, userData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      })
      .then(res => {
        setUserPhone(res.data.phone)
        toast.info('Your OTP is: ' + res.data.otp)
      })
      .catch(err => {
        console.log('OTP could not be sent', err.response, userData)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const onOtpSubmit = async data => {
    const url = ENDPOINT.VERIFY_OTP

    setIsLoading(true)

    const userData = {
      phone: data.phone,
      otp: data.otp
    }

    await axios
      .post(url, userData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      })
      .then(res => {
        setAuthToken({
          token: res.data.token,
          role: 'User'
        })
      })
      .catch(err => {
        console.log('otp verification failed', err.response.data.message)

        if (err.response.data.message) {
          toast.error(err.response.data.message + '🤨')
        } else {
          toast.error('something went wrong')
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && (
          <MaskImg
            alt='mask'
            src={authBackground}
            className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
          />
        )}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>Please sign-in to your account</Typography>
          </div>
          {!userPhone ? (
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onPhoneSubmit)} className='flex flex-col gap-6'>
              <Controller
                name='phone'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    autoFocus
                    fullWidth
                    type='tel'
                    label='Phone Number'
                    placeholder='Enter your phone number'
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

              <Button fullWidth variant='contained' type='submit'>
                {isLoading ? <CircularProgress color='text' size={20} /> : 'Submit'}
              </Button>

              <Divider className='gap-2 text-textPrimary'>or</Divider>
            </form>
          ) : (
            <form noValidate autoComplete='off' onSubmit={handleOtpSubmit(onOtpSubmit)} className='flex flex-col gap-6'>
              <Controller
                name='phone'
                control={otpControl}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Phone Number'
                    value={userPhone}
                    InputProps={{
                      readOnly: true
                    }}
                  />
                )}
              />
              <Controller
                name='otp'
                control={otpControl}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='text'
                    label='OTP'
                    placeholder='Enter the OTP'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((otpErrors.otp || errorState !== null) && {
                      error: true,
                      helperText: otpErrors?.otp?.message || errorState?.message[0]
                    })}
                  />
                )}
              />

              <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                <FormControlLabel control={<Checkbox />} label='Remember me' />
              </div>

              <Button fullWidth variant='contained' type='submit'>
                {isLoading ? <CircularProgress color='text' size={20} /> : 'Verify OTP'}
              </Button>
            </form>
          )}
          <div className='flex justify-center items-center flex-wrap gap-2'>
            <Typography color='primary' component={Link} href='/login'>
              Login as an Admin
            </Typography>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
