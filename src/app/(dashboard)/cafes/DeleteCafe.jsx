import * as React from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CircularProgress from '@mui/material/CircularProgress'

export default function DeleteCafe({
  openDeleteDialog,
  setOpenDeleteDialog,
  deleteCafeData,
  setDeleteCafeData,
  isLoading,
  DeleteFunction
}) {
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)

  function handleClose() {
    setDeleteCafeData(null)
    setOpenDeleteDialog(false)
    setShowConfirmDialog(false)
  }

  function handleDelete() {
    if (deleteCafeData?.children?.length) {
      setShowConfirmDialog(true)
    } else {
      DeleteFunction()
    }
  }

  function handleConfirmDelete() {
    setShowConfirmDialog(false)
    DeleteFunction()
  }

  return (
    <>
      {/* Main Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{`Delete ${deleteCafeData?.name}?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {`Are you sure you want to delete ${deleteCafeData?.name}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus variant='outlined' color='info'>
            Cancel
          </Button>

          <Button onClick={handleDelete} color='error' sx={{ width: '90px' }}>
            {isLoading ? <CircularProgress size={22} color='error' /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Secondary Confirmation Dialog for Cafes with Child Cafes */}
      <Dialog
        open={showConfirmDialog}
        onClose={handleClose}
        aria-labelledby='confirm-dialog-title'
        aria-describedby='confirm-dialog-description'
      >
        <DialogTitle id='confirm-dialog-title'>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id='confirm-dialog-description'>
            This cafe has branch cafes. Deleting it will also delete all associated branch cafes. Are you sure you want
            to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='outlined' color='info'>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color='error' sx={{ width: '90px' }}>
            {isLoading ? <CircularProgress size={22} color='error' /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
