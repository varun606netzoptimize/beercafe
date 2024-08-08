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

import { AuthContext } from '@/context/AuthContext'

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
  const { authToken, tokenCheck } = useContext(AuthContext)

  useEffect(() => {
    if (tokenCheck) {
      if (authToken.role === 'Manager') {
        redirect('/users')
      }

      if (authToken.role === 'User') {
        redirect('/comingSoon')
      }

      if (!authToken.token) {
        redirect('/login')
      }
    }
  }, [authToken])

  if (!authToken.token) {
    return null
  }

  return (
    <div className='flex flex-col gap-6'>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#948BF4' }}>
              <Typography variant='h6'>Total Cafes</Typography>
              <Typography variant='h4'>6</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#28C76F' }}>
              <Typography variant='h6'>Total Branches</Typography>
              <Typography variant='h4'>12</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#808390' }}>
              <Typography variant='h6'>Active Users</Typography>
              <Typography variant='h4'>12</Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Grid container spacing={2}>
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
        </Grid>
      </Box>
    </div>
  )
}
