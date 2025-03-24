import React, { useState } from 'react';
import { Card, Button, Box, Grid, Typography, IconButton, Divider, Modal, Fade, Backdrop } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import UserForm from './addUser.jsx';
import CustomBreadcrumbs from 'common/customBreadcrumbs';

const initialUsers = [{ id: 1, name: 'test1', mobile: '1234567890', email: 'test1@gmail.com', status: 'Active' }];

const UserIndex = () => {
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleSave = (data) => {
    if (editData) {
      setUsers(users.map((user) => (user.id === editData.id ? { ...user, ...data } : user)));
    } else {
      setUsers([...users, { id: Date.now(), ...data }]);
    }
    setEditData(null);
    setOpen(false);
  };

  const handleClose = () => {
    setEditData(null);
    setOpen(false);
  };

  const handleEdit = (user) => {
    setEditData(user);
    setOpen(true);
  };

  const columns = [
    { field: 'id', headerName: 'S.No', width: 80 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'mobile', headerName: 'Mobile', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
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
          <IconButton color="primary" sx={{ py: 2 }} onClick={() => alert(`Viewing ${params.row.id}`)}>
            <VisibilityIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
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

  return (
    <>
      <CustomBreadcrumbs title="User's Info" links={[{ name: 'Users List', path: '/users' }]} />

      <Button variant="contained" color="primary" sx={{ my: 2 }} onClick={() => setOpen(true)}>
        Add
      </Button>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={users}
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
        </Grid>
      </Grid>

      <Modal open={open} onClose={handleClose} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
        <Fade in={open}>
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
              {editData ? 'Edit' : 'Add'} User
            </Typography>
            <UserForm open={open} onCancel={handleClose} onSave={handleSave} initialData={editData} />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default UserIndex;
