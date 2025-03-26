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

const NewComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getApi(urls.vehicleGroup.get);
      const modifiedRows = response.data.map((item, index) => ({
        ...item,
        sno: index + 1
      }));
      setRows(modifiedRows);
    } catch (error) {
      toast.error(text.ERROR_FETCHING);
    } finally {
      setLoading(false);
    }
  };

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
    toast.success(text.GROUP_DELETED);
    fetchData();
  };

  const columns = [
    { field: 'sno', headerName: text.S_NO, width: 80 },
    { field: 'name', headerName: text.NAME, width: 180 },
    { field: 'description', headerName: text.DESCRIPTION, width: 350 },
    {
      field: 'createdAt',
      headerName: text.CREATED_AT,
      width: 150,
      renderCell: (params) => {
        return params.value ? new Date(params.value).toISOString().split('T')[0] : 'N/A';
      }
    },
    {
      field: 'actions',
      headerName: text.ACTION,
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ color: '#17a2b8' }} onClick={() => handleOpenModal(params.row)}>
            <BorderColorIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5 }} />
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <>
      <CustomBreadcrumbs title={text.VEHICLE_GROUP} links={[{ name: text.VEHICLE_GROUP, path: '/vehiclegroup' }]} />

      <Card>
        <Box sx={{ height: 'auto', width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            loading={loading}
            sx={{
              '.MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '16px' },
              '.MuiDataGrid-cell': { fontSize: '16px' }
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10
                }
              }
            }}
            pageSizeOptions={[10]}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
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
