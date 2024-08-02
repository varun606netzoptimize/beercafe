'use client'
import * as React from 'react'

import { useContext, useEffect, useState } from 'react'

import { redirect } from 'next/navigation'

import axios from 'axios'
import { styled } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'

import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'
import { Box, Button, Card, CircularProgress, Typography } from '@mui/material'
import { axisClasses } from '@mui/x-charts/ChartsAxis'

const chartSetting = {
  yAxis: [
    {
      // label: 'Number of Cafes',
      tickFormatter: tick => tick // Ensure the tick labels are formatted correctly
    }
  ],
  xAxis: [
    {
      scaleType: 'band',
      dataKey: 'month',
      tickFormatter: tick => tick, // Ensure the tick labels are formatted correctly
      tickSize: 10 // Adjust if needed
    }
  ],
  width: 550, // Increased width to provide more space
  height: 350, // Increased height if needed
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)'
    },
    [`.${axisClasses.bottom} .${axisClasses.label}`]: {
      angle: -45, // Rotate x-axis labels if needed
      textAnchor: 'end'
    }
  }
}

const valueFormatter = value => `${value}`

import { ChartsNoDataOverlay } from '@mui/x-charts/ChartsOverlay'

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'
import AddCafeDrawer from './AddCafeDrawer'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

