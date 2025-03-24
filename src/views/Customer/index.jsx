import React, { useState, useEffect } from 'react';
import { Card, Box, Grid, Typography, IconButton, Button, Divider, Modal } from '@mui/material';
import { DataGrid} from '@mui/x-data-grid';
import { gridSpacing } from 'config.js';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCustomerForm from './addCustomer.jsx';
import { getApi, deleteApi } from 'common/apiClient';
import { urls } from 'common/urls';
import toast from 'react-hot-toast';
import CustomToolbar from 'common/customToolbar';
import CustomBreadcrumbs from 'common/customBreadcrumbs';

const CustomerManagementPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.customer.get);
      const modifiedRows = response.data.map((item, index) => ({
        ...item,
        sno: index + 1
      }));
      setRows(modifiedRows);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'sno', headerName: 'S.No', width: 80 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'mobileNo', headerName: 'Mobile', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'address', headerName: 'Address', width: 200 },
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
            width: 'auto',
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
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ color: '#17a2b8', py: 2 }} onClick={() => handleOpen(params.row)}>
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

  const handleOpen = (customer = null) => {
    setEditCustomer(customer);
    setModalOpen(true);
  };

  const handleClose = () => {
    setEditCustomer(null);
    setModalOpen(false);
  };

  const refreshData = () => {
    fetchData();
  };

  const handleDelete = async (id) => {
    try {
      await deleteApi(urls.customer.delete.replace(':id', id));
      toast.success('Customer deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to customer');
    }
  };

  return (
    <>
       <CustomBreadcrumbs title="Customer Info" links={[{ name: 'Customer Management', path: '/customer' }]} />

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
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
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10
                    }
                  }
                }}
                pageSizeOptions={[10]}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                slots={{ toolbar: CustomToolbar }}
                slotProps={{
                  toolbar: {
                    onAddClick: () => handleOpen(),
                    showExport: true
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
            {editCustomer?.id ? 'Edit Customer' : 'Add Customer'}
          </Typography>
          <AddCustomerForm initialData={editCustomer} onSave={handleClose} onCancel={handleClose} refreshData={refreshData} />
        </Box>
      </Modal>
    </>
  );
};

export default CustomerManagementPage;
