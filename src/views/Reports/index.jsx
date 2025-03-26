import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent, TextField, MenuItem, Button, Grid } from '@mui/material';
import { urls } from 'common/urls';
import { getApi } from 'common/apiClient';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { DataGrid } from '@mui/x-data-grid';
import toast from 'react-hot-toast';
import { ThumbUp, ThumbDown, Assessment } from '@mui/icons-material';
import { text } from 'common/constant';

const Reports = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [bookings, setBookings] = useState([]);
  const [incomeExpense, setIncomeExpense] = useState([]);
  const [fuel, setFuel] = useState([]);
  const [driverReport, setDriverReport] = useState([]);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await getApi(urls.vehicle.get);
      setVehicles(response.data);
    };

    const fetchDrivers = async () => {
      const response = await getApi(urls.driver.get);
      setDrivers(response.data);
    };

    fetchVehicles();
    fetchDrivers();
  }, []);

  const fetchVehicleBookings = async () => {
    const queryParams = {
      startDate,
      endDate,
      vehicleId: selectedVehicle
    };

    const response = await getApi(urls.booking.report, queryParams);
    setBookings(response.data || []);
    if (response.data.length === 0) {
      toast.error(text.NO_DATA_FOUND);
    }
  };

  const fetchVehicleIncomeExpense = async () => {
    const queryParams = {
      startDate,
      endDate,
      vehicleId: selectedVehicle
    };

    const response = await getApi(urls.incomeExpense.report, queryParams);
    setIncomeExpense(response.data.incomeExpenseDetails || []);
    setSummary(response.data.summary || null);
  };

  const fetchVehicleFuel = async () => {
    const queryParams = {
      startDate,
      endDate,
      vehicleId: selectedVehicle
    };

    const response = await getApi(urls.fuel.report, queryParams);
    setFuel(response.data || []);
    if (response.data.length === 0) {
      toast.error(text.NO_DATA_FOUND);
    }
  };

  const fetchDriverBookings = async () => {
    const queryParams = {
      startDate,
      endDate,
      driverId: selectedDriver
    };

    const response = await getApi(urls.booking.driverReport, queryParams);
    setDriverReport(response.data || []);
    if (response.data.length === 0) {
      toast.error(text.NO_DATA_FOUND);
    }
  };

  const handleGenerateReport = async () => {
    const tabFunctions = [fetchVehicleBookings, fetchVehicleIncomeExpense, fetchVehicleFuel, fetchDriverBookings];

    await tabFunctions[tabIndex]();

    setStartDate('');
    setEndDate('');
    setSelectedVehicle('');
    setSelectedDriver('');
  };

  useEffect(() => {
    setStartDate('');
    setEndDate('');
    setSelectedVehicle('');
    setSelectedDriver('');
  }, [tabIndex]);

  return (
    <Box>
      <CustomBreadcrumbs title={text.REPORTS} links={[{ name: text.REPORTS, path: '/reports' }]} />

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
          label={text.BOOKINGS}
          sx={{
            backgroundColor: tabIndex === 0 ? '#1482d7' : 'transparent',
            color: tabIndex === 0 ? '#fff !important' : '#000',
            borderRadius: '8px',
            fontWeight: tabIndex === 0 ? 'bold' : 'normal'
          }}
        />

        <Tab
          label={text.incomeExpense}
          sx={{
            backgroundColor: tabIndex === 1 ? '#1482d7' : 'transparent',
            color: tabIndex === 1 ? '#fff !important' : '#000',
            borderRadius: '8px',
            fontWeight: tabIndex === 1 ? 'bold' : 'normal'
          }}
        />

        <Tab
          label={text.FUEL}
          sx={{
            backgroundColor: tabIndex === 2 ? '#1482d7' : 'transparent',
            color: tabIndex === 2 ? '#fff !important' : '#000',
            borderRadius: '8px',
            fontWeight: tabIndex === 2 ? 'bold' : 'normal'
          }}
        />

        <Tab
          label={text.DRIVER}
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
              <TextField
                label="Report From"
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                sx={{ flex: 1, minWidth: 150 }}
                inputProps={{
                  max: endDate
                }}
              />

              <TextField
                label="Report To"
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                sx={{ flex: 1, minWidth: 150 }}
                inputProps={{
                  min: startDate
                }}
              />

              {(tabIndex === 0 || tabIndex === 1 || tabIndex === 2) && (
                <TextField
                  size="small"
                  select
                  label="Select Vehicle"
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  sx={{ flex: 1, minWidth: 180 }}
                >
                  <MenuItem value="">{text.ALL_VEHICLE}</MenuItem>
                  {vehicles.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicleName}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              {tabIndex === 3 && (
                <TextField
                  size="small"
                  select
                  label="Select Driver"
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  sx={{ flex: 1, minWidth: 180 }}
                >
                  <MenuItem value="">{text.ALL_DRIVER}</MenuItem>
                  {drivers.map((driver) => (
                    <MenuItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
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
               {text.GENERATE_REPORT}
              </Button>
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
                    { field: 'sNo', headerName: text.S_NO, width: 70 },
                    { field: 'customer', headerName: text.CUSTOMER, width: 150 },
                    { field: 'vehicle', headerName: text.VEHICLE, width: 150 },
                    { field: 'tripType', headerName: text.TYPE, width: 150 },
                    { field: 'driver', headerName: text.DRIVER, width: 150 },
                    {
                      field: 'trip',
                      headerName: text.FROM_TO,
                      width: 200,
                      renderCell: (params) => (
                        <Box>
                          <Typography>{params.row.tripStartLoc ? params.row.tripStartLoc : 'N/A'}</Typography>
                          <Typography>to</Typography>
                          <Typography>{params.row.tripEndLoc ? params.row.tripEndLoc : 'N/A'}</Typography>
                        </Box>
                      )
                    },
                    { field: 'totalKm', headerName: text.DISTANCE, width: 100 },
                    { field: 'totalAmt', headerName: text.AMOUNT, width: 100 },
                    {
                      field: 'tripStatus',
                      headerName: text.STATUS,
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
                  disableRowSelectionOnClick
                  sx={{
                    '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
                    '.MuiDataGrid-cell': { fontSize: '16px' }
                  }}
                  getRowHeight={() => 75}
                  initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                  pageSizeOptions={[10]}
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
                        <Typography variant="h5">{text.TOTAL_INCOME}</Typography>
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
                        <Typography variant="h5">{text.TOTAL_EXPENSE}</Typography>
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
                      { field: 'sNo', headerName: text.S_NO, width: 70 },
                      { field: 'vehicle', headerName: text.VEHICLE, width: 200 },
                      {
                        field: 'date',
                        headerName: text.DATE,
                        width: 150,
                        renderCell: (params) => {
                          return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
                        }
                      },
                      { field: 'description', headerName: text.DESCRIPTION, width: 200 },
                      { field: 'amount', headerName: text.AMOUNT, width: 150 },
                      {
                        field: 'type',
                        headerName: text.TYPE,
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
                    disableRowSelectionOnClick
                    sx={{
                      '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
                      '.MuiDataGrid-cell': { fontSize: '16px' }
                    }}
                    getRowHeight={() => 75}
                    initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                    pageSizeOptions={[10]}
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
                    { field: 'sNo', headerName: text_S_No, width: 70 },
                    {
                      field: 'fillDate',
                      headerName: text.FILL_DATE,
                      width: 150,
                      renderCell: (params) => {
                        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
                      }
                    },
                    { field: 'vehicle', headerName: text.VEHICLE, width: 150 },
                    { field: 'quantity', headerName: text.QUANTITY, width: 100 },
                    { field: 'amount', headerName: text.TOTAL_AMOUNT, width: 150 },
                    { field: 'driver', headerName: text.FUEL_FILL_BY, width: 150 },
                    { field: 'odometerReading', headerName: text.ODOMETER_READING, width: 150 },
                    { field: 'comments', headerName: text.COMMENTS, width: 150 }
                  ]}
                  disableRowSelectionOnClick
                  sx={{
                    '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
                    '.MuiDataGrid-cell': { fontSize: '16px' }
                  }}
                  getRowHeight={() => 75}
                  initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                  pageSizeOptions={[10]}
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
                    { field: 'sNo', headerName: text.S_NO, width: 70 },
                    {
                      field: 'tripStartDate',
                      headerName: text.BOOKING_DATE,
                      width: 150,
                      renderCell: (params) => {
                        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
                      }
                    },
                    { field: 'tripStartLoc', headerName: text.FROM, width: 150 },
                    { field: 'tripEndLoc', headerName: text.TO, width: 150 },
                    { field: 'totalKm', headerName: text.DISTANCE, width: 150 },
                    { field: 'vehicle', headerName: text.VEHICLE, width: 150 },
                    { field: 'driver', headerName: text.DRIVER, width: 150 },
                    {
                      field: 'createdAt',
                      headerName: text.CREATED_AT,
                      width: 150,
                      renderCell: (params) => {
                        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
                      }
                    }
                  ]}
                  disableRowSelectionOnClick
                  sx={{
                    '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
                    '.MuiDataGrid-cell': { fontSize: '16px' }
                  }}
                  getRowHeight={() => 75}
                  initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                  pageSizeOptions={[10]}
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
