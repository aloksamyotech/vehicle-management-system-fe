import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Box, Grid, Typography, Breadcrumbs, IconButton, Divider, Modal, Fade, Backdrop } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import IncomeExpenseForm from './addFinance.jsx';

const initialRows = [{ id: 1, vehicle: '122_123', date: '2025-02-13', description: 'Added fuel - hjgjh', amount: 656, type: 'Expense' }];

const FinanceIndex = () => {
  const [rows, setRows] = useState(initialRows);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleSave = (data) => {
    if (editData) {
      setRows(rows.map((row) => (row.id === editData.id ? { ...row, ...data } : row)));
    } else {
      setRows([...rows, { id: Date.now(), ...data }]);
    }
    setEditData(null);
    setOpen(false);
  };

  const handleClose = () => {
    setEditData(null);
    setOpen(false);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setOpen(true);
  };

  const columns = [
    { field: 'id', headerName: 'S.No', width: 80 },
    { field: 'vehicle', headerName: 'Vehicle', width: 150 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'amount', headerName: 'Amount', width: 120 },
    { field: 'type', headerName: 'Type', width: 120 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ color: '#17a2b8' }} onClick={() => handleEdit(params.row)}>
            <BorderColorIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h3">Finance Records</Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <Link to="/dashboard/default" style={{ textDecoration: 'none', color: '#17a2b8' }}>
            Dashboard
          </Link>
          <Typography color="text.primary">Finance</Typography>
        </Breadcrumbs>
      </Box>

      <Button variant="contained" color="primary" sx={{ my: 2 }} onClick={() => setOpen(true)}>
        Add
      </Button>

      <Grid container spacing={2}>
        <Grid item xs={12}>
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
              {editData ? 'Edit' : 'Add'} Income Expense
            </Typography>
            <IncomeExpenseForm open={open} onClose={handleClose} onSave={handleSave} initialData={editData} />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default FinanceIndex;
