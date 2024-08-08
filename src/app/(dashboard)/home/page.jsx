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

import { AuthContext } from '@/context/AuthContext'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

export default function Page() {
  const { authToken, tokenCheck, cafes, setCafes } = useContext(AuthContext)

  useEffect(() => {
    if (tokenCheck) {
      if (authToken.role == 'Manager') {
        redirect('/users')
      }

      if (authToken.role == 'User') {
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
          <Grid item xs={12} md={6}>
            <Item></Item>
          </Grid>
          <Grid item xs={12} md={6}>
            <Item></Item>
          </Grid>
          <Grid item xs={12} md={6}>
            <Item></Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}
