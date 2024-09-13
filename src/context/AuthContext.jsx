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

  const [pageTitle, setPageTitle] = useState('')
  const [tokenCheck, setTokenCheck] = useState(false)
  const [cafes, setCafes] = useState({ cafes: [], pagination: {} })
  const [users, setUsers] = useState({ users: [], pagination: null })
  const [currentUser, setCurrentUser] = useState(null)
  const [cafeProducts, setCafeProducts] = useState({ cafe: null, products: [] })
  const [brands, setBrands] = useState(null)
  const [cartItem, setCartItem] = useState([])
  const [beerProducts, setBeerProducts] = useState(null)
  const [isProductsLoading, setIsProductsLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [remainingBalance, setRemainingBalance] = useState('')

  const [userBalanceData, setUserBalanceData] = useState('')

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

  const addToCart = (product, variation) => {
    setCartItem({ ...product, ...variation, quantity: 1 })
  }

  // Fetch the products for the cafe
  const fetchCafeProducts = async slug => {
    setIsProductsLoading(true)

    try {
      const response = await axios.get(`${ENDPOINT.GET_CAFE_PRODUCTS}/?slug=${slug}`)

      if (response.data) {
        console.log('Cafe Products:', response.data)

        // Set state with cafe details and product variations
        setBeerProducts(response.data)

        console.log(beerProducts, 'beerProducts')

        // toast.success('Products fetched successfully!');
      } else {
        toast.error('No products found for this cafe.')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products.')
    } finally {
      setIsProductsLoading(false)
    }
  }

  // Fetch the cafe data based on slug
  const fetchData = async slug => {
    setIsLoading(true)

    try {
      const response = await axios.get(`${ENDPOINT.SLUG_CAFE}/${slug}`)

      if (response.data) {
        console.log('API Response:', response.data)
        setData(response.data)

        // toast.success(`Data for ${slug} fetched successfully!`)
      } else {
        toast.error('No data found for this URL')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data. URL might be incorrect.')
    } finally {
      setIsLoading(false)
    }
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
        setBrands,
        cartItem,
        setCartItem,
        addToCart,
        beerProducts,
        setBeerProducts,
        fetchCafeProducts,
        isProductsLoading,
        setOrderId,
        orderId,
        fetchData,
        userBalanceData,
        setUserBalanceData,
        remainingBalance,
        setRemainingBalance
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
