'use client'

import { useContext, useEffect, useState } from "react"

import { redirect } from "next/navigation"

import axios from "axios"

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'

const Page = () => {
  const { authToken, tokenCheck, setPageTitle, setOrders } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isTableRendering, setIsTableRendering] = useState(true)

  useEffect(() => {
    if (tokenCheck) {
      if (!authToken.token) {
        redirect('/login')
      } else {
        getOrders();
      }

      setPageTitle('Orders')
    }
  }, [authToken])

  const getOrders = () => {
    const url = `${ENDPOINT.GET_ALL_ORDERS}`

    setIsLoading(true)

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })
      .then(res => {
        console.log(res.data, "orders")
        setOrders(res.data)
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
      .finally(() => {
        setIsLoading(false)
        setIsTableRendering(false)
      })
  }

  return (
<>

</>
  )
}

export default Page
