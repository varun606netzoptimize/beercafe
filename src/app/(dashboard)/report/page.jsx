'use client'
import * as React from 'react'

import { useContext, useEffect, useState } from 'react'

import { redirect } from 'next/navigation'

import axios from 'axios'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'
import { Box, Button, Card, CircularProgress, Typography } from '@mui/material'
import { axisClasses } from '@mui/x-charts/ChartsAxis'

import { AuthContext } from '@/context/AuthContext'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

const data = [
  { id: 0, value: 10, label: 'IPA' },
  { id: 1, value: 15, label: 'Lager' },
  { id: 2, value: 1, label: 'Stout' },
  { id: 3, value: 25, label: 'Pale Ale' },
  { id: 4, value: 4, label: 'Porter' },
  { id: 5, value: 8, label: 'Pilsner' },
  { id: 6, value: 14, label: 'Wheat Beer' }
]

const barData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    { label: 'IPA', data: [35, 44, 24, 34] },
    { label: 'Lager', data: [51, 60, 49, 30] },
    { label: 'Stout', data: [15, 25, 30, 50] },
    { label: 'Pale Ale', data: [60, 50, 15, 25] },
    { label: 'Porter', data: [20, 30, 40, 35] },
    { label: 'Pilsner', data: [40, 45, 30, 20] },
    { label: 'Wheat Beer', data: [22, 35, 28, 42] }
  ]
}

export default function Page() {
  const { managerDetails } = useContext(AuthContext)

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <Box sx={titleBoxStyle}>
          <Typography variant='h5'>{managerDetails?.cafe?.name && managerDetails?.cafe?.name + ' Report'}</Typography>
        </Box>
      </Card>

      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Item>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 2 }}>
                <Box sx={infoBox1}>
                  <Typography
                    variant='h6'
                    color={'white'}
                    sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                  >
                    <i className='tabler-beer text' style={{ width: 18, height: 18, color: 'white' }} />{' '}
                    {managerDetails?.cafe?.name}
                  </Typography>
                  <Typography
                    variant='h6'
                    color={'white'}
                    sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                  >
                    <i className='tabler-location text' style={{ width: 18, height: 18, color: 'white' }} />{' '}
                    {managerDetails?.cafe?.location}
                  </Typography>
                </Box>

                <Box sx={infoBox2}>
                  <i className='tabler-user-heart text' style={{ width: 24, height: 24, color: 'white' }} />
                  <Typography variant='p1' color={'white'}>
                    Customers this month
                  </Typography>
                  <Typography variant='h6' color={'white'}>
                    423
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant='h6' sx={{ textDecoration: 'underline' }}>
                  Sales report this month
                </Typography>

                <PieChart
                  series={[
                    {
                      data,
                      highlightScope: { faded: 'global', highlighted: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
                    }
                  ]}
                  height={220}
                />
              </Box>
            </Item>
          </Grid>

          <Grid item xs={12} md={8}>
            <Item sx={centerItem}>
              <Typography variant='h6' sx={{ textDecoration: 'underline' }}>
                Sales report this year
              </Typography>
              <BarChart
                series={barData.datasets.map(dataset => ({
                  data: dataset.data,
                  label: dataset.label
                }))}
                height={290}
              />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

const titleBoxStyle = {
  py: 2,
  rowGap: 2,
  px: 3,
  columnGap: 4,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between'
}

const infoBox1 = {
  height: 100,
  width: 200,
  backgroundColor: '#8F85F3',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  display: 'flex',
  borderRadius: 1,
  flexDirection: 'column'
}

const infoBox2 = {
  height: 100,
  width: 200,
  backgroundColor: '#53D28C',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  display: 'flex',
  borderRadius: 1,
  flexDirection: 'column'
}

const centerItem = { display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }
