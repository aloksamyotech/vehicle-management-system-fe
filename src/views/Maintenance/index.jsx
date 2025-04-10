import React, { useEffect, useState } from 'react';
import { Card, Box, Grid, IconButton, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getApi, deleteApi, updateApi } from 'common/apiClient';
import { urls } from 'common/urls';
import CustomToolbar from 'common/customToolbar';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant';
import { useTranslation } from 'react-i18next';
import { fetchCurrencySymbol } from 'common/function';

const MaintenanceIndex = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState([]);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getApi(`${urls.maintenance.get}?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`);
      const mainList = response?.data?.mainDetails || [];
      const pagination = response?.data?.pagination || { total: 0 };

      const formattedData = mainList.map((maintenance, index) => ({
        id: maintenance.id,
        vendorName: maintenance.vendorName,
        totalCost: maintenance.totalCost,
        model: maintenance.model,
        startDate: maintenance.startDate,
        endDate: maintenance.endDate,
        details: maintenance.details || '-',
        status: maintenance.status,
        vehicleId: maintenance.vehicle.id,
        group: maintenance.vehicle?.vehicleName || 'N/A'
      }));
      setShowData(formattedData);
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updateUrl = urls.maintenance.updateStatus.replace(':id', id);
      const response = await updateApi(updateUrl, { status: newStatus });
      setShowData((prevRows) => prevRows.map((row) => (row.id === id ? { ...row, status: response.data.status } : row)));
      toast.success(t('text.MAINTENANCE_UPDATED'));
      fetchData();
    } catch (error) {
      toast.error(t('text.ERROR_UPDATING'));
    }
  };

  const handleDelete = async (id) => {
    await deleteApi(urls.maintenance.delete.replace(':id', id));
    toast.success(t('text.MAINTENANCE_DELETED'));
    fetchData();
  };

  const columns = [
    { field: 'sNo', headerName: t('text.S_NO'), width: 80 },
    { field: 'group', headerName: t('text.VEHICLE'), width: 200 },
    {
      field: 'startDate',
      headerName: t('text.START_DATE'),
      width: 150,
      renderCell: (params) => {
        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
      }
    },
    {
      field: 'endDate',
      headerName: t('text.END_DATE'),
      width: 150,
      renderCell: (params) => {
        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
      }
    },
    { field: 'details', headerName: t('text.SERVICE_DETAILS'), width: 250 },
    { field: 'vendorName', headerName: t('text.VENDOR_NAME'), width: 150 },
    {
      field: 'totalCost',
      headerName: t('text.TOTAL_COST'),
      width: 120,
      renderCell: (params) => (
        `${currencySymbol} ${params.value}`
      )
    },    
    {
      field: 'status',
      headerName: t('text.STATUS'),
      width: 150,
      renderCell: (params) => (
        <Select value={params.row.status} onChange={(e) => handleStatusChange(params.row.id, e.target.value)} size="small" fullWidth>
          <MenuItem value="Pending">{t('text.PENDING')}</MenuItem>
          <MenuItem value="In Progress">{t('text.IN_PROGRESS')}</MenuItem>
          <MenuItem value="Completed">{t('text.COMPLETED')}</MenuItem>
        </Select>
      )
    },
    {
      field: 'actions',
      headerName: t('text.ACTION'),
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="error" sx={{ py: 2 }} onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <>
      <CustomBreadcrumbs title={t('text.MAINTENANCE_RECORDS')} links={[{ name: t('text.MAINTENANCE_RECORDS'), path: '/maintenance' }]} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={
                  loading
                    ? []
                    : showData.map((row, index) => ({ ...row, sNo: paginationModel.page * paginationModel.pageSize + index + 1 }))
                }
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
                slots={{ toolbar: CustomToolbar }}
                slotProps={{
                  toolbar: {
                    onAddClick: () => navigate('/add-maintenance'),
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

export default MaintenanceIndex;
