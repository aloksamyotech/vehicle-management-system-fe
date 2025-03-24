import React, { useEffect, useState } from 'react';
import { Card, Button, Box, Grid, Divider, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { gridSpacing } from 'config.js';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getApi, deleteApi } from 'common/apiClient';
import { urls } from 'common/urls';
import CustomToolbar from 'common/customToolbar';
import CustomBreadcrumbs from 'common/customBreadcrumbs';

const DriverManagementPage = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.driver.get);
      const formattedData = response.data.map((driver, index) => ({
        id: driver.id,
        name: driver.name,
        mobileNo: driver.mobileNo,
        age: driver.age,
        licenseNo: driver.licenseNo,
        licenseExpiry: driver.licenseExpiry,
        totalExp: driver.totalExp,
        dateOfJoining: driver.dateOfJoining,
        notes: driver.notes,
        address: driver.address,
        status: driver.status,
        image: driver.image || null,
        doc: driver.doc || null
      }));
      setDrivers(formattedData);
    } catch (error) {
      toast.error('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteApi(urls.driver.delete.replace(':id', id));
      toast.success('Driver deleted successfully');
      fetchDrivers();
    } catch (error) {
      toast.error('Failed to delete driver');
    }
  };

  const columns = [
    { field: 'sNo', headerName: 'S.No', width: 80 },
    {
      field: 'image',
      headerName: 'Photo',
      width: 120,
      renderCell: (params) => <img src={params.row.image} alt="driver" style={{ width: 50, height: 50, borderRadius: '50%' }} />
    },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'mobileNo', headerName: 'Mobile', width: 150 },
    { field: 'licenseNo', headerName: 'License No', width: 150 },
    {
      field: 'licenseExpiry',
      headerName: 'License Exp Date',
      width: 150,
      renderCell: (params) => {
        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
      }
    },
    {
      field: 'dateOfJoining',
      headerName: 'Date of Joining',
      width: 150,
      renderCell: (params) => {
        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
      }
    },
    { field: 'doc', headerName: 'Doc', width: 100 },
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
              padding: '0'
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
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            sx={{ color: '#17a2b8', py: 2 }}
            onClick={() => navigate(`/add-driver/${params.row.id}`, { state: { ...params.row } })}
          >
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
      <CustomBreadcrumbs title="Driver Info" links={[{ name: 'Driver Management', path: '/driver' }]} />

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={loading ? [] : drivers.map((row, index) => ({ ...row, sNo: index + 1 }))}
                columns={columns}
                loading={loading}
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
                    onAddClick: () => navigate('/add-driver'),
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

export default DriverManagementPage;
