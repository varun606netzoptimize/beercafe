'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import { useColorScheme, useTheme } from '@mui/material/styles'

// Third Party Imports
import classnames from 'classnames'

// Components Imports
import { Box, Button, Menu, MenuItem } from '@mui/material'

import padding from 'tailwindcss-logical/plugins/padding'

import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { rgbaToHex } from '@/utils/rgbaToHex'
import CustomLoadingOverlay from '@/components/CustomLoadingOverlay/CustomLoadingOverlay'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const EarningReportsWithTabs = ({
  serverMode,
  orderData,
  getOrderMonthly,
  getOrderWeekly,
  getOrderYearly,
  loading = false
}) => {
  // States
  const [value, setValue] = useState('orders')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectYear, setSelectYear] = useState(new Date().getFullYear())
  const [selectedFilter, setSelectedFilter] = useState('Current Week')

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = year => {
    setSelectYear(year)
    getOrderMonthly({ year: year })
    setAnchorEl(null)
  }

  // Hooks
  const theme = useTheme()
  const { mode } = useColorScheme()

  // Vars
  const _mode = (mode === 'system' ? serverMode : mode) || serverMode
  const disabledText = rgbaToHex(`rgb(${theme.mainColorChannels[_mode]} / 0.4)`)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  // Prepare data for the chart
  const ordersData = Object.values(orderData).map(month => month.totalOrders)
  const revenueData = Object.values(orderData).map(month => month.totalRevenue)

  const colors = Array(12).fill(rgbaToHex(`rgb(${theme.palette.primary.mainChannel} / 0.16)`))

  console.log(Object.keys(orderData), 'ordersData')

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '33%',
        borderRadiusApplication: 'end',
        dataLabels: { position: 'top' }
      }
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: {
      offsetY: -11,
      formatter: val => (value === 'orders' ? val : `$${val}`),
      style: {
        fontWeight: 500,
        colors: [rgbaToHex(`rgb(${theme.mainColorChannels[_mode]} / 0.9)`)],
        fontSize: theme.typography.body1.fontSize
      },
      className: 'custom-datalabel'
    },
    colors,
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      show: false,
      padding: {
        top: -19,
        left: -4,
        right: 0,
        bottom: -11
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { color: rgbaToHex(`rgb(${theme.mainColorChannels[_mode]} / 0.12)`) },
      categories:
        selectedFilter === 'Current Week'
          ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          : selectedFilter === 'Monthly'
            ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            : Object.keys(orderData),
      labels: {
        style: {
          colors: disabledText,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -18,
        formatter: val => (value === 'orders' ? val : `$${val}`),
        style: {
          colors: disabledText,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    responsive: [
      {
        breakpoint: 1450,
        options: {
          plotOptions: {
            bar: { columnWidth: '45%' }
          }
        }
      },
      {
        breakpoint: 600,
        options: {
          dataLabels: {
            style: {
              fontSize: theme.typography.body2.fontSize
            }
          },
          plotOptions: {
            bar: { columnWidth: '58%' }
          }
        }
      },
      {
        breakpoint: 500,
        options: {
          plotOptions: {
            bar: { columnWidth: '70%' }
          }
        }
      }
    ]
  }

  const yearOptions = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2]

  return (
    <Card>
      <CardHeader
        title='Earning Reports'
        subheader='Yearly Earnings Overview'
        action={
          <>
            {selectedFilter === 'Monthly' && (
              <>
                <Button
                  size='small'
                  variant='tonal'
                  onClick={handleClick}
                  endIcon={<i className='tabler-chevron-down text-xl' />}
                >
                  {selectYear}
                </Button>
                <Menu
                  keepMounted
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  open={Boolean(anchorEl)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  {yearOptions.map(year => (
                    <MenuItem key={year} onClick={() => handleMenuItemClick(year)}>
                      {year}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
            <OptionMenu
              options={['Current Week', 'Monthly', 'Yearly']}
              selectedFilter={selectedFilter}
              onClick={option => {
                setSelectedFilter(option)
                if (option === 'Current Week') {
                  getOrderWeekly()
                } else if (option === 'Monthly') {
                  getOrderMonthly({ year: selectYear })
                } else {
                  getOrderYearly()
                }
              }}
            />
          </>
        }
      />
      <CardContent>
        <TabContext value={value}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='earning report tabs'
            className='!border-0 mbe-10'
            sx={{
              '& .MuiTabs-indicator': { display: 'none !important' },
              '& .MuiTab-root': {
                padding: '0 !important',
                margin: '0 15px 0 0 !important',
                border: '0 !important',
                blockSize: '100px',
                borderRadius: '10px',
                inlineSize: '110px',
                borderStyle: 'dashed !important',
                borderWidth: '1px !important',
                borderColor: 'rgb(47 43 61 / 0.12) !important',
                '&.Mui-selected': {
                  border: '1px solid #7367F0 !important',
                  borderColor: theme.palette.primary.main, // Change the background color for the active tab
                  color: theme.palette.common.white // Change text color for the active tab
                }
              }
            }}
          >
            <Tab
              value='orders'
              label={
                <div className='flex flex-col items-center justify-center gap-2'>
                  <CustomAvatar variant='rounded' size={38}>
                    <i className='tabler-shopping-cart text-textSecondary' />
                  </CustomAvatar>
                  <Typography className='font-medium capitalize' color='text.primary'>
                    Orders
                  </Typography>
                </div>
              }
            />
            <Tab
              value='revenue'
              label={
                <div className='flex flex-col items-center justify-center gap-2'>
                  <CustomAvatar variant='rounded' size={38}>
                    <i className='tabler-chart-bar text-textSecondary' />
                  </CustomAvatar>
                  <Typography className='font-medium capitalize' color='text.primary'>
                    Revenue
                  </Typography>
                </div>
              }
            />
          </TabList>

          <Box sx={{ position: 'relative' }}>
            {loading && <CustomLoadingOverlay />}

            <TabPanel value='orders' className='!p-0'>
              <AppReactApexCharts type='bar' height={233} options={options} series={[{ data: ordersData }]} />
            </TabPanel>
            <TabPanel value='revenue' className='!p-0'>
              <AppReactApexCharts type='bar' height={233} options={options} series={[{ data: revenueData }]} />
            </TabPanel>
          </Box>
        </TabContext>
      </CardContent>
    </Card>
  )
}

export default EarningReportsWithTabs
