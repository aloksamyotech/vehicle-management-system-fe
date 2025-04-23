import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Grid, Button, Chip, Card, Typography, Box } from '@mui/material';
import { gridSpacing } from 'config.js';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant';
import { useTranslation } from 'react-i18next';
import { getApi } from 'common/apiClient';
import { fetchCurrencySymbol } from 'common/function';
import { urls } from 'common/urls';
import toast from 'react-hot-toast';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';

const ViewDriver = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const driver = location.state;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getApi(`${urls.booking.driverReport}?driverId=${id}`);
      const bookings = res?.data?.driverDetails || [];
      const pagination = res?.data?.pagination || { total: 0 };

      const formattedRows = bookings.map((booking) => ({
        id: booking.id,
        invoiceNo: booking.invoiceNo,
        tripType: booking.tripType,
        tripStatus: booking.tripStatus,
        startLocation: booking.tripStartLoc,
        endLocation: booking.tripEndLoc,
        startDate: dayjs(booking.tripStartDate).format('DD MMM YYYY'),
        endDate: dayjs(booking.tripEndDate).format('DD MMM YYYY'),
        totalKm: booking.totalKm,
        totalAmt: booking.totalAmt,
        customer: booking.customer?.name,
        vehicle: booking.vehicle?.vehicleName
      }));

      setRows(formattedRows);
      setTotalRows(pagination.total);
    } catch (err) {
      toast.error(t('text.ERROR_FETCHING'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [id]);

  const columns = [
    { field: 'sNo', headerName: t('text.S_NO'), width: 80 },
    { field: 'invoiceNo', headerName: t('text.INV_NO'), width: 100 },
    { field: 'customer', headerName: t('text.CUSTOMER'), width: 150 },
    { field: 'vehicle', headerName: t('text.VEHICLE'), width: 150 },
    { field: 'tripType', headerName: t('text.TRIP_TYPE'), width: 150 },
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
      field: 'tripDates',
      headerName: t('text.DATE'),
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row.startDate ? dayjs(params.row.startDate).format('YYYY-MM-DD HH:mm') : 'N/A'}</Typography>
          <Typography>{t('text.TO')}</Typography>
          <Typography>{params.row.endDate ? dayjs(params.row.endDate).format('YYYY-MM-DD HH:mm') : 'N/A'}</Typography>
        </Box>
      )
    },
    {
      field: 'locations',
      headerName: t('text.LOC'),
      width: 250,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row.startLocation || 'N/A'}</Typography>
          <Typography>{t('text.TO')}</Typography>
          <Typography>{params.row.endLocation || 'N/A'}</Typography>
        </Box>
      )
    },
    { field: 'totalKm', headerName: `${t('text.DISTANCE')} (Km)`, width: 150 },
    {
      field: 'totalAmt',
      headerName: t('text.TOTAL_COST'),
      width: 120,
      renderCell: (params) => `${currencySymbol} ${params.value}`
    }
  ];

  return (
    <>
      <CustomBreadcrumbs
        title={t('text.VIEW_DRIVER')}
        links={[
          { name: t('text.DRIVER'), path: '/drivers' },
          { name: t('text.VIEW_DRIVER'), path: '' }
        ]}
      />
      <Box>
        <Card sx={{ p: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>{t('text.NAME')}:</strong> {driver.name}
              </Typography>
              <Typography>
                <strong>{t('text.PHONE')}:</strong> {driver.mobileNo}
              </Typography>
              <Typography>
                <strong>{t('text.ADDRESS')}:</strong> {driver.address}
              </Typography>
              <Typography>
                <strong>{t('text.DATE_OF_JOINING')}:</strong> {dayjs(driver.dateOfJoining).format('DD-MM-YYYY')}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography>
                <strong>{t('text.STATUS')}:</strong>{' '}
                <Chip
                  label={driver.status}
                  size="small"
                  sx={{
                    bgcolor: driver.status === 'Active' ? '#30aa4c' : '#dc3545',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: 1,
                    fontSize: '12px',
                    height: 20,
                    minHeight: 20
                  }}
                />
              </Typography>
              <Typography>
                <strong>{t('text.LICENSE_NO')}:</strong> {driver.licenseNo}
              </Typography>
              <Typography>
                <strong>{t('text.LICENSE_EXP_DATE')}:</strong> {dayjs(driver.licenseExpiry).format('DD-MM-YYYY')}
              </Typography>
            </Grid>
          </Grid>
        </Card>

        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} mt={2}>
            <Card>
              <Box sx={{ height: 'auto', width: '100%' }}>
                <DataGrid
                  rows={
                    loading
                      ? []
                      : rows.map((row, index) => ({
                          ...row,
                          sNo: paginationModel.page * paginationModel.pageSize + index + 1
                        }))
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
                    '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
                    '.MuiDataGrid-cell': { fontSize: '16px' }
                  }}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ViewDriver;
