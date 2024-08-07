'use client'
import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import { redirect } from 'next/navigation'

import axios from 'axios'
import { styled } from '@mui/material/styles'
import { Box, Button, Card, CircularProgress, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'

export default function Page() {
  const { authToken, tokenCheck, cafes, setCafes } = useContext(AuthContext)

  useEffect(() => {
    if (tokenCheck && !authToken.token) {
      redirect('/loginAs')
    }
  }, [authToken])

  if (!authToken.token || authToken.role !== 'admin') {
    return null
  }

  return <div className='flex flex-col gap-6'></div>
}
