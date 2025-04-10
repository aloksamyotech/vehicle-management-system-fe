import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent, TextField, FormLabel, Autocomplete, Button, Grid } from '@mui/material';
import { urls } from 'common/urls';
import { getApi } from 'common/apiClient';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { DataGrid } from '@mui/x-data-grid';
import toast from 'react-hot-toast';
import { ThumbUp, ThumbDown, Assessment } from '@mui/icons-material';
import { text } from 'common/constant';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

const Reports = () => {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [bookings, setBookings] = useState([]);
  const [incomeExpense, setIncomeExpense] = useState([]);
  const [fuel, setFuel] = useState([]);
  const [driverReport, setDriverReport] = useState([]);
  const [summary, setSummary] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const [vehiclesRes, driversRes, bookingsRes, incomeExpenseRes, fuelRes, driverReportRes] = await Promise.all([
        getApi(`${urls.vehicle.get}?all=true`),
        getApi(`${urls.driver.get}?all=true`),
        getApi(urls.booking.report),
        getApi(urls.incomeExpense.report),
        getApi(urls.fuel.report),
        getApi(urls.booking.driverReport)
      ]);

      setVehicles(vehiclesRes?.data?.vehicleDetails || []);
      setDrivers(driversRes?.data?.driverDetails || []);
      setBookings(bookingsRes?.data || []);
      setIncomeExpense(incomeExpenseRes?.data?.incomeExpenseDetails || []);
      setSummary(incomeExpenseRes?.data?.summary || '');
      setFuel(fuelRes?.data?.fuelDetails || []);
      setDriverReport(driverReportRes?.data || []);
    };

    fetchData();
  }, [paginationModel]);

  const fetchFilteredReports = async () => {
    try {
      const params = new URLSearchParams();

      if (startDate) {
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        params.append('startDate', formattedStartDate);
      }

      if (endDate) {
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');
        params.append('endDate', formattedEndDate);
      }

      if (selectedVehicle?.id) params.append('vehicleId', selectedVehicle.id);
      if (selectedDriver?.id) params.append('driverId', selectedDriver.id);

      params.append('page', paginationModel.page + 1);
      params.append('limit', paginationModel.pageSize);

      const query = params.toString();

      switch (tabIndex) {
        case 0: {
          const res = await getApi(`${urls.booking.report}?${query}`);
          setBookings(res?.data?.vehicleDetails || []);
          setTotalRows(res?.data?.pagination?.total || 0);
          break;
        }
        case 1: {
          const res = await getApi(`${urls.incomeExpense.report}?${query}`);
          setIncomeExpense(res?.data?.incomeExpenseDetails || []);
          setTotalRows(res?.data?.pagination?.total || 0);
          break;
        }
        case 2: {
          const res = await getApi(`${urls.fuel.report}?${query}`);
          setFuel(res?.data?.fuelDetails || []);
          setTotalRows(res?.data?.pagination?.total || 0);
          break;
        }
        case 3: {
          const res = await getApi(`${urls.booking.driverReport}?${query}`);
          setDriverReport(res?.data?.driverDetails || []);
          setTotalRows(res?.data?.pagination?.total || 0);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleGenerateReport = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error(t('text.INVALID_DATE_RANGE'));
      return;
    }
    fetchFilteredReports();
  };

  useEffect(() => {
    fetchFilteredReports();
  }, [paginationModel, tabIndex]);

  useEffect(() => {
    setStartDate(null);
    setEndDate(null);
    setSelectedVehicle('');
    setSelectedDriver('');
    setStartDateError(false);
    setEndDateError(false);
    setPaginationModel({ page: 0, pageSize: 10 });
  }, [tabIndex]);

  return (
    <Box>
      <CustomBreadcrumbs title={t('text.REPORTS')} links={[{ name: t('text.REPORTS'), path: '/reports' }]} />

      <Tabs
        value={tabIndex}
        onChange={(event, newIndex) => setTabIndex(newIndex)}
        variant="fullWidth"
        sx={{
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          '& .MuiTabs-indicator': {
            backgroundColor: 'transparent'
          }
        }}
      >
        <Tab
          label={t('text.BOOKINGS')}
          sx={{
            backgroundColor: tabIndex === 0 ? '#1482d7' : 'transparent',
            color: tabIndex === 0 ? '#fff !important' : '#000',
            borderRadius: '8px',
            fontWeight: tabIndex === 0 ? 'bold' : 'normal'
          }}
        />

        <Tab
          label={t('text.INCOME_EXPENSE')}
          sx={{
            backgroundColor: tabIndex === 1 ? '#1482d7' : 'transparent',
            color: tabIndex === 1 ? '#fff !important' : '#000',
            borderRadius: '8px',
            fontWeight: tabIndex === 1 ? 'bold' : 'normal'
          }}
        />

        <Tab
          label={t('text.FUEL')}
          sx={{
            backgroundColor: tabIndex === 2 ? '#1482d7' : 'transparent',
            color: tabIndex === 2 ? '#fff !important' : '#000',
            borderRadius: '8px',
            fontWeight: tabIndex === 2 ? 'bold' : 'normal'
          }}
        />

        <Tab
          label={t('text.DRIVER')}
          sx={{
            backgroundColor: tabIndex === 3 ? '#1482d7' : 'transparent',
            color: tabIndex === 3 ? '#fff !important' : '#000',
            borderRadius: '8px',
            fontWeight: tabIndex === 3 ? 'bold' : 'normal'
          }}
        />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3} md={2}>
                    <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                      {t('text.FROM')}
                    </FormLabel>
                    <DatePicker
                      value={startDate}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                        setStartDateError(false);
                      }}
                      maxDate={endDate || new Date()}
                      renderInput={(params) => (
                        <TextField {...params} size="small" error={startDateError} sx={{ flex: 1, minWidth: 200 }} />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3} md={2}>
                    <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                      {t('text.TO')}
                    </FormLabel>
                    <DatePicker
                      value={endDate}
                      onChange={(newValue) => {
                        setEndDate(newValue);
                        setEndDateError(false);
                      }}
                      minDate={startDate || new Date()}
                      renderInput={(params) => <TextField {...params} size="small" error={endDateError} sx={{ flex: 1, minWidth: 200 }} />}
                    />
                  </Grid>

                  {(tabIndex === 0 || tabIndex === 1 || tabIndex === 2) && (
                    <Grid item xs={12} sm={4} md={4} sx={{ mt: '20px' }}>
                      <Autocomplete
                        size="small"
                        options={vehicles}
                        getOptionLabel={(option) => option.vehicleName || ''}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={selectedVehicle || null}
                        onChange={(_, newValue) => setSelectedVehicle(newValue || null)}
                        renderInput={(params) => <TextField {...params} label={t('text.SELECT_VEHICLE')} sx={{ flex: 1, minWidth: 180 }} />}
                      />
                    </Grid>
                  )}

                  {tabIndex === 3 && (
                    <Grid item xs={12} sm={4} md={4} sx={{ mt: '20px' }}>
                      <Autocomplete
                        size="small"
                        options={drivers}
                        getOptionLabel={(option) => option.name || ''}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={selectedDriver || null}
                        onChange={(_, newValue) => setSelectedDriver(newValue || '')}
                        renderInput={(params) => <TextField {...params} label={t('text.SELECT_DRIVER')} sx={{ flex: 1, minWidth: 180 }} />}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} sm={3} md={2} sx={{ mt: '20px' }}>
                    <Button
                      variant="outlined"
                      onClick={handleGenerateReport}
                      sx={{
                        borderColor: '#17a2b8',
                        color: '#17a2b8',
                        backgroundColor: 'white',
                        '&:hover': {
                          backgroundColor: '#17a2b8',
                          borderColor: '#17a2b8',
                          color: '#fff'
                        }
                      }}
                    >
                      {t('text.GENERATE_REPORT')}
                    </Button>
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </Box>

            {tabIndex === 0 && bookings.length > 0 && (
              <Card sx={{ mt: '20px' }}>
                <DataGrid
                  rows={bookings.map((row, index) => ({
                    id: index + 1,
                    sNo: index + 1,
                    customer: row.customer?.name || 'N/A',
                    driver: row.driver?.name || 'N/A',
                    vehicle: row.vehicle?.vehicleName || 'N/A',
                    totalAmt: row.totalAmt,
                    tripStatus: row.tripStatus,
                    tripType: row.tripType,
                    totalKm: row.totalKm,
                    tripStartLoc: row.tripStartLoc,
                    tripEndLoc: row.tripEndLoc
                  }))}
                  columns={[
                    { field: 'sNo', headerName: t('text.S_NO'), width: 70 },
                    { field: 'customer', headerName: t('text.CUSTOMER'), width: 150 },
                    { field: 'vehicle', headerName: t('text.VEHICLE'), width: 150 },
                    { field: 'tripType', headerName: t('text.TYPE'), width: 150 },
                    { field: 'driver', headerName: t('text.DRIVER'), width: 150 },
                    {
                      field: 'trip',
                      headerName: t('text.FROM_TO'),
                      width: 200,
                      renderCell: (params) => (
                        <Box>
                          <Typography>{params.row.tripStartLoc ? params.row.tripStartLoc : 'N/A'}</Typography>
                          <Typography>to</Typography>
                          <Typography>{params.row.tripEndLoc ? params.row.tripEndLoc : 'N/A'}</Typography>
                        </Box>
                      )
                    },
                    { field: 'totalKm', headerName: t('text.DISTANCE'), width: 100 },
                    { field: 'totalAmt', headerName: t('text.AMOUNT'), width: 100 },
                    {
                      field: 'tripStatus',
                      headerName: t('text.STATUS'),
                      width: 120,
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
                    }
                  ]}
                  rowCount={totalRows}
                  paginationMode="server"
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  getRowHeight={() => 75}
                  sx={{
                    '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
                    '.MuiDataGrid-cell': { fontSize: '16px' }
                  }}
                />
              </Card>
            )}

            {tabIndex === 1 && incomeExpense.length > 0 && (
              <>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ p: 2, display: 'flex', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#28a745',
                          borderRadius: 1,
                          mr: 2
                        }}
                      >
                        <ThumbUp sx={{ color: 'white', fontSize: 30 }} />
                      </Box>
                      <Box>
                        <Typography variant="h5">{t('text.TOTAL_INCOME')}</Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {summary?.income || 0}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Card sx={{ p: 2, display: 'flex', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#ffc107',
                          borderRadius: 1,
                          mr: 2
                        }}
                      >
                        <ThumbDown sx={{ color: 'black', fontSize: 30 }} />
                      </Box>
                      <Box>
                        <Typography variant="h5">{t('text.TOTAL_EXPENSE')}</Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {summary?.expense || 0}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Card sx={{ p: 2, display: 'flex', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#17a2b8',
                          borderRadius: 1,
                          mr: 2
                        }}
                      >
                        <Assessment sx={{ color: 'white', fontSize: 30 }} />
                      </Box>
                      <Box>
                        <Typography variant="h5">{summary?.status || 'Status'}</Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {summary?.profitOrLoss || 0}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>

                <Card sx={{ mt: '20px' }}>
                  <DataGrid
                    rows={incomeExpense.map((row, index) => ({
                      id: index + 1,
                      sNo: index + 1,
                      vehicle: row.vehicle?.vehicleName || 'N/A',
                      date: row.date,
                      description: row.description,
                      amount: row.amount,
                      type: row.type
                    }))}
                    columns={[
                      { field: 'sNo', headerName: t('text.S_NO'), width: 70 },
                      { field: 'vehicle', headerName: t('text.VEHICLE'), width: 200 },
                      {
                        field: 'date',
                        headerName: t('text.DATE'),
                        width: 150,
                        renderCell: (params) => {
                          return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
                        }
                      },
                      { field: 'description', headerName: t('text.DESCRIPTION'), width: 200 },
                      { field: 'amount', headerName: t('text.AMOUNT'), width: 150 },
                      {
                        field: 'type',
                        headerName: t('text.TYPE'),
                        width: 120,
                        renderCell: (params) => {
                          const isExpense = params.row.type === 'Expense';
                          return (
                            <Button
                              variant="contained"
                              style={{
                                backgroundColor: isExpense ? '#dc3545' : '#30aa4c',
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
                      }
                    ]}
                    rowCount={totalRows}
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    sx={{
                      '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
                      '.MuiDataGrid-cell': { fontSize: '16px' }
                    }}
                    getRowHeight={() => 75}
                  />
                </Card>
              </>
            )}

            {tabIndex === 2 && fuel.length > 0 && (
              <Card sx={{ mt: '20px' }}>
                <DataGrid
                  rows={fuel.map((row, index) => ({
                    id: index + 1,
                    sNo: index + 1,
                    vehicle: row.vehicle?.vehicleName || 'N/A',
                    driver: row.driver?.name || 'N/A',
                    fillDate: row.fillDate,
                    amount: row.amount,
                    quantity: row.quantity,
                    odometerReading: row.odometerReading,
                    comments: row.comments
                  }))}
                  columns={[
                    { field: 'sNo', headerName: t('text.S_NO'), width: 70 },
                    {
                      field: 'fillDate',
                      headerName: t('text.FILL_DATE'),
                      width: 150,
                      renderCell: (params) => {
                        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
                      }
                    },
                    { field: 'vehicle', headerName: t('text.VEHICLE'), width: 150 },
                    { field: 'quantity', headerName: t('text.QUANTITY'), width: 100 },
                    { field: 'amount', headerName: t('text.TOTAL_AMOUNT'), width: 150 },
                    { field: 'driver', headerName: t('text.FUEL_FILL_BY'), width: 150 },
                    { field: 'odometerReading', headerName: t('text.ODOMETER_READING'), width: 150 },
                    { field: 'comments', headerName: t('text.COMMENTS'), width: 150 }
                  ]}
                  disableRowSelectionOnClick
                  sx={{
                    '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
                    '.MuiDataGrid-cell': { fontSize: '16px' }
                  }}
                  getRowHeight={() => 75}
                  rowCount={totalRows}
                  paginationMode="server"
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                />
              </Card>
            )}

            {tabIndex === 3 && driverReport.length > 0 && (
              <Card sx={{ mt: '20px' }}>
                <DataGrid
                  rows={driverReport.map((row, index) => ({
                    id: index + 1,
                    sNo: index + 1,
                    driver: row.driver?.name || 'N/A',
                    vehicle: row.vehicle?.vehicleName || 'N/A',
                    createdAt: row.createdAt,
                    tripStartDate: row.tripStartDate,
                    totalAmt: row.totalAmt,
                    totalKm: row.totalKm,
                    tripStartLoc: row.tripStartLoc,
                    tripEndLoc: row.tripEndLoc
                  }))}
                  columns={[
                    { field: 'sNo', headerName: t('text.S_NO'), width: 70 },
                    {
                      field: 'tripStartDate',
                      headerName: t('text.BOOKING_DATE'),
                      width: 150,
                      renderCell: (params) => {
                        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
                      }
                    },
                    {
                      field: 'trip',
                      headerName: t('text.FROM_TO'),
                      width: 220,
                      renderCell: (params) => (
                        <Box>
                          <Typography>{params.row.tripStartLoc ? params.row.tripStartLoc : 'N/A'}</Typography>
                          <Typography>to</Typography>
                          <Typography>{params.row.tripEndLoc ? params.row.tripEndLoc : 'N/A'}</Typography>
                        </Box>
                      )
                    },
                    { field: 'totalKm', headerName: t('text.DISTANCE'), width: 150 },
                    { field: 'vehicle', headerName: t('text.VEHICLE'), width: 150 },
                    { field: 'driver', headerName: t('text.DRIVER'), width: 150 },
                    {
                      field: 'createdAt',
                      headerName: t('text.CREATED_AT'),
                      width: 150,
                      renderCell: (params) => {
                        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
                      }
                    }
                  ]}
                  rowCount={totalRows}
                  paginationMode="server"
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  sx={{
                    '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
                    '.MuiDataGrid-cell': { fontSize: '16px' }
                  }}
                  getRowHeight={() => 75}
                />
              </Card>
            )}

          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Reports;
