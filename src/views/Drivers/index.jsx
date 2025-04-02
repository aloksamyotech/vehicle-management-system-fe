import React, { useEffect, useState } from 'react';
import { Card, Switch, Box, Grid, Divider, IconButton, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { gridSpacing } from 'config.js';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getApi, deleteApi, updateApi } from 'common/apiClient';
import { urls } from 'common/urls';
import CustomToolbar from 'common/customToolbar';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant';
import ToggleSwitch from 'common/toggleSwitch';

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
        email: driver.email,
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
      toast.error(text.ERROR_FETCHING);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteApi(urls.driver.delete.replace(':id', id));
    toast.success(text.DRIVER_DELETED);
    fetchDrivers();
  };

  const columns = [
    { field: 'sNo', headerName: text.S_NO, width: 80 },
    {
      field: 'image',
      headerName: text.PHOTO,
      width: 120,
      renderCell: (params) => <img src={params.row.image} alt="driver" style={{ width: 50, height: 50, borderRadius: '50%' }} />
    },
    { field: 'name', headerName: text.NAME, width: 150 },
    { field: 'email', headerName: text.EMAIL, width: 200 },
    { field: 'mobileNo', headerName: text.MOBILE, width: 150 },
    { field: 'licenseNo', headerName: text.LICENSE_NO, width: 150 },
    {
      field: 'licenseExpiry',
      headerName: text.LICENSE_EXP_DATE,
      width: 180,
      renderCell: (params) => {
        const date = params.value ? new Date(params.value) : null;
        return date ? date.toLocaleDateString() : 'N/A';
      }
    },
    {
      field: 'dateOfJoining',
      headerName: text.DATE_OF_JOINING,
      width: 150,
      renderCell: (params) => {
        const date = params.value ? new Date(params.value) : null;
        return date ? date.toLocaleDateString() : 'N/A';
      }
    },
    { field: 'doc', headerName: text.DOCUMENT, width: 100 },
    {
      field: 'status',
      headerName: text.STATUS,
      width: 200,
      renderCell: (params) => {
        const isActive = params.row.status === 'Active';

        return (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: '15px' }}>
            <Typography sx={{ fontWeight: 600, color: isActive ? 'green' : 'gray' }}>{text.ACTIVE}</Typography>
            <ToggleSwitch
              checked={isActive}
              onChange={() => handleStatusToggle(params.row.id, params.row.status, params.api)}
              color="success"
            />
            <Typography sx={{ fontWeight: 600, color: !isActive ? 'red' : 'gray' }}>{text.INACTIVE}</Typography>
          </Stack>
        );
      }
    },
    {
      field: 'actions',
      headerName: text.ACTION,
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

  const handleStatusToggle = async (id, currentStatus, api) => {
    try {
      const updatedStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      const updateUrl = urls.driver.updateStatus.replace(':id', id);
      await updateApi(updateUrl, { status: updatedStatus });

      api.updateRows([{ id, status: updatedStatus }]);
      toast.success(`Status updated to ${updatedStatus}!`);
    } catch (error) {
      console.error(text.ERROR_UPDATING, error);
    }
  };

  return (
    <>
      <CustomBreadcrumbs title={text.DRIVER_INFO} links={[{ name: text.DRIVER_MGNT, path: '/driver' }]} />

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
