import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Box, Grid, Typography, IconButton, Button, Breadcrumbs, Divider, Link as MuiLink, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { gridSpacing } from 'config.js';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCustomerForm from './addCustomer.jsx';

const columns = (handleEdit, handleDelete) => [
  { field: 'id', headerName: 'S.No', width: 80 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'mobile', headerName: 'Mobile', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'address', headerName: 'Address', width: 220 },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    renderCell: (params) => (
      <Button
        variant="contained"
        style={{
          backgroundColor: params.row.status === 'Active' ? '#30aa4c' : '#dc3545',
          color: 'white',
          fontWeight: 700,
          fontSize: '10px',
          padding: '0'
        }}
      >
        {params.row.status}
      </Button>
    )
  },
  {
    field: 'actions',
    headerName: 'Action',
    width: 150,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton sx={{ color: '#17a2b8', py: 2 }} onClick={() => handleEdit(params.row)}>
          <BorderColorIcon />
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
        <IconButton color="error" sx={{ py: 2 }} onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    )
  }
];

const rows = [
  { id: 1, name: 'Alice Johnson', mobile: '1234567890', email: 'alice@example.com', address: '123 Main St', status: 'Active' },
  { id: 2, name: 'Bob Smith', mobile: '0987654321', email: 'bob@example.com', address: '456 Oak Rd', status: 'Inactive' }
];

const CustomerManagementPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  const handleOpen = (customer = null) => {
    setEditCustomer(customer);
    setModalOpen(true);
  };
  const handleClose = () => setModalOpen(false);

  return (
    <>
     <Box
             sx={{
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
               p: 0,
               m: 0
             }}
           >
             <Typography variant="h3" sx={{ m: 0 }}>
             Customer Info
             </Typography>
             <Breadcrumbs
               separator="/"
               aria-label="breadcrumb"
               sx={{
                 display: 'flex',
                 alignItems: 'center',
                 p: 0,
                 m: 0
               }}
             >
               <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
                 <Typography color="#17a2b8">Dashboard</Typography>
               </MuiLink>
               <Typography color="text.primary">Customer Management</Typography>
             </Breadcrumbs>
           </Box>

      <Button variant="contained" color="primary" sx={{ my: 2 }} onClick={() => handleOpen()}>
        Add
      </Button>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns(handleOpen)}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
                sx={{
                  '.MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 'bold',
                    fontSize: '16px'
                  },
                  '.MuiDataGrid-cell': {
                    fontSize: '16px'
                  }
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Modal open={modalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            {editCustomer ? 'Edit Customer' : 'Add Customer'}
          </Typography>
          <AddCustomerForm initialData={editCustomer} onSave={handleClose} onCancel={handleClose} />
        </Box>
      </Modal>
    </>
  );
};

export default CustomerManagementPage;
