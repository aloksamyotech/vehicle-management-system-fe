import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Box, TextField,Grid,FormLabel, IconButton, Typography, Breadcrumbs, Link as MuiLink, Card } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon } from '@mui/icons-material';

const NewComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [rows, setRows] = useState([
    { id: 1, name: 'Item 1', description: 'Description 1', createdDate: '2025-01-01' },
    { id: 2, name: 'Item 2', description: 'Description 2', createdDate: '2025-01-02' },
    { id: 3, name: 'Item 3', description: 'Description 3', createdDate: '2025-01-03' }
  ]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleAddItem = () => {
    setOpenModal(false);
    setNewName('');
    setNewDescription('');
  };

  const handleEdit = (id) => {
    console.log(`Editing item with ID: ${id}`);
  };

  const handleDelete = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
    console.log(`Deleting item with ID: ${id}`);
  };

  const columns = [
    { field: 'id', headerName: 'S.No', width: 80 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'description', headerName: 'Description', width: 350 },
    { field: 'createdDate', headerName: 'Created Date', width: 180 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ];

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
          Vehicle Group
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
          <Typography color="text.primary">Vehicle Group</Typography>
        </Breadcrumbs>
      </Box>
      <Button variant="contained" color="primary" sx={{ my: 2 }} onClick={handleOpenModal}>
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
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: 400
          }}
        >
          <Typography variant="h5" mb={2}>
            Add Vehicle Group
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Name</FormLabel>
              <TextField fullWidth required name="name" value={newName} onChange={(e) => setNewName(e.target.value)} size="small" />
            </Grid>
            <Grid item xs={12}>
              <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Description</FormLabel>
              <TextField
                fullWidth
                required
                name="stock"
                type="number"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' , mt:2}}>
            <Button variant="contained" color="primary" onClick={handleAddItem}>
              Add Group
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default NewComponent;
