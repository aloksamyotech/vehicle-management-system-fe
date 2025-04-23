import React, { useState, useEffect } from 'react';
import { Card, Button, Box, Grid, Typography, Divider, IconButton, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPartForm from './addParts';
import { getApi, deleteApi } from 'common/apiClient';
import { urls } from 'common/urls';
import toast from 'react-hot-toast';
import CustomToolbar from 'common/customToolbar';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant';
import { useTranslation } from 'react-i18next';

const PartsInventory = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getApi(`${urls.partsInventory.get}?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`);
      const partsList = response?.data?.partsDetails || [];
      const pagination = response?.data?.pagination || { total: 0 };

      const modifiedRows = partsList.map((item, index) => ({
        ...item,
        sno: paginationModel.page * paginationModel.pageSize + index + 1
      }));
      setRows(modifiedRows);
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
    { field: 'sno', headerName: t('text.S_NO'), width: 80 },
    { field: 'name', headerName: t('text.NAME'), width: 200 },
    { field: 'description', headerName: t('text.DESCRIPTION'), width: 350 },
    { field: 'stock', headerName: t('text.STOCK'), width: 120 },
    {
      field: 'status',
      headerName: t('text.STATUS'),
      width: 100,
      renderCell: (params) => {
        const isActive = params.row.status === 'Active';
        return (
          <Button
            variant="contained"
            style={{
              backgroundColor: isActive ? '#30aa4c' : '#dc3545',
              color: 'white',
              fontWeight: 700,
              fontSize: '10px',
              padding: 0
            }}
          >
            {params.row.status}
          </Button>
        );
      }
    },
    {
      field: 'actions',
      headerName: t('text.ACTION'),
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const userRole = JSON.parse(localStorage.getItem('user'))?.role;

        if (userRole !== 'ADMIN') return null;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton sx={{ color: '#17a2b8', py: 2 }} onClick={() => handleOpen(params.row)}>
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

  const handleOpen = (parts = null) => {
    setEditData(parts);
    setOpen(true);
  };

  const handleClose = () => {
    setEditData(null);
    setOpen(false);
  };

  const refreshData = () => {
    fetchData();
  };

  const handleDelete = async (id) => {
    await deleteApi(urls.partsInventory.delete.replace(':id', id));
    toast.success(t('text.PARTS_DELETED'));
    fetchData();
  };

  return (
    <>
      <CustomBreadcrumbs title={t('text.PARTS_INVENTORY')} links={[{ name: t('text.PARTS_INVENTORY'), path: '/partsinventory' }]} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                rowCount={totalRows}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                paginationMode="server"
                loading={loading}
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
      <Modal open={open} onClose={handleClose}>
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
            {editData?.id ? t('text.EDIT') : t('text.ADD')} {t('text.PART')}
          </Typography>
          <AddPartForm initialData={editData} onSave={handleClose} onCancel={handleClose} refreshData={refreshData} />
        </Box>
      </Modal>
    </>
  );
};

export default PartsInventory;
