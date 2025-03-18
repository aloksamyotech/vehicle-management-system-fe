import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Box, Typography, Breadcrumbs, Link as MuiLink, Card, IconButton, Divider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { BorderColor as BorderColorIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AddVehicleGroupModal from './addVehicleGroup';
import { getApi, deleteApi } from 'common/apiClient';
import { urls } from 'common/urls';
import toast from 'react-hot-toast';

const NewComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.vehicleGroup.get);
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
  
  const handleOpenModal = (item = null) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setEditItem(null);
    setOpenModal(false);
  };

  const refreshData = () => {
    fetchData();
  };

  const handleDelete = async (id) => {
    try {
      await deleteApi(urls.vehicleGroup.delete.replace(':id', id));
      toast.success('Vehicle group deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const columns = [
    { field: 'sno', headerName: 'S.No', width: 80 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'description', headerName: 'Description', width: 350 },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      width: 150,
      renderCell: (params) => {
        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
      }
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ color: '#17a2b8' }} onClick={() => handleOpenModal(params.row)}>
            <BorderColorIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5 }} />
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3">Vehicle Group</Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <Typography color="text.primary">Vehicle Group</Typography>
        </Breadcrumbs>
      </Box>

      <Button variant="contained" color="primary" sx={{ my: 2 }} onClick={() => handleOpenModal()}>
        Add
      </Button>

      <Card>
        <Box sx={{ height: 'auto', width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
            loading={loading}
            sx={{
              '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
              '.MuiDataGrid-cell': { fontSize: '16px' }
            }}
          />
        </Box>
      </Card>

      <AddVehicleGroupModal open={openModal} handleClose={handleCloseModal} refreshData={refreshData} editItem={editItem} />
    </>
  );
};

export default NewComponent;
