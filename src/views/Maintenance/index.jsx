import React, { useEffect, useState } from 'react';
import { Card, Box, Grid, IconButton, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getApi, deleteApi, updateApi } from 'common/apiClient';
import { urls } from 'common/urls';
import CustomToolbar from 'common/customToolbar';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant';

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
        details: maintenance.details || '-',
        status: maintenance.status,
        vehicleId: maintenance.vehicle.id,
        group: maintenance.vehicle?.vehicleName || 'N/A'
      }));
      setShowData(formattedData);
    } catch (error) {
      toast.error(text.ERROR_FETCHING);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updateUrl = urls.maintenance.updateStatus.replace(':id', id);
      const response = await updateApi(updateUrl, { status: newStatus });
      setShowData((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, status: response.data.status } : row)));
      toast.success(text.MAINTENANCE_UPDATED);
      fetchData();
    } catch (error) {
      toast.error(text.ERROR_UPDATING);
    }
  };

  const handleDelete = async (id) => {
      await deleteApi(urls.maintenance.delete.replace(':id', id));
      toast.success(text.MAINTENANCE_DELETED);
      fetchData();
  };

  const columns = [
    { field: 'sNo', headerName: text.S_NO, width: 80 },
    { field: 'group', headerName: text.VEHICLE, width: 200 },
    {
      field: 'startDate',
      headerName: text.START_DATE,
      width: 150,
      renderCell: (params) => {
        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
      }
    },
    {
      field: 'endDate',
      headerName: text.END_DATE,
      width: 150,
      renderCell: (params) => {
        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
      }
    },
    { field: 'details', headerName: text.SERVICE_DETAILS, width: 250 },
    { field: 'vendorName', headerName: text.VENDOR_NAME, width: 150 },
    { field: 'totalCost', headerName: text.TOTAL_COST, width: 120 },
    {
      field: 'status',
      headerName: text.STATUS,
      width: 150,
      renderCell: (params) => (
        <Select value={params.row.status} onChange={(e) => handleStatusChange(params.row.id, e.target.value)} size="small" fullWidth>
          <MenuItem value="Pending">{text.PENDING}</MenuItem>
          <MenuItem value="In Progress">{text.IN_PROGRESS}</MenuItem>
          <MenuItem value="Completed">{text.COMPLETED}</MenuItem>
        </Select>
      )
    },
    {
      field: 'actions',
      headerName: text.ACTION,
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
      <CustomBreadcrumbs title={text.maintenanceRecords} links={[{ name: text.maintenanceRecords, path: '/maintenance' }]} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={loading ? [] : showData.map((row, index) => ({ ...row, sNo: index + 1 }))}
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
                    onAddClick: () => navigate('/add-maintenance'),
                    showExport: true
                  }
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
