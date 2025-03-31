import React, { useState, useEffect } from 'react';
import { Card, Button, Box, Grid, Typography, Divider, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getApi, deleteApi } from 'common/apiClient';
import { urls } from 'common/urls';
import { gridSpacing } from 'config';
import dayjs from 'dayjs';
import CustomToolbar from 'common/customToolbar';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant';

const BookingPage = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.booking.get);
      const formattedData = response.data.map((booking, index) => ({
        id: booking.id,
        tripStartDate: booking.tripStartDate,
        tripEndDate: booking.tripEndDate,
        tripStartLoc: booking.tripStartLoc,
        tripEndLoc: booking.tripEndLoc,
        tripStartPincode: booking.tripStartPincode,
        tripEndPincode: booking.tripEndPincode,
        totalKm: booking.totalKm,
        totalAmt: booking.totalAmt,
        tripType: booking.tripType,
        tripStatus: booking.tripStatus,
        customerId: booking.customer.id,
        customer: booking.customer?.name || 'N/A',
        vehicleId: booking.vehicle.id,
        vehicle: booking.vehicle?.vehicleName || 'N/A',
        driverId: booking.driver?.id || null,
        driver: booking.driver ? booking.driver.name : 'Yet to Assign'
      }));
      setRows(formattedData);
    } catch (error) {
      toast.error('Failed to fetch booking data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderDriverButton = (driver) => {
    return (
      <Button
        variant="contained"
        style={{
          backgroundColor: driver === 'Yet to Assign' ? '#dc3545' : '#5bc0de',
          color: driver === 'Yet to Assign' ? 'white' : '#000',
          fontWeight: 700,
          fontSize: '10px',
          padding: '0',
          width: 'auto'
,        }}
      >
        {driver}
      </Button>
    );
  };

  const columns = [
    { field: 'sNo', headerName: text.S_NO, width: 80 },
    { field: 'customer', headerName: text.CUSTOMER, width: 150 },
    { field: 'vehicle', headerName: text.VEHICLE, width: 150, editable: true },
    {
      field: 'tripDates',
      headerName: text.DATE,
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row.tripStartDate ? dayjs(params.row.tripStartDate).format('YYYY-MM-DD HH:mm') : 'N/A'}</Typography>
          <Typography>to</Typography>
          <Typography>{params.row.tripEndDate ? dayjs(params.row.tripEndDate).format('YYYY-MM-DD HH:mm') : 'N/A'}</Typography>
        </Box>
      )
    },
    { field: 'tripType', headerName: text.TYPE, width: 120 },
    {
      field: 'driver',
      headerName: 'Driver',
      width: 150,
      renderCell: (params) => {
        return params.value === 'Yet to Assign' ? renderDriverButton('Yet to Assign') : params.value;
      }
    },
    {
      field: 'tripStatus',
      headerName: text.STATUS,
      width: 100,
      renderCell: (params) => {
        const status = params.row.tripStatus;
        const statusColors = {
          Cancelled: '#dc3545',
          Ongoing: '#17a2b8',
          Completed: '#30aa4c',
          YetToStart: '#ffc107'
        };

        return (
          <Button
            variant="contained"
            style={{
              backgroundColor: statusColors[status] || '#6c757d',
              color: status === 'YetToStart' ? '#000' : 'white',
              fontWeight: 700,
              fontSize: '10px',
              width: 'auto',
              padding: '0'
            }}
          >
            {status === 'YetToStart' ? 'Yet to start' : status}
          </Button>
        );
      }
    },
    {
      field: 'actions',
      headerName: text.ACTION,
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const navigate = useNavigate();
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="primary" sx={{ py: 3 }} onClick={() => navigate(`/view-booking/${params.row.id}`)}>
              <VisibilityIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
            <IconButton
              sx={{ color: '#17a2b8', py: 2 }}
              onClick={() => navigate(`/add-booking/${params.row.id}`, { state: { ...params.row } })}
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
    await deleteApi(urls.booking.delete.replace(':id', id));
    toast.success(text.BOOKING_DELETED);
    fetchData();
  };

  return (
    <>
      <CustomBreadcrumbs title={text.BOOKINGS} links={[{ name: text.BOOKINGS, path: '/booking' }]} />

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={loading ? [] : rows.map((row, index) => ({ ...row, sNo: index + 1 }))}
                columns={columns}
                getRowHeight={() => 75}
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
                    onAddClick: () => navigate('/add-booking'),
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

export default BookingPage;
