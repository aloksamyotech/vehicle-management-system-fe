import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Box, Typography, Breadcrumbs, Link as MuiLink, Card, IconButton, Divider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { BorderColor as BorderColorIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AddVehicleGroupModal from './addVehicleGroup';

const NewComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [rows, setRows] = useState([
    { id: 1, name: 'Group A', description: 'Description A', createdDate: '2025-01-01' },
    { id: 2, name: 'Group B', description: 'Description B', createdDate: '2025-01-02' },
    { id: 3, name: 'Group C', description: 'Description C', createdDate: '2025-01-03' }
  ]);

  const handleOpenModal = (item = null) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setEditItem(null);
    setOpenModal(false);
  };

  const handleSave = (name, description) => {
    if (editItem) {
      setRows(rows.map((row) => (row.id === editItem.id ? { ...row, name, description } : row)));
    } else {
      const newItem = {
        id: rows.length + 1,
        name,
        description,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setRows([...rows, newItem]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const columns = [
    { field: 'id', headerName: 'S.No', width: 80 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'description', headerName: 'Description', width: 350 },
    { field: 'createdDate', headerName: 'Created Date', width: 180 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton sx={{ color: '#17a2b8' }} onClick={() => handleOpenModal(params.row)}>
              <BorderColorIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
            <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </>
      )
    }
  ];

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
            sx={{
              '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
              '.MuiDataGrid-cell': { fontSize: '16px' }
            }}
          />
        </Box>
      </Card>
      <AddVehicleGroupModal open={openModal} handleClose={handleCloseModal} handleSave={handleSave} editItem={editItem} />
    </>
  );
};

export default NewComponent;
