// MUI Imports
import { useContext } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

// Component Imports
import { CircularProgress } from '@mui/material'

import CustomAvatar from '@core/components/mui/Avatar'
import { AuthContext } from '@/context/AuthContext'

const StatisticsCard = () => {
  const { stats, statsIsLoading } = useContext(AuthContext)

  const data = [
    {
      stats: stats?.totalOrders,
      title: 'Sales',
      color: 'primary',
      icon: 'tabler-chart-pie-2'
    },
    {
      color: 'info',
      stats: stats?.totalCafes,
      title: 'Cafes',
      icon: 'tabler-coffee'
    },
    {
      color: 'error',
      stats: stats?.totalProducts,
      title: 'Products',
      icon: 'tabler-shopping-cart'
    },
    {
      stats: stats?.totalRevenue,
      color: 'success',
      title: 'Revenue',
      icon: 'tabler-currency-dollar'
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Statistics'

        // action={
        //   <Typography variant='subtitle2' color='text.disabled'>
        //     Updated 1 month ago
        //   </Typography>
        // }
      />
      <CardContent className='flex justify-between flex-wrap gap-4 md:pbs-10 max-md:pbe-6 max-[1060px]:pbe-[74px] max-[1200px]:pbe-[52px] max-[1320px]:pbe-[74px] max-[1501px]:pbe-[52px]'>
        {!statsIsLoading ? (
          <Grid container spacing={4}>
            {data.map((item, index) => (
              <Grid key={index} item xs className='flex items-center gap-4'>
                <CustomAvatar color={item.color} variant='rounded' size={40} skin='light'>
                  <i className={item.icon}></i>
                </CustomAvatar>
                <div className='flex flex-col'>
                  <Typography variant='h5'>{item.stats}</Typography>
                  <Typography variant='body2'>{item.title}</Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid className='flex !min-h-[50px] items-center justify-center w-full'>
            <CircularProgress size={28} />
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
