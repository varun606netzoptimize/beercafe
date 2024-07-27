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

import { Box, Button, Card, CardHeader, CircularProgress, Typography } from '@mui/material'

import { AuthContext } from '@/context/AuthContext'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },

  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

export default function Page() {
  const { authToken, tokenCheck } = useContext(AuthContext)

  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.log('1')

    if (tokenCheck) {
      console.log('2')

      if (!authToken.token) {
        console.log('3')

        redirect('/loginAs')
      }
    }
  }, [authToken])

  useEffect(() => {
    if (authToken.token) {
      GetManagers()
    }
  }, [authToken])

  const GetManagers = () => {
    const url = 'http://localhost:3000/api/admin/getManagers/'

    setIsLoading(true)

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken.token
        }
      })
      .then(res => {
        setUsers(res.data)
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  if (!authToken.token) {
    return null
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <Box
          sx={{
            py: 2,
            rowGap: 2,
            px: 3,
            columnGap: 4,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant='h5'>Manage Managers</Typography>
          <Button variant='contained' size='medium' startIcon={<i className='tabler-briefcase' />}>
            Add Manager
          </Button>
        </Box>
      </Card>

      {isLoading ? (
        <Box sx={{ minWidth: 700, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Phone</StyledTableCell>
                <StyledTableCell>Cafe</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users?.map((data, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell component='th' scope='row'>
                    {data.name}
                  </StyledTableCell>
                  <StyledTableCell component='th' scope='row'>
                    {data.email}
                  </StyledTableCell>
                  <StyledTableCell component='th' scope='row'>
                    {data.phone}
                  </StyledTableCell>
                  <StyledTableCell component='th' scope='row'>
                    {data.cafe}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  )
}
