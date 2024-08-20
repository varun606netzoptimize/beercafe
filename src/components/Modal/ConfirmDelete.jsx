import * as React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { CircularProgress } from '@mui/material'

export default function ConfirmDelete({
  openDeleteDialog,
  setOpenDeleteDialog,
  deleteUserData,
  setDeleteUserData,
  DeleteFunction,
  isLoading
}) {
  function handleClose() {
    setDeleteUserData(null)
    setOpenDeleteDialog(false)
  }

  return (
    <>
      <Dialog
        open={openDeleteDialog}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{`Delete ${deleteUserData?.name}?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {`Are you sure you want to delete ${deleteUserData?.name}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus variant='contained' color='info'>
            Cancel
          </Button>
          <Button onClick={DeleteFunction} sx={{ width: 80 }} color='error'>
            {isLoading ? <CircularProgress size={22} color='error' /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
