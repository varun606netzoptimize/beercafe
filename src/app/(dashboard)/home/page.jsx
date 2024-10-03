'use client'
import * as React from 'react'
import { useContext, useEffect } from 'react'

import { redirect } from 'next/navigation'

import { styled } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'
import { Box, Button, Card, Typography, CircularProgress } from '@mui/material'

import axios from 'axios'

import { ENDPOINT } from '@/endpoints'

import { AuthContext } from '@/context/AuthContext'
import EarningReportsWithTabs from './(components)/EarningReportsWithTabs'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

const mockData = {
  pieChartData: [
    { id: '1', label: 'Cafe 1', value: 10 },
    { id: '2', label: 'Cafe 2', value: 35 },
    { id: '3', label: 'Cafe 3', value: 45 },
    { id: '4', label: 'Cafe 4', value: 25 }
  ],
  barChartData: [
    { id: '1', label: 'Week 1', value: 10 },
    { id: '2', label: 'Week 2', value: 20 },
    { id: '3', label: 'Week 3', value: 15 },
    { id: '4', label: 'Week 4', value: 30 }
  ]
}

const mockBarData = {
  xAxisData: ['group A', 'group B', 'group C'],
  seriesData: [
    { name: 'Series 1', data: [4, 3, 5] },
    { name: 'Series 2', data: [1, 6, 3] },
    { name: 'Series 3', data: [2, 5, 6] }
  ]
}

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
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#948BF4' }}>
              <Typography variant='h6' color="white">Total Cafes</Typography>
              <Typography variant='h4' color="white">
                {cafes?.pagination?.totalCafes ? (
                  cafes?.pagination?.totalCafes
                ) : (
                  <CircularProgress size={28} sx={{ color: 'white' }} />
                )}
              </Typography>
            </Card>
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#948BF4' }}>
              <Typography variant='h6'>Total Users</Typography>
              <Typography variant='h4'>
                {users?.pagination?.totalUsers ? (
                  users?.pagination?.totalUsers
                ) : (
                  <CircularProgress size={28} sx={{ color: 'white' }} />
                )}
              </Typography>
            </Card>
          </Grid> */}
        </Grid>
      </Box>

      <Box>
        {/* <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Item>
              <Typography variant='h6'>Cafe Chart - Monthly Visits</Typography>
              <BarChart
                xAxis={[{ scaleType: 'band', data: mockBarData.xAxisData }]}
                series={mockBarData.seriesData.map(series => ({
                  data: series.data,
                  name: series.name
                }))}
                width={500}
                height={300}
              />
            </Item>
          </Grid>
          <Grid item xs={12} md={6}>
            <Item>
              <Typography variant='h6'>Pie Chart - Cafe Popularity</Typography>
              <PieChart
                series={[
                  {
                    data: mockData.pieChartData,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
                  }
                ]}
                width={400}
                height={200}
              />
            </Item>
          </Grid>
        </Grid> */}
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
