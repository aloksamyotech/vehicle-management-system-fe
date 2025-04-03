import React, { useState, useEffect } from 'react';
import { Card, Button, Box, Grid, Typography, Divider, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getApi, deleteApi } from 'common/apiClient';
import { urls } from 'common/urls';
import CustomToolbar from 'common/customToolbar';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant';
import { useTranslation } from 'react-i18next';

const FuelRecords = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.fuel.get);
      const formattedData = response.data.map((fuel, index) => ({
        id: fuel.id,
        fillDate: fuel.fillDate,
        quantity: fuel.quantity,
        odometerReading: fuel.odometerReading,
        amount: fuel.amount,
        comments: fuel.comments,
        vehicleId: fuel.vehicle.id,
        vehicle: fuel.vehicle?.vehicleName || 'N/A',
        driverId: fuel.driver.id,
        driver: fuel.driver?.name || 'N/A'
      }));
      setRows(formattedData);
    } catch (error) {
      toast.error(t('text.ERROR_FETCHING'));
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'sNo', headerName: t('text.S_NO'), width: 80 },
    {
      field: 'fillDate',
      headerName: t('text.FILL_DATE'),
      width: 150,
      renderCell: (params) => {
        const date = params.value ? new Date(params.value) : null;
        return date ? date.toLocaleDateString() : 'N/A';
      }
    },
    { field: 'vehicle', headerName: t('text.VEHICLE'), width: 200 },
    { field: 'quantity', headerName: t('text.QUANTITY'), width: 120 },
    { field: 'amount', headerName: t('text.TOTAL_AMOUNT'), width: 150 },
    { field: 'driver', headerName: t('text.FUEL_FILL_BY'), width: 150 },
    { field: 'odometerReading', headerName: t('text.ODOMETER_READING'), width: 150 },
    { field: 'comments', headerName: t('text.COMMENTS'), width: 200 },
    {
      field: 'actions',
      headerName: t('text.ACTION'),
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const navigate = useNavigate();

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              sx={{ color: '#17a2b8', py: 2 }}
              onClick={() => navigate(`/add-fuel/${params.row.id}`, { state: { ...params.row } })}
            >
              <BorderColorIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
            <IconButton color="error" sx={{ py: 2 }} onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      }
    }
  ];

  const handleDelete = async (id) => {
    await deleteApi(urls.fuel.delete.replace(':id', id));
    toast.success(t('text.FUEL_DELETED'));
    fetchData();
  };

  return (
    <>
      <CustomBreadcrumbs title={t('text.FUEL_MGNT')} links={[{ name: t('text.FUEL_MGNT'), path: '/fuel' }]} />

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
                    onAddClick: () => navigate('/add-fuel'),
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

export default FuelRecords;
