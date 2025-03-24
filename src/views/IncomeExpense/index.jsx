import React, { useState, useEffect } from 'react';
import { Card, Button, Box, Grid, Typography, IconButton, Divider, Modal } from '@mui/material';
import { DataGrid} from '@mui/x-data-grid';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import IncomeExpenseForm from './addFinance.jsx';
import { getApi, deleteApi } from 'common/apiClient';
import { urls } from 'common/urls';
import toast from 'react-hot-toast';
import CustomToolbar from 'common/customToolbar';
import CustomBreadcrumbs from 'common/customBreadcrumbs';

const FinanceIndex = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.incomeExpense.get);
      const formattedData = response.data.map((finance, index) => ({
        id: finance.id,
        type: finance.type,
        date: finance.date,
        description: finance.description,
        amount: finance.amount,
        vehicleId: finance.vehicle.id,
        vehicle: finance.vehicle?.vehicleName || 'N/A'
      }));
      setRows(formattedData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'sNo', headerName: 'S.No', width: 80 },
    { field: 'vehicle', headerName: 'Vehicle', width: 150 },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      renderCell: (params) => {
        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
      }
    },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'amount', headerName: 'Amount', width: 120 },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => {
        const isActive = params.row.type === 'Expense';
        return (
          <Button
            variant="contained"
            style={{
              backgroundColor: isActive ? '#30aa4c' : '#dc3545',
              color: 'white',
              fontWeight: 700,
              width: 'auto',
              fontSize: '10px',
              padding: 0
            }}
          >
            {params.row.type}
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
          <IconButton sx={{ color: '#17a2b8' }} onClick={() => handleOpen(params.row)}>
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

  const handleOpen = (finance = null) => {
    if (finance) {
      setEditData({
        ...finance,
        vehicle: rows.find((row) => row.vehicleId === finance.vehicleId)?.vehicle || ''
      });
    } else {
      setEditData(null);
    }
    setModalOpen(true);
  };

  const handleClose = () => {
    setEditData(null);
    setModalOpen(false);
  };

  const refreshData = () => {
    fetchData();
  };

  const handleDelete = async (id) => {
    try {
      await deleteApi(urls.incomeExpense.delete.replace(':id', id));
      toast.success('Income expense deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to income expense');
    }
  };

  return (
    <>
      <CustomBreadcrumbs title="Income & Expense" links={[{ name: 'Income & Expense', path: '/finance' }]} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={loading ? [] : rows.map((row, index) => ({ ...row, sNo: index + 1 }))}
                columns={columns}
                disableRowSelectionOnClick
                sx={{
                  '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
                  '.MuiDataGrid-cell': { fontSize: '16px' }
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
                    onAddClick: () => handleOpen(true),
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
            {editData?.id ? 'Edit' : 'Add'} Income Expense
          </Typography>
          <IncomeExpenseForm initialData={editData} onSave={handleClose} onCancel={handleClose} refreshData={refreshData} />
        </Box>
      </Modal>
    </>
  );
};

export default FinanceIndex;