export default function Page() {
  const { authToken, tokenCheck, cafes, setCafes } = useContext(AuthContext)

  const [cafeStats, setCafeStats] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [isTableRendering, setIsTableRendering] = useState(true)
  const [chartData, setChartData] = useState([])

  const [pieChartData, setPieChartData] = useState([
    { id: 0, value: 150, label: 'Hop & Malt' },
    { id: 1, value: 200, label: 'Brew Haven' },
    { id: 2, value: 180, label: 'Ale Oasis' },
    { id: 3, value: 220, label: 'Brewed Bliss' },
    { id: 4, value: 160, label: 'Brew Estate' },
    { id: 5, value: 140, label: 'Draft Dreams' },
    { id: 6, value: 190, label: 'Miriam Hurley' }
  ])

  const [open, setOpen] = useState(false)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const [totalRows, setTotalRows] = useState(0)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  const [owners, setOwners] = useState({ users: [], pagination: null })

  const HandleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (tokenCheck) {
      if (authToken.role == 'Manager') {
        redirect('/users')
      }

      if (authToken.role == 'User') {
        redirect('/comingSoon')
      }

      if (!authToken.token) {
        redirect('/loginAs')
      }
    }
  }, [authToken])

  useEffect(() => {
    if (authToken.token) {
      GetCafe(1)
      GetOwners()
      GetCafeStats()
    }
  }, [authToken, paginationModel.page, sortBy, sortOrder])

  const GetCafe = () => {
    const url = `${ENDPOINT.GET_CAFES}?page=${paginationModel.page + 1}&size=10&size=10&sortBy=${sortBy}&sortOrder=${sortOrder}`

    setIsLoading(true)

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken.token
        }
      })
      .then(res => {
        setCafes({ cafes: res.data.cafes, pagination: res.data.pagination })
        setTotalRows(res.data.pagination.totalCafes)

        processChartData(res.data.cafes)
        processPieChartData(res.data.cafes)
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
      .finally(() => {
        setIsLoading(false)
        setIsTableRendering(false)
      })
  }

  const GetOwners = () => {
    const url = `${ENDPOINT.GET_USERS}?page=${paginationModel.page + 1}&size=10&sortBy=${sortBy}&sortOrder=${sortOrder}&userType=owner`

    console.log(url)

    setIsLoading(true)

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken.token
        }
      })
      .then(res => {
        setOwners({ users: res.data.users, pagination: res.data.pagination })
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
      .finally(() => {
        setIsLoading(false)
        setIsTableRendering(false)
      })
  }

  const GetCafeStats = () => {
    const url = ENDPOINT.CAFE_STATS

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken.token
        }
      })
      .then(res => {
        setCafeStats(res.data.stats)
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const processChartData = cafes => {
    const groupedData = cafes.reduce((acc, cafe) => {
      const date = new Date(cafe.createdAt)
      const month = date.toLocaleString('default', { month: 'long' }) // Get month name
      const year = date.getFullYear() // Get year

      const monthYear = `${month} ${year}` // Format as "Month Year"

      if (!acc[monthYear]) acc[monthYear] = { count: 0, names: [] }
      acc[monthYear].count++
      acc[monthYear].names.push(cafe.name)

      return acc
    }, {})

    const data = Object.keys(groupedData).map(monthYear => ({
      month: monthYear,
      count: groupedData[monthYear].count,
      names: groupedData[monthYear].names.join(', ') // Join names with a comma
    }))

    setChartData(data)
  }

  const processPieChartData = cafes => {
    const data = cafes.cafes.map(cafe => ({
      id: cafe.id,
      value: cafe.managers.length,
      label: cafe.name
    }))

    // setPieChartData(data)
  }

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    {
      field: 'owner',
      headerName: 'Owner',
      flex: 1,
      renderCell: params => <Box>{params?.row?.owner?.name}</Box>
    },
    {
      field: 'manager',
      headerName: 'Manager',
      flex: 1,
      renderCell: params => <Box>{params?.row?.manager?.name}</Box>
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: params => (
        <Box>
          <Button variant='outlined' color='info' size='small' sx={{ marginRight: 2 }} onClick={() => {}}>
            Edit
          </Button>
          <Button variant='outlined' color='error' size='small' sx={{ marginLeft: 2 }} onClick={() => {}}>
            Delete
          </Button>
        </Box>
      ),
      sortable: false
    }
  ]

  if (!authToken.token) {
    return null
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <Box sx={titleBoxStyle}>
          <Typography variant='h5'>Manage Cafes</Typography>
          <Button
            onClick={() => setOpen(true)}
            variant='contained'
            size='medium'
            startIcon={<i className='tabler-briefcase' />}
          >
            Add Cafe
          </Button>
        </Box>
      </Card>

      {isTableRendering ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <DataGrid
                loading={isLoading}
                rows={cafes.cafes}
                columns={columns}
                pagination
                paginationModel={paginationModel}
                pageSizeOptions={[10]}
                rowCount={totalRows}
                paginationMode='server'
                onPaginationModelChange={setPaginationModel}
                sortingMode='server'
                onSortModelChange={newSortModel => {
                  console.log('newSortModel:', newSortModel[0]?.field, newSortModel[0]?.sort)
                  setSortBy(newSortModel[0]?.field ? newSortModel[0]?.field : 'name')
                  setSortOrder(newSortModel[0]?.sort ? newSortModel[0]?.sort : 'asc')
                }}
                rowSelectionModel={[]}
                checkboxSelection={false}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Item sx={centerItem}>
                <BarChart
                  dataset={chartData}
                  xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                  series={[{ dataKey: 'count', label: 'Number of Cafes', valueFormatter }]}
                  {...chartSetting}
                />
              </Item>
            </Grid>
            <Grid item xs={12} md={6}>
              <Item sx={centerItem}>
                <Typography variant='h6' sx={{ textDecoration: 'underline' }}>
                  Customers per cafe
                </Typography>

                <PieChart
                  series={[
                    {
                      data: pieChartData,
                      highlightScope: { faded: 'global', highlighted: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
                    }
                  ]}
                  height={220}
                />
              </Item>
            </Grid>
            <Grid item xs={12} md={6}>
              <Item sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 2 }}>
                <Box sx={infoBox1}>
                  <i className='tabler-beer text' style={{ width: 24, height: 24, color: 'white' }} />
                  <Typography variant='h6' color={'white'}>
                    Total Number of Cafes
                  </Typography>
                  <Typography variant='h5' color={'white'}>
                    {cafes?.length}
                  </Typography>
                </Box>

                <Box sx={infoBox2}>
                  <i className='tabler-user-heart text' style={{ width: 24, height: 24, color: 'white' }} />
                  <Typography variant='h6' color={'white'}>
                    Total Number of Customers
                  </Typography>
                  <Typography variant='h5' color={'white'}>
                    1,240
                  </Typography>
                </Box>

                <Box sx={infoBox3}>
                  <i className='tabler-briefcase text' style={{ width: 24, height: 24, color: 'white' }} />
                  <Typography variant='h6' color={'white'}>
                    Total Number of Managers
                  </Typography>
                  <Typography variant='h5' color={'white'}>
                    6
                  </Typography>
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Box>
      )}

      <AddCafeDrawer open={open} onClose={HandleClose} owners={owners} GetCafe={GetCafe} />
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

const centerItem = { display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }

const infoBox1 = {
  height: 100,
  width: 200,
  backgroundColor: '#0FADAA',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  display: 'flex',
  borderRadius: 1,
  flexDirection: 'column'
}

const infoBox2 = {
  height: 100,
  width: 200,
  backgroundColor: '#FF9F43',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  display: 'flex',
  borderRadius: 1,
  flexDirection: 'column'
}

const infoBox3 = {
  height: 100,
  width: 200,
  backgroundColor: '#53D28C',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  display: 'flex',
  borderRadius: 1,
  flexDirection: 'column'
}
