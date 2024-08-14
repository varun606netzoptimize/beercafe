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

  const [pageTitle, setPageTitle] = useState('')
  const [tokenCheck, setTokenCheck] = useState(false)
  const [cafes, setCafes] = useState({ cafes: [], pagination: {} })
  const [users, setUsers] = useState({ users: [], pagination: null })
  const [currentUser, setCurrentUser] = useState(null)
  const [cafeProducts, setCafeProducts] = useState({ cafe: null, products: [] })
  const [brands, setBrands] = useState(null)

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
        GetUsers()
        GetBrands()
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

  const GetUsers = async () => {
    const url = ENDPOINT.GET_USERS

    await axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken.token
        }
      })
      .then(res => {
        setUsers({ users: res.data.users, pagination: res.data.pagination })
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
  }

  const GetBrands = async () => {
    const url = ENDPOINT.GET_BRANDS

    await axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken.token
        }
      })
      .then(res => {
        setBrands(res.data)
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
        users,
        setUsers,
        currentUser,
        setPageTitle,
        pageTitle,
        cafeProducts,
        setCafeProducts,
        brands,
        setBrands
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
