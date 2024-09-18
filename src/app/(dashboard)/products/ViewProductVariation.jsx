import * as React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'

import { Box, Button } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import AddVariationDrawer from './AddVariationDrawer'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function ViewProductVariation({
  open,
  setOpen,
  ProductVariationData,
  productData,
  GetCafeProducts,
  drawerType,
  setDrawerType
}) {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10
  })

  let myProductVariationData = ProductVariationData

  const [addVariationVisible, setAddVariationVisible] = React.useState(false)

  const [updateData, setUpdateData] = React.useState(null)

  const handleClose = () => {
    setOpen(false)
  }

  const columns = [
    { field: 'value', headerName: 'Value', flex: 1 },
    {
      field: 'salePrice',
      headerName: 'Sale Price',
      flex: 1,
      renderCell: params => <Box>${params?.row?.salePrice}</Box>
    },
    {
      field: 'regularPrice',
      headerName: 'Regular Price',
      flex: 1,
      renderCell: params => <Box>${params?.row?.regularPrice}</Box>
    },
    { field: 'points', headerName: 'Points', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: params => (
        <Box>
          <Button
            variant='outlined'
            color='info'
            size='small'
            sx={{ marginRight: 2 }}
            onClick={() => {
              setUpdateData(params?.row)
              setDrawerType('update')
              setAddVariationVisible(true)
              setOpen(false)
            }}
          >
            Edit
          </Button>
          <Button variant='outlined' color='error' size='small' sx={{ marginLeft: 2 }}>
            Delete
          </Button>
        </Box>
      ),
      sortable: false
    }
  ]

  const { page, pageSize } = paginationModel
  const startIndex = page * pageSize
  const paginatedData = myProductVariationData?.slice(startIndex, startIndex + pageSize)

  return (
    <>
      <Dialog
        open={open}
        fullWidth={'true'}
        maxWidth={'lg'}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <Box
          className='flex flex-row items-center justify-between'
          sx={{ padding: 4, paddingLeft: 6, paddingRight: 6, marginBottom: -4 }}
        >
          <h3>{productData?.name} Price Variation</h3>
          <Button
            variant='contained'
            color='primary'
            startIcon={<i className='tabler-cash-register' />}
            size='small'
            onClick={() => {
              setAddVariationVisible(true)
              setOpen(false)
              setDrawerType('add')
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
            rowCount={myProductVariationData.length}
          />
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='info' onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <AddVariationDrawer
        open={addVariationVisible}
        onClose={() => {
          setAddVariationVisible(false)
          setOpen(false)
        }}
        setDialogOpen={setOpen}
        productData={productData}
        GetCafeProducts={GetCafeProducts}
        myProductVariationData={myProductVariationData}
        updateData={updateData}
        type={drawerType}
      />
    </>
  )
}
