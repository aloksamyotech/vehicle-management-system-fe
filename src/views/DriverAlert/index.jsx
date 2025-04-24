import React, { useState, useEffect } from 'react';
import { Card, Box, Grid, Typography, IconButton, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { getApi, deleteApi } from 'common/apiClient';
import { urls } from 'common/urls';
import toast from 'react-hot-toast';
import CustomToolbar from 'common/customToolbar';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant.jsx';
import { useTranslation } from 'react-i18next';

const Alert = () => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
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
      const response = await getApi(`${urls.reminder.get}?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`);
      const reminderList = response?.data?.reminderDetails || [];
      const pagination = response?.data?.pagination || { total: 0 };

      const formattedData = reminderList.map((rem, index) => ({
        id: rem.id,
        reminderDate: rem.reminderDate,
        message: rem.message,
        vehicleId: rem.vehicle.id,
        group: rem.vehicle?.vehicleName || 'N/A'
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
    { field: 'group', headerName: t('text.VEHICLE'), width: 250 },
    {
      field: 'reminderDate',
      headerName: t('text.DATE'),
      width: 150,
      renderCell: (params) => {
        const date = params.value ? new Date(params.value) : null;
        return date ? date.toLocaleDateString() : 'N/A';
      }
    },
    { field: 'message', headerName: t('text.MESSAGE'), width: 400 },
    {
      field: 'actions',
      headerName: t('text.ACTION'),
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const userRole = JSON.parse(localStorage.getItem('user'))?.role;

        if (userRole !== 'ADMIN') return null;

        return (
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        );
      }
    }
  ];

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const refreshData = () => {
    fetchData();
  };

  const handleDelete = async (id) => {
    await deleteApi(urls.reminder.delete.replace(':id', id));
    toast.success(t('text.REM_DELETED'));
    fetchData();
  };

  return (
    <>
      <CustomBreadcrumbs title={t('text.DRIVER_ALERT')} links={[{ name: t('text.DRIVER_ALERT'), path: '/driver-alert' }]} />

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
                    onAddClick: () => handleOpen(),
                    showExport: true
                  }
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
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
            {t('text.ADD_REM')}
          </Typography>
         
        </Box>
      </Modal>
    </>
  );
};

export default Alert;
