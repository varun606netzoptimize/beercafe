'use client'
import * as React from 'react'
import { useContext, useEffect } from 'react'

import { redirect } from 'next/navigation'

import Grid from '@mui/material/Grid'
import { Box, Button, Card, Typography, CircularProgress, CardHeader, CardContent } from '@mui/material'

import axios from 'axios'

import { ENDPOINT } from '@/endpoints'

import { AuthContext } from '@/context/AuthContext'
import EarningReportsWithTabs from './(components)/EarningReportsWithTabs'
import StatisticsCard from './(components)/StatisticsCard'
import CongratulationsJohn from './(components)/Congratulations'

export default function Page() {
  const { authToken, tokenCheck, setPageTitle, cafes, users } = useContext(AuthContext)
  const [orderData, setOrderData] = React.useState(null)
  const [orderDataIsLoading, setOrderDataIsLoading] = React.useState(true)
  const [selectedFilter, setSelectedFilter] = React.useState('Current Week')

  useEffect(() => {
    if (tokenCheck) {
      if (!authToken.token) {
        redirect('/login')
      }

      getOrderWeekly()
      setPageTitle('Dashboard')
    }
  }, [authToken])

  if (!authToken.token) {
    return null
  }

  const getOrderMonthly = ({ year = new Date().getFullYear() } = {}) => {
    let url = `${ENDPOINT.GET_ORDERS_DATA_BY_MONTH}`
    const params = []

    // Conditionally append query parameters
    if (year) params.push(`year=${year}`)

    // If any parameters exist, join them with '&' and append to URL
    if (params.length > 0) {
      url += `?${params.join('&')}`
    }

    setOrderDataIsLoading(true)
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })
      .then(response => {
        const orders = response.data

        setOrderData(orders)
      })
      .catch(error => {
        console.error('Error fetching orders:', error)
      })
      .finally(() => {
        setOrderDataIsLoading(false)
      })
  }

  const getOrderWeekly = ({ year = new Date().getFullYear() } = {}) => {
    let url = `${ENDPOINT.GET_ORDERS_DATA_BY_WEEK}`

    setOrderDataIsLoading(true)
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })
      .then(response => {
        const orders = response.data

        setOrderData(orders)
      })
      .catch(error => {
        console.error('Error fetching orders:', error)
      })
      .finally(() => {
        setOrderDataIsLoading(false)
      })
  }

  const getOrderYearly = ({ startYear = '2014', endYear = new Date().getFullYear() } = {}) => {
    let url = `${ENDPOINT.GET_ORDERS_DATA_BY_YEAR}`
    const params = []

    // Conditionally append query parameters
    if (startYear) params.push(`startYear=${startYear}`)
    if (endYear) params.push(`endYear=${endYear}`)

    // If any parameters exist, join them with '&' and append to URL
    if (params.length > 0) {
      url += `?${params.join('&')}`
    }

    setOrderDataIsLoading(true)
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${authToken.token}`
        }
      })
      .then(response => {
        const orders = response.data

        setOrderData(orders)
      })
      .catch(error => {
        console.error('Error fetching orders:', error)
      })
      .finally(() => {
        setOrderDataIsLoading(false)
      })
  }

  return (
    <div className='flex flex-col gap-6'>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <CongratulationsJohn />
        </Grid>
        <Grid item xs={12} md={8}>
          <StatisticsCard />
        </Grid>
      </Grid>

      <Box>
        {orderData ? (
          <EarningReportsWithTabs
            serverMode='mode'
            orderData={orderData}
            getOrderMonthly={getOrderMonthly}
            getOrderWeekly={getOrderWeekly}
            getOrderYearly={getOrderYearly}
            loading={orderDataIsLoading}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={28} sx={{ color: 'blue', marginX: 'auto' }} />
          </Box>
        )}
      </Box>
    </div>
  )
}
