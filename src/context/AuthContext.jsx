'use client'

import { createContext, useEffect, useState } from 'react'

import axios from 'axios'

import { toast } from 'react-toastify'

import { ENDPOINT } from '@/endpoints'

export const AuthContext = createContext()

// ** 3rd party libraries

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState({
    token: null,
    role: null
  })

  const [tokenCheck, setTokenCheck] = useState(false)
  const [cafes, setCafes] = useState({ cafes: [], pagination: {} })
  const [managerDetails, setManagerDetails] = useState(null)
  const [managers, setManagers] = useState({ managers: [], pagination: null })

  useEffect(() => {
    // window.localStorage.removeItem('authToken')
    // window.localStorage.removeItem('userRole')

    const storedToken = window.localStorage.getItem('authToken')
    const storedRole = window.localStorage.getItem('userRole')

    setAuthToken({
      token: storedToken ? storedToken : null,
      role: storedRole ? storedRole : null
    })
  }, [])

  useEffect(() => {
    if (authToken.token) {
      VerifyUser()
    } else {
      setTokenCheck(true)
    }
  }, [authToken])

  const VerifyUser = () => {
    const url = ENDPOINT.VERIFY

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })
      .then(res => {
        console.log(res.data)

        toast.success(
          res.data.userType == 'Unknown' ? '👋 Welcome to BeerCafe ' : '👋 Welcome to BeerCafe ' + res.data.userType
        )

        window.localStorage.setItem('authToken', authToken.token)
        window.localStorage.setItem('userRole', authToken.role)
      })
      .catch(err => {
        console.log('failed to verify user', err.response)
        window.localStorage.removeItem('authToken')
        window.localStorage.removeItem('userRole')
        setAuthToken({
          token: null,
          role: null
        })
      })
      .finally(() => {
        setTokenCheck(true)
        GetCafe()
        GetManagers()
      })
  }

  const GetCafe = async () => {
    const url = ENDPOINT.GET_CAFES

    await axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken.token
        }
      })
      .then(res => {
        setCafes({ cafes: res.data.cafes, pagination: res.data.pagination })
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
  }

  const GetManagers = () => {
    const url = `${ENDPOINT.GET_USERS}?userType=manager`

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken.token
        }
      })
      .then(res => {
        setManagers({ managers: res.data.users, pagination: res.data.pagination })
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
  }

  return (
    <AuthContext.Provider
      value={{ authToken, setAuthToken, tokenCheck, cafes, setCafes, managerDetails, managers, setManagers }}
    >
      {children}
    </AuthContext.Provider>
  )
}
