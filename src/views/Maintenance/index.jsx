import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Box, Grid, Typography, IconButton, Link as MuiLink, Breadcrumbs, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getApi, deleteApi, updateApi } from 'common/apiClient';
import { urls } from 'common/urls';

const MaintenanceIndex = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.maintenance.get);
      const formattedData = response.data.map((maintenance, index) => ({
        id: maintenance.id,
        vendorName: maintenance.vendorName,
        totalCost: maintenance.totalCost,
        model: maintenance.model,
        startDate: maintenance.startDate,
        endDate: maintenance.endDate,
        details: maintenance.details || "-",
        status: maintenance.status,
        vehicleId: maintenance.vehicle.id,
        group: maintenance.vehicle?.vehicleName || 'N/A'
      }));
      setShowData(formattedData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updateUrl = urls.maintenance.updateStatus.replace(':id', id);
      const response = await updateApi(updateUrl, { status: newStatus });
      setShowData((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, status: response.data.status } : row)));
      toast.success('Maintenance updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteApi(urls.maintenance.delete.replace(':id', id));
      toast.success('Maintenance deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete maintenance data');
    }
  };

  const columns = [
    { field: 'sNo', headerName: 'S.No', width: 80 },
    { field: 'group', headerName: 'Vehicle', width: 200 },
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 150,
      renderCell: (params) => {
        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
      }
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      width: 150,
      renderCell: (params) => {
        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
      }
    },
    { field: 'details', headerName: 'Service Info', width: 250 },
    { field: 'vendorName', headerName: 'Vendor', width: 150 },
    { field: 'totalCost', headerName: 'Cost', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Select value={params.row.status} onChange={(e) => handleStatusChange(params.row.id, e.target.value)} size="small" fullWidth>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      )
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="error" sx={{ py: 2 }} onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h3">Maintenance Records</Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <Typography color="text.primary">Maintenance Records</Typography>
        </Breadcrumbs>
      </Box>

      <Button variant="contained" color="primary" sx={{ my: 2 }} onClick={() => navigate('/add-maintenance')}>
        Add
      </Button>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={loading ? [] : showData.map((row, index) => ({ ...row, sNo: index + 1 }))}
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
    </>
  );
};

export default MaintenanceIndex;
