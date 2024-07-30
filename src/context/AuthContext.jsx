'use client'

import { createContext, useEffect, useState } from 'react'

import axios from 'axios'

// import { toast } from 'react-toastify'

import { ENDPOINT } from '@/endpoints'

export const AuthContext = createContext()

// ** 3rd party libraries

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState({
    token: null,
    role: null
  })

  const [tokenCheck, setTokenCheck] = useState(false)
  const [cafes, setCafes] = useState([])

  useEffect(() => {
    // window.localStorage.removeItem('authToken')
    // window.localStorage.removeItem('userRole')

    const storedToken = window.localStorage.getItem('authToken')
    const storedRole = window.localStorage.getItem('userRole')

    console.log(storedToken)

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
        console.log('user verified:', res.data)

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

  const GetCafe = () => {
    const url = ENDPOINT.GET_CAFES

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken.token
        }
      })
      .then(res => {
        setCafes(res.data.cafes)
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
  }

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, tokenCheck, cafes, setCafes }}>
      {children}
    </AuthContext.Provider>
  )
}
