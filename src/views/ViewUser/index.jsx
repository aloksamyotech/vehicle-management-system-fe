import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  FormLabel,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  Box,
  Typography
} from '@mui/material';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FEATURE, PERMISSION, FEATURE_PERMISSIONS } from 'common/authHelper.jsx';
import { getApi, postApi } from 'common/apiClient';
import { urls } from 'common/urls';
import toast from 'react-hot-toast';

const featureList = Object.entries(FEATURE);
const permissionLabels = Object.entries(PERMISSION);

const defaultValues = {
  permissions: Object.fromEntries(
    Object.entries(FEATURE_PERMISSIONS).map(([featureId, permIds]) => [featureId, Object.fromEntries(permIds.map((pid) => [pid, false]))])
  )
};

const AddUserFullPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm({ defaultValues });
  const location = useLocation();

  const userData = location.state || {};
  const paramId = useParams()?.id;

  const userId = Number(userData?.id) || Number(paramId);
  const [userPermissions, setUserPermissions] = useState([]);

  const fetchData = async () => {
      const response = await getApi(urls.userManagement.get.replace(':userId', userId));
      if (response?.data) {
        setUserPermissions(response.data.data || []);
      }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId, t]);

  useEffect(() => {
    if (userPermissions && userPermissions.length > 0) {
      userPermissions.forEach(({ featureId, permissionId }) => {
        setValue(`permissions.${featureId}.${permissionId}`, true);
      });
    }
  }, [userPermissions, setValue]);

  const onSubmit = async (data) => {
    const { permissions } = data;
    const permissionPayload = [];

    Object.entries(permissions).forEach(([featureId, permObj]) => {
      Object.entries(permObj).forEach(([permissionId, isChecked]) => {
        if (isChecked) {
          permissionPayload.push({
            userId: parseInt(userId),
            featureId: parseInt(featureId),
            permissionId: parseInt(permissionId)
          });
        }
      });
    });

    const payload = {
      userId: parseInt(userId),
      permissions: permissionPayload
    };

      const response = await postApi(urls.userManagement.create, payload);
      toast.success(t('text.PERMISSION_ADDED'));
      fetchData();
  };

  return (
    <>
      <CustomBreadcrumbs
        title={t('text.VIEW_USER')}
        links={[
          { name: t('text.USER'), path: '/users' },
          { name: t('text.VIEW_USER'), path: '' }
        ]}
      />
      <Card sx={{ p: 1, mt: 3 }}>
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.NAME')}</FormLabel>
              <TextField fullWidth size="small" value={userData?.name || ''} />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.EMAIL')}</FormLabel>
              <TextField fullWidth size="small" value={userData?.email || ''} />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.PHONE')}</FormLabel>
              <TextField fullWidth size="small" value={userData?.phone || ''} />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.ADDRESS')}</FormLabel>
              <TextField fullWidth size="small" value={userData?.address || ''} />
            </Grid>
          </Grid>

          <Typography variant="h5" gutterBottom>
            {t('text.USER_PERMISSION')}
          </Typography>

          <Grid container spacing={2}>
            {featureList.map(([featureCode, featureId]) => {
              const allowedPermIds = FEATURE_PERMISSIONS[featureId] || [];

              return (
                <Grid
                  item
                  xs={12}
                  key={featureCode}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid #eee',
                    pb: 1
                  }}
                >
                  <Box sx={{ width: 180, fontWeight: 'bold' }}>{featureCode}</Box>

                  {permissionLabels
                    .filter(([, permId]) => allowedPermIds.includes(permId))
                    .map(([permName, permId]) => (
                      <FormControlLabel
                        key={`${featureId}-${permId}`}
                        control={
                          <Controller
                            name={`permissions.${featureId}.${permId}`}
                            control={control}
                            render={({ field }) => <Checkbox checked={field.value} onChange={field.onChange} />}
                          />
                        }
                        label={permName}
                        sx={{ mr: 2 }}
                      />
                    ))}
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            <Button type="submit" variant="contained" onClick={handleSubmit(onSubmit)}>
              {t('text.SAVE_PERMISSIONS')}
            </Button>
            <Button variant="outlined">{t('text.CANCEL')}</Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default AddUserFullPage;
