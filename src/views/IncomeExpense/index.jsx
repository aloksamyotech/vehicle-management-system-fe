import React, { useState, useEffect } from 'react';
import { Card, Button, Box, Grid, Typography, IconButton, Divider, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import IncomeExpenseForm from './addFinance.jsx';
import { getApi, deleteApi } from 'common/apiClient';
import { urls } from 'common/urls';
import toast from 'react-hot-toast';
import CustomToolbar from 'common/customToolbar';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant.jsx';
import { useTranslation } from 'react-i18next';
import { fetchCurrencySymbol } from 'common/function.jsx';

const FinanceIndex = () => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getApi(`${urls.incomeExpense.get}?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`);
      const incomeList = response?.data?.incomeDetails || [];
      const pagination = response?.data?.pagination || { total: 0 };

      const formattedData = incomeList.map((finance, index) => ({
        id: finance.id,
        type: finance.type,
        date: finance.date,
        description: finance.description,
        amount: finance.amount,
        vehicleId: finance.vehicle.id,
        vehicle: finance.vehicle?.vehicleName || 'N/A'
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

  const columns = [
    { field: 'sNo', headerName: t('text.S_NO'), width: 80 },
    { field: 'vehicle', headerName: t('text.VEHICLE'), width: 150 },
    {
      field: 'date',
      headerName: t('text.DATE'),
      width: 150,
      renderCell: (params) => {
        const date = params.value ? new Date(params.value) : null;
        return date ? date.toLocaleDateString() : 'N/A';
      }
    },
    { field: 'description', headerName: t('text.DESCRIPTION'), width: 300 },
    {
      field: 'amount',
      headerName: t('text.AMOUNT'),
      width: 120,
      renderCell: (params) => `${currencySymbol} ${params.value}`
    },
    {
      field: 'type',
      headerName: t('text.TYPE'),
      width: 120,
      renderCell: (params) => {
        const isActive = params.row.type === 'Expense';
        return (
          <Button
            variant="contained"
            style={{
              backgroundColor: isActive ? '#dc3545' : '#30aa4c',
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
      field: 'actions',
      headerName: t('text.ACTION'),
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ color: '#17a2b8' }} onClick={() => handleOpen(params.row)}>
            <BorderColorIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  const handleOpen = (finance = null) => {
    if (finance) {
      setEditData({
        ...finance,
        vehicle: rows.find((row) => row.vehicleId === finance.vehicleId)?.vehicle || ''
      });
    } else {
      setEditData(null);
    }
    setModalOpen(true);
  };

  const handleClose = () => {
    setEditData(null);
    setModalOpen(false);
  };

  const refreshData = () => {
    fetchData();
  };

  const handleDelete = async (id) => {
    await deleteApi(urls.incomeExpense.delete.replace(':id', id));
    toast.success(t('text.INC_EXP_DELETED'));
    fetchData();
  };

  return (
    <>
      <CustomBreadcrumbs title={t('text.INCOME_EXPENSE')} links={[{ name: t('text.INCOME_EXPENSE'), path: '/finance' }]} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={
                  loading ? [] : rows.map((row, index) => ({ ...row, sNo: paginationModel.page * paginationModel.pageSize + index + 1 }))
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
                    onAddClick: () => handleOpen(true),
                    showExport: true
                  }
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Modal open={modalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            {editData?.id ? t('text.EDIT') : t('text.ADD')} {t('text.INCOME_EXPENSE')}
          </Typography>
          <IncomeExpenseForm initialData={editData} onSave={handleClose} onCancel={handleClose} refreshData={refreshData} />
        </Box>
      </Modal>
    </>
  );
};

export default FinanceIndex;
