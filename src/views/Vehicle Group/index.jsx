import React, { useState, useEffect } from 'react';
import { Box, Card, IconButton, Divider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { BorderColor as BorderColorIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AddVehicleGroupModal from './addVehicleGroup';
import { getApi, deleteApi } from 'common/apiClient';
import { urls } from 'common/urls';
import toast from 'react-hot-toast';
import CustomToolbar from 'common/customToolbar';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant';
import { useTranslation } from 'react-i18next';

const NewComponent = () => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
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
      const response = await getApi(`${urls.vehicleGroup.get}?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`);
      const groupList = response?.data?.groupDetails || [];
      const pagination = response?.data?.pagination || { total: 0 };

      const modifiedRows = groupList.map((item, index) => ({
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

  const handleOpenModal = (item = null) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setEditItem(null);
    setOpenModal(false);
  };

  const refreshData = () => {
    fetchData();
  };

  const handleDelete = async (id) => {
    await deleteApi(urls.vehicleGroup.delete.replace(':id', id));
    toast.success(t('text.GROUP_DELETED'));
    fetchData();
  };

  const columns = [
    { field: 'sno', headerName: t('text.S_NO'), width: 80 },
    { field: 'name', headerName: t('text.NAME'), width: 180 },
    { field: 'description', headerName: t('text.DESCRIPTION'), width: 350 },
    {
      field: 'createdAt',
      headerName: t('text.CREATED_AT'),
      width: 150,
      renderCell: (params) => (params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A')
    },
    {
      field: 'actions',
      headerName: t('text.ACTION'),
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const userRole = JSON.parse(localStorage.getItem('user'))?.role;
    
        if (userRole !== 'ADMIN') return null;
        return(
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ color: '#17a2b8' }} onClick={() => handleOpenModal(params.row)}>
            <BorderColorIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5 }} />
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      );
    }
    }
  ];

  return (
    <>
      <CustomBreadcrumbs title={t('text.VEHICLE_GROUP')} links={[{ name: t('text.VEHICLE_GROUP'), path: '/vehiclegroup' }]} />

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
                onAddClick: () => handleOpenModal(),
                showExport: true
              }
            }}
          />
        </Box>
      </Card>

      <AddVehicleGroupModal open={openModal} handleClose={handleCloseModal} refreshData={refreshData} editItem={editItem} />
    </>
  );
};

export default NewComponent;
