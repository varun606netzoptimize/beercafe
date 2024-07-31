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
import AddManagerDrawer from './AddManagerDrawer'
import ConfirmDelete from '@/components/Modal/ConfirmDelete'

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
  const { authToken, tokenCheck, cafes } = useContext(AuthContext)

  const [managers, setManagers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [deleting, setDeleting] = useState({})
  const [open, setOpen] = React.useState(false)
  const [drawerType, setDrawerType] = useState('create')
  const [updateManagerData, setUpdateManagerData] = useState(null)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteManagerData, setDeleteManagerData] = useState(null)

  const toggleDrawer = newOpen => () => {
    setOpen(newOpen)
  }

  useEffect(() => {
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
    const url = ENDPOINT.GET_MANAGERS

    setIsLoading(true)

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer ' + authToken.token
        }
      })
      .then(res => {
        setManagers(res.data.managers)
      })
      .catch(err => {
        console.log('failed:', err.response)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const DeleteManager = () => {
    const url = ENDPOINT.DELETE_MANAGER

    const userId = deleteManagerData.id

    const userData = {
      id: userId
    }

    setDeleting(prev => ({ ...prev, [userId]: true }))

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${authToken.token}`,
          'Content-Type': 'application/json'
        },
        data: userData
      })
      .then(res => {
        console.log('Manager deleted:', res.data)
        setManagers(prevManagers => prevManagers.filter(manager => manager.id !== userId))
      })
      .catch(err => {
        console.log('Failed to delete manager:', err.response ? err.response.data : err.message)
      })
      .finally(() => {
        setDeleting(prev => ({ ...prev, [userId]: false }))
        setOpenDeleteDialog(false)
        setDeleteManagerData(null)
      })
  }

  if (!authToken.token || authToken.role !== 'Admin') {
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
          <Button
            variant='contained'
            size='medium'
            startIcon={<i className='tabler-briefcase' />}
            onClick={() => {
              setOpen(true)
              setDrawerType('create')
            }}
          >
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
                <StyledTableCell sx={{ width: '14%' }}>Actions</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {managers?.map(data => (
                <StyledTableRow key={data.id}>
                  <StyledTableCell component='th' scope='row' sx={{ cursor: 'default' }}>
                    <NameContainer>
                      {deleting[data.id] ? <CircularProgress size={24} sx={{ color: 'primary.main' }} /> : data.name}
                    </NameContainer>
                  </StyledTableCell>
                  <StyledTableCell component='th' scope='row'>
                    {data.email}
                  </StyledTableCell>
                  <StyledTableCell component='th' scope='row'>
                    {data.phone}
                  </StyledTableCell>
                  <StyledTableCell component='th' scope='row'>
                    {data.cafe.name}
                  </StyledTableCell>
                  <StyledTableCell component='th' scope='row'>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: '16px'
                      }}
                    >
                      <Button
                        variant='outlined'
                        color='error'
                        size='small'
                        onClick={() => {
                          setDeleteManagerData(data)
                          setOpenDeleteDialog(true)
                        }}
                      >
                        Delete
                      </Button>

                      <Button
                        variant='outlined'
                        color='info'
                        size='small'
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          setOpen(true)
                          setUpdateManagerData(data)
                          setDrawerType('update')
                        }}
                      >
                        Edit
                      </Button>
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AddManagerDrawer
        open={open}
        onClose={toggleDrawer(false)}
        toggleDrawer={toggleDrawer}
        GetManagers={GetManagers}
        drawerType={drawerType}
        setDrawerType={setDrawerType}
        updateManagerData={updateManagerData}
        setUpdateManagerData={setUpdateManagerData}
      />

      <ConfirmDelete
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        deleteUserData={deleteManagerData}
        setDeleteUserData={setDeleteManagerData}
        DeleteFunction={DeleteManager}
      />
    </div>
  )
}
