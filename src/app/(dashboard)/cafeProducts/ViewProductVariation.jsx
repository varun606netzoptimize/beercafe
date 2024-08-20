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

export default function ViewProductVariation({ open, setOpen, ProductData }) {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10
  })

  const [addVariationVisible, setAddVariationVisible] = React.useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const columns = [
    { field: 'value', headerName: 'Value', flex: 1 },
    { field: 'salePrice', headerName: 'Sale Price', flex: 1 },
    { field: 'regularPrice', headerName: 'Regular Price', flex: 1 },
    { field: 'points', headerName: 'Points', flex: 1 }
  ]

  // Slice the data for pagination
  const { page, pageSize } = paginationModel
  const startIndex = page * pageSize
  const paginatedData = ProductData?.slice(startIndex, startIndex + pageSize)

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
        <Box
          className='flex flex-row items-center justify-between'
          sx={{ padding: 4, paddingLeft: 6, paddingRight: 6, marginBottom: -4 }}
        >
          <h3>{'Product Variation'}</h3>
          <Button
            variant='contained'
            color='primary'
            startIcon={<i className='tabler-cash-register' />}
            size='small'
            onClick={() => {
              setAddVariationVisible(true)
            }}
          >
            Add
          </Button>
        </Box>
        <DialogContent>
          <DataGrid
            rows={paginatedData}
            columns={columns}
            pagination
            paginationModel={paginationModel}
            pageSizeOptions={[10, 20, 30]}
            onPaginationModelChange={newPaginationModel => {
              setPaginationModel(newPaginationModel)
            }}
            rowCount={ProductData.length}
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
