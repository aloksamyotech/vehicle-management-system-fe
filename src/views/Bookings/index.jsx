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
import { useTranslation } from 'react-i18next';

const BookingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getApi(`${urls.booking.get}?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`);
      const bookingList = response?.data?.bookingDetails || [];
      const pagination = response?.data?.pagination || { total: 0 };

      const formattedData = bookingList.map((booking, index) => ({
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
      setTotalRows(pagination.total);
    } catch (error) {
      toast.error(t('text.ERROR_FETCHING'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel]);

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
        }}
      >
        {driver}
      </Button>
    );
  };

  const columns = [
    { field: 'sNo', headerName: t('text.S_NO'), width: 80 },
    { field: 'customer', headerName: t('text.CUSTOMER'), width: 150 },
    { field: 'vehicle', headerName: t('text.VEHICLE'), width: 150, editable: true },
    {
      field: 'tripDates',
      headerName: t('text.DATE'),
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row.tripStartDate ? dayjs(params.row.tripStartDate).format('YYYY-MM-DD HH:mm') : 'N/A'}</Typography>
          <Typography>to</Typography>
          <Typography>{params.row.tripEndDate ? dayjs(params.row.tripEndDate).format('YYYY-MM-DD HH:mm') : 'N/A'}</Typography>
        </Box>
      )
    },
    { field: 'tripType', headerName: t('text.TYPE'), width: 120 },
    {
      field: 'driver',
      headerName: t('text.DRIVER'),
      width: 150,
      renderCell: (params) => {
        return params.value === 'Yet to Assign' ? renderDriverButton('Yet to Assign') : params.value;
      }
    },
    {
      field: 'tripStatus',
      headerName: t('text.STATUS'),
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
      headerName: t('text.ACTION'),
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
    toast.success(t('text.BOOKING_DELETED'));
    fetchData();
  };

  return (
    <>
      <CustomBreadcrumbs title={t('text.BOOKINGS')} links={[{ name: t('text.BOOKINGS'), path: '/booking' }]} />

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={
                  loading ? [] : rows.map((row, index) => ({ ...row, sNo: paginationModel.page * paginationModel.pageSize + index + 1 }))
                }
                getRowHeight={() => 75}
                columns={columns}
                rowCount={totalRows}
                loading={loading}
                pagination
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[10]}
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
