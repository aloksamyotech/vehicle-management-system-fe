import React, { useState, useEffect } from 'react';
import { Card,Box, Grid, Typography,IconButton,Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import FuelReminderForm from './addReminder.jsx';
import { getApi, deleteApi } from 'common/apiClient';
import { urls } from 'common/urls';
import toast from 'react-hot-toast';
import CustomToolbar from 'common/customToolbar';
import CustomBreadcrumbs from 'common/customBreadcrumbs';

const FuelReminderIndex = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.reminder.get);
      const formattedData = response.data.map((rem, index) => ({
        id: rem.id,
        reminderDate: rem.reminderDate,
        message: rem.message,
        vehicleId: rem.vehicle.id,
        group: rem.vehicle?.vehicleName || 'N/A'
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
    { field: 'group', headerName: 'Vehicle', width: 250 },
    {
      field: 'reminderDate',
      headerName: 'Date',
      width: 150,
      renderCell: (params) => {
        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
      }
    },
    { field: 'message', headerName: 'Message', width: 400 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      )
    }
  ];

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const refreshData = () => {
    fetchData();
  };

  const handleDelete = async (id) => {
    try {
      await deleteApi(urls.reminder.delete.replace(':id', id));
      toast.success('Reminder deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to reminder');
    }
  };

  return (
    <>
      <CustomBreadcrumbs title="Reminder Info" links={[{ name: 'Reminders', path: '/reminder' }]} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={loading ? [] : rows.map((row, index) => ({ ...row, sNo: index + 1 }))}
                columns={columns}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
                sx={{
                  '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
                  '.MuiDataGrid-cell': { fontSize: '16px' }
                }}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
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
            Add Reminder
          </Typography>
          <FuelReminderForm onSave={handleClose} onCancel={handleClose} refreshData={refreshData} />
        </Box>
      </Modal>
    </>
  );
};

export default FuelReminderIndex;
