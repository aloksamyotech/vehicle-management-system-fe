import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent, TextField, MenuItem, Button } from '@mui/material';
import { urls } from 'common/urls';
import { getApi } from 'common/apiClient';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { DataGrid } from '@mui/x-data-grid';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await getApi(urls.vehicle.get);
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await getApi(urls.driver.get);
        setDrivers(response.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    fetchVehicles();
    fetchDrivers();
  }, []);

  const fetchVehicleBookings = async () => {
    setLoading(true);

    const queryParams = {
      startDate,
      endDate,
      vehicleId: selectedVehicle
    };

    try {
      const response = await getApi(urls.booking.report, queryParams);
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleIncomeExpense = async () => {
    setLoading(true);

    const queryParams = {
      startDate,
      endDate,
      vehicleId: selectedVehicle
    };

    try {
      const response = await getApi(urls.incomeExpense.report, queryParams);
      setIncomeExpense(response.data || []);
    } catch (error) {
      console.error('Error fetching income & expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    const tabFunctions = [fetchVehicleBookings, fetchVehicleIncomeExpense];
    tabFunctions[tabIndex]();
  };

  return (
    <Box>
      <CustomBreadcrumbs title="Report" links={[{ name: 'Reports', path: '/reports' }]} />
      <Tabs value={tabIndex} onChange={(event, newIndex) => setTabIndex(newIndex)} variant="fullWidth">
        <Tab label="Bookings" />
        <Tab label="Income & Expense" />
        <Tab label="Fuel" />
        <Tab label="Driver" />
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
              />
              <TextField
                label="Report To"
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                sx={{ flex: 1, minWidth: 150 }}
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
                  <MenuItem value="">All Vehicles</MenuItem>
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
                  <MenuItem value="">All Drivers</MenuItem>
                  {drivers.map((driver) => (
                    <MenuItem key={driver.id} value={driver.name}>
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
                Generate Report
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
                    { field: 'sNo', headerName: 'S.No', width: 70 },
                    { field: 'customer', headerName: 'Customer', width: 150 },
                    { field: 'vehicle', headerName: 'Vehicle', width: 150 },
                    { field: 'tripType', headerName: 'Type', width: 150 },
                    { field: 'driver', headerName: 'Driver', width: 150 },
                    {
                      field: 'trip',
                      headerName: 'From To',
                      width: 200,
                      renderCell: (params) => (
                        <Box>
                          <Typography>{params.row.tripStartLoc ? params.row.tripStartLoc : 'N/A'}</Typography>
                          <Typography>to</Typography>
                          <Typography>{params.row.tripEndLoc ? params.row.tripEndLoc : 'N/A'}</Typography>
                        </Box>
                      )
                    },
                    { field: 'totalKm', headerName: 'Distance', width: 100 },
                    { field: 'totalAmt', headerName: 'Amount', width: 100 },
                    {
                      field: 'tripStatus',
                      headerName: 'Trip Status',
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
                  loading={loading}
                  initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                  pageSizeOptions={[10]}
                />
              </Card>
            )}

            {tabIndex === 1 && incomeExpense.length > 0 && (
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
                    { field: 'sNo', headerName: 'S.No', width: 70 },
                    { field: 'vehicle', headerName: 'Vehicle', width: 150 },
                    { field: 'date', headerName: 'Date', width: 150 },
                    { field: 'description', headerName: 'Description', width: 150 },
                    { field: 'amount', headerName: 'Amount', width: 100 },
                    {
                      field: 'type',
                      headerName: 'Type',
                      width: 120,
                      renderCell: (params) => {
                        const isActive = params.row.type === 'Expense';
                        return (
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: isActive ? '#30aa4c' : '#dc3545',
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
                  loading={loading}
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
