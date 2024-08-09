'use client'

import { createContext, use, useEffect, useState } from 'react'

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

  const [currentUser, setCurrentUser] = useState(null)

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

        setCurrentUser(res.data.user)

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

  return (
    <AuthContext.Provider
      value={{
        authToken,
        setAuthToken,
        tokenCheck,
        cafes,
        setCafes,
        managerDetails,
        managers,
        setManagers,
        currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
