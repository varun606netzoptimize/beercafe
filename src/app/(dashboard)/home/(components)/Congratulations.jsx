// MUI Imports
import { useContext } from 'react'

import Link from 'next/link'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

import { CircularProgress } from '@mui/material'

import { AuthContext } from '@/context/AuthContext'

const CongratulationsJohn = () => {
  const { stats, statsIsLoading } = useContext(AuthContext)

  console.log(stats?.bestCafeOfTheMonth)

  return (
    <Card>
      <Grid container>
        {statsIsLoading ? (
          <>
            <Grid className='flex !min-h-[190px] items-center justify-center w-full'>
              <CircularProgress size={28} />
            </Grid>
          </>
        ) : (
          <Grid item xs={10}>
            <CardContent>
              <Typography variant='h5' className='mbe-0.5'>
                Congratulations, {stats.bestCafeOfTheMonth.name} 🎉
              </Typography>
              <Typography variant='subtitle1' className='mbe-2'>
                Best Café of the Month
              </Typography>
              <Typography variant='h4' color='primary.main' className='mbe-1'>
                ${stats.bestCafeOfTheMonth.totalRevenue} in Revenue
              </Typography>
              <Link href={`/orders?cafeId=${stats.bestCafeOfTheMonth.cafeId}`}>
                <Button variant='contained' color='primary'>
                  View Performance
                </Button>
              </Link>
            </CardContent>
          </Grid>
        )}
      </Grid>
    </Card>
  )
}

export default CongratulationsJohn
