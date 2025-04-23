import React, { useState, useEffect } from 'react';
import { Card, Box, Grid, Typography, IconButton, Divider, Modal, Fade, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import ToggleSwitch from 'common/toggleSwitch';
import { text } from 'common/constant.jsx';
import { useTranslation } from 'react-i18next';
import { urls } from 'common/urls';
import CustomToolbar from 'common/customToolbar';
import { useNavigate } from 'react-router-dom';
import AddUserForm from './addUser';
import toast from 'react-hot-toast';
import { getApi, updateApi } from 'common/apiClient';

const UserIndex = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getApi(`${urls.users.get}?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`);
      const userList = response?.data?.userDetails || [];
      const pagination = response?.data?.pagination || { total: 0 };

      const modifiedRows = userList.map((item, index) => ({
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
    { field: 'name', headerName: t('text.NAME'), width: 180 },
    { field: 'phone', headerName: t('text.MOBILE'), width: 150 },
    { field: 'email', headerName: t('text.EMAIL'), width: 250 },
    {
      field: 'isActive',
      headerName: t('text.STATUS'),
      width: 150,
      renderCell: (params) => {
        const Status = String(params.row.isActive).toLowerCase() === 'true';

        return (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: '15px' }}>
            <Typography sx={{ fontWeight: 600, color: Status ? 'green' : 'gray' }}>{t('text.ACTIVE')}</Typography>

            <ToggleSwitch
              checked={Status}
              onChange={() => handleStatusToggle(params.row.id, params.row.isActive, params.api)}
              color="success"
            />

            <Typography sx={{ fontWeight: 600, color: !Status ? 'red' : 'gray' }}>{t('text.INACTIVE')}</Typography>
          </Stack>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="primary" sx={{ py: 2 }} 
           onClick={() =>
            navigate(`/view-user/${params.row.id}`, {
              state: {
                id: params.row.id,
                name: params.row.name,
                email: params.row.email,
                address: params.row.address,
                phone: params.row.phone
              }
            })
          }
          >
            <VisibilityIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
          <IconButton sx={{ color: '#17a2b8', py: 2 }} onClick={() => handleOpen(params.row)}>
            <BorderColorIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ height: 20, mx: 0.5, alignSelf: 'center' }} />
          <IconButton color="error" sx={{ py: 2 }} onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  const handleStatusToggle = async (id, currentStatus, api) => {
    try {
      const updatedStatus = !currentStatus;
      const updateUrl = urls.users.updateStatus.replace(':id', id);

      await updateApi(updateUrl, { isActive: updatedStatus });

      api.updateRows([{ id, isActive: updatedStatus }]);

      toast.success(`Status updated to ${updatedStatus ? 'Active' : 'Inactive'}!`);
    } catch (error) {
      toast.error(t('text.ERROR_UPDATING'));
    }
  };

  const handleOpen = (user = null) => {
    setSelectedUser(user);
    console.log(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const refreshData = () => {
    fetchData();
  };


  return (
    <>
      <CustomBreadcrumbs title={t('text.USER_LIST')} links={[{ name: t('text.USER_LIST'), path: '/users' }]} />

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
        <Fade in={open}>
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
              {selectedUser ? t('text.EDIT_USER') : t('text.ADD_USER')}
            </Typography>
            <AddUserForm open={open} onCancel={handleClose} onSave={handleClose} userData={selectedUser} refreshData={refreshData} />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default UserIndex;
