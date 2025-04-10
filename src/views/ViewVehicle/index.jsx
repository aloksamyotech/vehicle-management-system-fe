import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Tabs,
  Tab,
  Divider,
  Box,
  Grid,
  Typography,
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
import { text } from 'common/constant';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { useTranslation } from 'react-i18next';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const ViewVehiclePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
 const { t } = useTranslation();
  const fetchVehicles = async () => {
    const response = await getApi(urls.vehicle.getById.replace(':id', id));
    setVehicles(response?.data);
  };

  useEffect(() => {
    if (id) {
      fetchVehicles();
    }
  }, [id]);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const vehicleData = [
    { label: t('text.RES_NO'), value: vehicles.registrationNo },
    { label: t('text.NAME'), value: vehicles.vehicleName },
    { label: t('text.MODEL'), value: vehicles.model },
    { label: t('text.CHASIS_NO'), value: vehicles.chasisNo },
    { label: t('text.ENGINE_NO'), value: vehicles.engineNo },
    { label: t('text.MANUFACTURED_BY'), value: vehicles.manufacturedBy },
    { label: t('text.GPS_API'), value: 'https://codeforts.com/vms/api' },
    { label: t('text.API_USERNAME'), value: 'KDH 678T' },
    { label: t('text.API_PASS'), value: '278561' },
    { label: t('text.CREATED_DATE'), value: vehicles.createdAt },
    { label: t('text.MODIFIED_DATE'), value: vehicles.updatedAt },
    {
      label: t('text.DOCUMENT'),
      value: vehicles.docUrl ? (
        <a href={vehicles.docUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <PictureAsPdfIcon color="error" />
          <span>{t('text.VIEW')}</span>
        </a>
      ) : (
        t('text.NO_DOCUMENT')
      ),
    }
  ];

  const bookingColumns = [
    { field: 'sNo', headerName: '#', width: 50 },
    { field: 'driver', headerName: t('text.DRIVER'), width: 120 },
    { field: 'customer', headerName: t('text.CUSTOMER'), width: 120 },
    {
      field: 'fromTo',
      headerName: t('text.FROM_TO'),
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row?.tripStartLoc}</Typography>

          <Typography>{t('text.TO')}</Typography>

          <Typography>{params.row?.tripEndLoc}</Typography>
        </Box>
      )
    },
    { field: 'totalAmt', headerName: t('text.AMOUNT'), width: 150 },
    {
      field: 'tripStatus',
      headerName: t('text.STATUS'),
      width: 100,
      renderCell: (params) => {
        const status = params.row?.tripStatus;
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
      field: 'action',
      headerName: t('text.ACTION'),
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <IconButton color="primary" onClick={() => navigate(`/view-booking/${params.row.id}`)}>
              <VisibilityIcon />
            </IconButton>
          </>
        );
      }
    }
  ];

  const bookingRows =
    vehicles?.bookings?.map((booking, index) => ({
      sNo: index + 1,
      id: booking?.id,
      driver: booking?.driver?.name || 'N/A',
      customer: booking?.customer?.name || 'N/A',
      tripStartLoc: booking?.tripStartLoc || 'N/A',
      tripEndLoc: booking?.tripEndLoc || 'N/A',
      totalAmt: booking?.totalAmt || 'N/A',
      tripStatus: booking?.tripStatus || 'N/A'
    })) || [];

  const geofenceColumns = [
    { field: 'id', headerName: '#', width: 50 },
    { field: 'name', headerName: t('text.NAME'), width: 150 },
    { field: 'description', headerName:t('text.DESCRIPTION'), width: 250 },
    {
      field: 'action',
      headerName: t('text.ACTION'),
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
    {
      field: 'date',
      headerName: t('text.DATE'),
      width: 150,
      renderCell: (params) => {
        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
      }
    },
    { field: 'description', headerName: t('text.DESCRIPTION'), width: 200 },
    { field: 'amount', headerName: t('text.AMOUNT'), width: 100 },
    {
      field: 'type',
      headerName: t('text.TYPE'),
      width: 120,
      renderCell: (params) => {
        const isActive = params.row?.type === 'Expense';
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
    },
    {
      field: 'action',
      headerName: t('text.ACTION'),
      width: 100,
      renderCell: () => (
        <IconButton color="primary" sx={{ py: 2 }} onClick={() => navigate('/finance')}>
          <VisibilityIcon />
        </IconButton>
      )
    }
  ];

  const incomeExpenseRows =
    vehicles?.incomeExpense?.map((income, index) => ({
      id: index + 1,
      date: income?.date || 'N/A',
      description: income?.description || 'N/A',
      amount: income?.amount || 'N/A',
      type: income?.type || 'N/A'
    })) || [];

  return (
    <Box>
      <CustomBreadcrumbs
        title={t('text.VEHICLE_DETAILS')}
        links={[
          { name:t('text.VEHICLE'), path: '/vehicles' },
          { name: t('text.VEHICLE_DETAILS'), path: '' }
        ]}
      />

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
            <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>{vehicles?.vehicleName || 'N/A'}</Typography>
            <Typography>{vehicles?.vehicleType?.toUpperCase()}</Typography>
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: vehicles.isActive ? '#28a745' : '#dc3545',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '10px',
                padding: '2px 8px',
                minWidth: 'auto',
                mt: 1,
                '&:hover': { backgroundColor: vehicles.isActive ? '#28a745' : '#dc3545' }
              }}
            >
              {vehicles.isActive ? 'Active' : 'Inactive'}
            </Button>

            <Divider sx={{ my: 2, width: '100%' }} />

            <Box sx={{ width: '100%' }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography sx={{ fontWeight: 'bold', textAlign: 'left' }}>{t('text.BOOKINGS')}:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign: 'right' }}>0</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={{ fontWeight: 'bold', textAlign: 'left' }}>{t('text.GEOFENCE')}:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign: 'right' }}>4</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={{ fontWeight: 'bold', textAlign: 'left' }}>{t('text.NOTIFICATIONS')}:</Typography>
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
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              sx={{
                backgroundColor: '#ffff',
                borderRadius: '8px',
                '& .MuiTabs-indicator': {
                  backgroundColor: 'transparent'
                }
              }}
            >
              <Tab
                label={t('text.BASIC_INFO')}
                sx={{
                  backgroundColor: tabIndex === 0 ? '#1482d7' : 'transparent',
                  color: tabIndex === 0 ? '#fff !important' : '#000',
                  borderRadius: '8px',
                  fontWeight: tabIndex === 0 ? 'bold' : 'normal'
                }}
              />
              <Tab
                label={t('text.BOOKINGS')}
                sx={{
                  backgroundColor: tabIndex === 1 ? '#1482d7' : 'transparent',
                  color: tabIndex === 1 ? '#fff !important' : '#000',
                  borderRadius: '8px',
                  fontWeight: tabIndex === 1 ? 'bold' : 'normal'
                }}
              />

              <Tab
                label={t('text.GEOFENCE')}
                sx={{
                  backgroundColor: tabIndex === 2 ? '#1482d7' : 'transparent',
                  color: tabIndex === 2 ? '#fff !important' : '#000',
                  borderRadius: '8px',
                  fontWeight: tabIndex === 2 ? 'bold' : 'normal'
                }}
              />

              <Tab
                label={t('text.INCOME_EXPENSE')}
                sx={{
                  backgroundColor: tabIndex === 3 ? '#1482d7' : 'transparent',
                  color: tabIndex === 3 ? '#fff !important' : '#000',
                  borderRadius: '8px',
                  fontWeight: tabIndex === 3 ? 'bold' : 'normal'
                }}
              />
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
              </>
            )}

            {tabIndex === 1 && (
              <>
                {bookingRows.length > 0 ? (
                  <Box sx={{ height: 'auto', width: '100%' }}>
                    <DataGrid
                      columns={bookingColumns}
                      rows={bookingRows || []}
                      getRowHeight={() => 75}
                      initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 5
                          }
                        }
                      }}
                      pageSizeOptions={[5]}
                      disableSelectionOnClick
                      sx={{
                        '.MuiDataGrid-columnHeaderTitle': {
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }
                      }}
                    />
                  </Box>
                ) : (
                  <Typography>{t('text.NO_DATE_AVAILABLE')}</Typography>
                )}
              </>
            )}

            {tabIndex === 2 && (
              <>
                <Box sx={{ height: 'auto', width: '100%' }}>
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
                {incomeExpenseRows.length > 0 ? (
                  <Box sx={{ height: 'auto', width: '100%' }}>
                    <DataGrid
                      columns={incomeExpenseColumns}
                      rows={incomeExpenseRows}
                      disableSelectionOnClick
                      sx={{
                        '.MuiDataGrid-columnHeaderTitle': {
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }
                      }}
                      getRowHeight={() => 75}
                      initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 5
                          }
                        }
                      }}
                      pageSizeOptions={[5]}
                    />
                  </Box>
                ) : (
                  <Typography>{t('text.NO_DATE_AVAILABLE')}</Typography>
                )}
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewVehiclePage;
