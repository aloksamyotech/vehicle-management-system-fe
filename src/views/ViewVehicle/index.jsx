import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Tabs,
  Tab,
  Divider,
  Box,
  Grid,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ViewVehiclePage = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const vehicleData = [
    { label: 'Registration No', value: 'KDH 678T' },
    { label: 'Name', value: '33 SEATER MATATU ISUZU' },
    { label: 'Model', value: 'FRR36' },
    { label: 'Chassis No.', value: '234567777' },
    { label: 'Engine No.', value: '57689404' },
    { label: 'Manufactured By', value: 'GENERAL MOTORS' },
    { label: 'Type', value: 'BUS' },
    { label: 'Mileage/Litre', value: '0' },
    { label: 'API URL', value: 'https://codeforts.com/vms/api' },
    { label: 'GPS API Username', value: 'KDH 678T' },
    { label: 'GPS API Password', value: '278561' },
    { label: 'Created Date', value: '2025-03-06 06:21:22' },
    { label: 'Modified Date', value: '2025-03-06 18:23:35' },
    { label: 'Document', value: '-' }
  ];

  const bookingColumns = [
    { field: 'id', headerName: '#', width: 50 },
    { field: 'driver', headerName: 'Driver', width: 150 },
    { field: 'customer', headerName: 'Customer', width: 150 },
    { field: 'fromTo', headerName: 'From & To', width: 200 },
    { field: 'bookingValue', headerName: 'Booking Value', width: 150 },
    { field: 'tripStatus', headerName: 'Trip Status', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: () => (
        <Button variant="contained" color="primary" size="small">
          View
        </Button>
      )
    }
  ];
  const bookingRows = [];

  const geofenceColumns = [
    { field: 'id', headerName: '#', width: 50 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'description', headerName: 'Description', width: 250 },
    {
      field: 'action',
      headerName: 'Action',
      width: 100,
      renderCell: () => (
        <IconButton color="primary">
          <VisibilityIcon />
        </IconButton>
      )
    }
  ];

  const geofenceRows = [
    { id: 1, name: 'Pelotas', description: 'Rs' },
    { id: 2, name: 'sssccc', description: 'aa' },
    { id: 3, name: 'sssccc', description: 'aa' },
    { id: 4, name: 'Phoenix', description: 'Phoenix' }
  ];

  const incomeExpenseColumns = [
    { field: 'id', headerName: '#', width: 50 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 100 },
    { field: 'type', headerName: 'Type', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      width: 100,
      renderCell: () => (
        <Button variant="contained" color="primary" size="small">
          View
        </Button>
      )
    }
  ];

  const incomeExpenseRows = [];

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2
        }}
      >
        <Typography variant="h3">Vehicle Details</Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <MuiLink component={Link} to="/vehicles" color="inherit" underline="none">
            <Typography color="#17a2b8">Vehicles</Typography>
          </MuiLink>
          <Typography color="text.primary">Vehicle Details</Typography>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Card
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              borderTop: '3px solid #007bff'
            }}
          >
            <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}> 33 SEATER MATATU ISUZU</Typography>
            <Typography>BUS</Typography>
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: '#28a745',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '10px',
                padding: '2px 8px',
                minWidth: 'auto',
                mt: 1,
                '&:hover': { backgroundColor: '#28a745' }
              }}
            >
              Active
            </Button>

            <Divider sx={{ my: 2, width: '100%' }} />

            <Box sx={{ width: '100%' }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography sx={{ fontWeight: 'bold', textAlign: 'left' }}>Bookings:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign: 'right' }}>0</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={{ fontWeight: 'bold', textAlign: 'left' }}>Geofence:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign: 'right' }}>4</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={{ fontWeight: 'bold', textAlign: 'left' }}>Notifications:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign: 'right' }}>0</Typography>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={9}>
          <Card sx={{ p: 2 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
              <Tab label="Basic Info" />
              <Tab label="Bookings" />
              <Tab label="Geofence" />
              <Tab label="Income & Expense" />
            </Tabs>

            <Divider sx={{ my: 2 }} />

            {tabIndex === 0 && (
              <>
                <TableContainer sx={{ border: '1px solid #ccc', borderRadius: '3px' }}>
                  <Table>
                    <TableBody>
                      {vehicleData.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            borderBottom: '1px solid #ccc',
                            height: '30px'
                          }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: 'bold',
                              width: '50%',
                              borderRight: '1px solid #ccc',
                              padding: '4px 8px'
                            }}
                          >
                            {row.label}
                          </TableCell>
                          <TableCell sx={{ borderLeft: '1px solid #ccc', padding: '4px 8px' }}>{row.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
                  <Button variant="contained" sx={{ background: '#28a745' }}>
                    Edit Info
                  </Button>
                </Box>
              </>
            )}

            {tabIndex === 1 && (
              <>
                <Box sx={{ height: 400, width: '100%' }}>
                  <DataGrid
                    columns={bookingColumns}
                    rows={bookingRows}
                    pageSize={5}
                    autoHeight
                    disableSelectionOnClick
                    localeText={{ noRowsLabel: 'No data available in table' }}
                    sx={{
                      '.MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }
                    }}
                  />
                </Box>
              </>
            )}

            {tabIndex === 2 && (
              <>
                <Box sx={{ height: 400, width: '100%' }}>
                  <DataGrid
                    columns={geofenceColumns}
                    rows={geofenceRows}
                    pageSize={5}
                    autoHeight
                    disableSelectionOnClick
                    localeText={{ noRowsLabel: 'No data available in table' }}
                    sx={{
                      '.MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }
                    }}
                  />
                </Box>
              </>
            )}

            {tabIndex === 3 && (
              <>
                <Box sx={{ height: 400, width: '100%' }}>
                  <DataGrid
                    columns={incomeExpenseColumns}
                    rows={incomeExpenseRows}
                    pageSize={5}
                    autoHeight
                    disableSelectionOnClick
                    localeText={{ noRowsLabel: 'No data available in table' }}
                    sx={{
                      '.MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }
                    }}
                  />
                </Box>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewVehiclePage;
