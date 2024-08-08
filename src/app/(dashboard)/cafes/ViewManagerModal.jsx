import * as React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'

import { Box, Button } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function ViewManagerModal({ open, setOpen, managers }) {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10
  })

  const handleClose = () => {
    setOpen(false)
  }

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1 },
    { field: 'userType', headerName: 'Role', flex: 1 }
  ]

  // Slice the data for pagination
  const { page, pageSize } = paginationModel
  const startIndex = page * pageSize
  const paginatedData = managers?.slice(startIndex, startIndex + pageSize)

  return (
    <>
      <Dialog
        open={open}
        fullWidth={'lg'}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle>{'Branch Cafes'}</DialogTitle>
        <DialogContent>
          <DataGrid
            rows={paginatedData} // Use sliced data
            columns={columns}
            pagination
            paginationModel={paginationModel}
            pageSizeOptions={[10, 20, 30]} // Example page size options
            onPaginationModelChange={newPaginationModel => {
              setPaginationModel(newPaginationModel)
            }}
            rowCount={managers?.length} // Total row count
          />
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='info' onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
