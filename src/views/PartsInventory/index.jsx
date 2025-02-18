import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, Button, Box, Grid, Typography, Divider, IconButton, 
  Link as MuiLink, Breadcrumbs, Modal, Fade, Backdrop 
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPartForm from './addParts';

const columns = (handleEdit, handleDelete) => [
  { field: 'id', headerName: 'S.No', width: 80 },
  { field: 'name', headerName: 'Name', width: 250 },
  { field: 'description', headerName: 'Description', width: 400 },
  { field: 'stock', headerName: 'Stock', width: 120 },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    renderCell: (params) => {
      const isActive = params.row.status === 'Active';
      return (
        <Button
          variant="contained"
          style={{
            backgroundColor: isActive ? '#30aa4c' : '#dc3545',
            color: 'white',
            fontWeight: 700,
            fontSize: '10px',
            padding: 0
          }}
        >
          {params.row.status}
        </Button>
      );
    }
  },
  {
    field: 'actions',
    headerName: 'Action',
    width: 150,
    sortable: false,
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

const initialRows = [
  { id: 1, name: 'Brake Pad', description: 'High-performance brake pad', stock: 50, status: 'Active' },
  { id: 2, name: 'Oil Filter', description: 'Durable engine oil filter', stock: 10, status: 'Inactive' },
  { id: 3, name: 'Spark Plug', description: 'Premium spark plug', stock: 0, status: 'Active' }
];

const PartsInventory = () => {
  const [rows, setRows] = useState(initialRows);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleOpen = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleEdit = (row) => {
    setEditData(row);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleSave = (data) => {
    if (editData) {
      setRows(rows.map(row => (row.id === editData.id ? { ...row, ...data } : row)));
    } else {
      setRows([...rows, { id: rows.length + 1, ...data }]);
    }
    handleClose();
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h3">Parts Inventory</Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <Typography color="text.primary">Parts Inventory</Typography>
        </Breadcrumbs>
      </Box>

      <Button variant="contained" color="primary" sx={{ my: 2 }} onClick={handleOpen}>Add</Button>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns(handleEdit, handleDelete)}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
                sx={{
                  '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
                  '.MuiDataGrid-cell': { fontSize: '16px' }
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
        <Fade in={open}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>{editData ? 'Edit Part' : 'Add Part'}</Typography>
            <AddPartForm initialData={editData} onSave={handleSave} onCancel={handleClose} />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default PartsInventory;
