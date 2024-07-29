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
import { Box, Button, Card, CircularProgress, Typography } from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'

import { AuthContext } from '@/context/AuthContext'
import { ENDPOINT } from '@/endpoints'
import AddUserDrawer from './AddUserDrawer'

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
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

const NameContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&:hover .actionIcons': {
    opacity: 1
  }
}))

const ActionIcons = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  gap: 24,
  opacity: 0,
  transition: 'opacity 0.3s ease'
}))

export default function Page() {
  const { authToken, tokenCheck } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [deleting, setDeleting] = useState({})
  const [open, setOpen] = React.useState(false)
  const [drawerType, setDrawerType] = useState('create')
  const [updateUserData, setUpdateUserData] = useState(null)

  const toggleDrawer = newOpen => () => {
    setOpen(newOpen)
  }

  useEffect(() => {
    if (tokenCheck) {
      if (!authToken.token) {
        redirect('/loginAs')
      }
    }
  }, [authToken])

  useEffect(() => {
    if (authToken.token) {
      GetUsers()
    }
  }, [authToken])

  const GetUsers = () => {
    const url = ENDPOINT.GET_CUSTOMERS

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

  const DeleteUser = userId => {
    const url = ENDPOINT.DELETE_USER

    const userData = {
      id: userId
    }

    setDeleting(prev => ({ ...prev, [userId]: true })) // Set deletion status to true for the user

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${authToken.token}`,
          'Content-Type': 'application/json'
        },
        data: userData
      })
      .then(res => {
        console.log('User deleted:', res.data)
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
      })
      .catch(err => {
        console.log('Failed to delete user:', err.response ? err.response.data : err.message)
      })
      .finally(() => {
        setDeleting(prev => ({ ...prev, [userId]: false }))
      })
  }

  if (!authToken.token) {
    return null
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <Box sx={titleBoxStyle}>
          <Typography variant='h5'>Manage Users</Typography>
          <Button
            variant='contained'
            size='medium'
            startIcon={<i className='tabler-user-plus' />}
            onClick={() => {
              setOpen(true)
              setDrawerType('create')
            }}
          >
            Add New User
          </Button>
        </Box>
      </Card>

      {isLoading ? (
        <Box sx={{ minWidth: 700, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          <TableContainer component={Paper}>
            <Table aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{ width: '28%' }}>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Phone</StyledTableCell>
                  <StyledTableCell>Points</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users?.map((data, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell
                      component='th'
                      scope='row'
                      sx={{ justifyContent: 'space-evenly', cursor: 'default' }}
                    >
                      <NameContainer>
                        {deleting[data.id] ? <CircularProgress size={24} sx={{ color: 'primary.main' }} /> : data.name}

                        <ActionIcons className='actionIcons'>
                          <>
                            <Delete color='error' sx={{ cursor: 'pointer' }} onClick={() => DeleteUser(data.id)} />
                            <Edit
                              color='info'
                              sx={{ cursor: 'pointer' }}
                              onClick={() => {
                                setOpen(true)
                                setUpdateUserData(data)
                                setDrawerType('update')
                              }}
                            />
                          </>
                        </ActionIcons>
                      </NameContainer>
                    </StyledTableCell>
                    <StyledTableCell component='th' scope='row'>
                      {data.email}
                    </StyledTableCell>
                    <StyledTableCell component='th' scope='row'>
                      {data.phone}
                    </StyledTableCell>
                    <StyledTableCell component='th' scope='row'>
                      {data.points}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <AddUserDrawer
        open={open}
        drawerType={drawerType}
        onClose={toggleDrawer(false)}
        toggleDrawer={toggleDrawer}
        GetUsers={GetUsers}
        setDrawerType={setDrawerType}
        updateUserData={updateUserData}
        setUpdateUserData={setUpdateUserData}
      />
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
