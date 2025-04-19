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
import { FEATURE, PERMISSION, FEATURE_PERMISSIONS } from 'common/permissionHelper.jsx';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';

const featureList = Object.entries(FEATURE);
const permissionLabels = Object.entries(PERMISSION);

const AddUserFullPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm();

  const fetchUsers = async () => {
    const response = await getApi(urls.users.getById.replace(':id', id));
    setUserData(response?.data);
  };

  useEffect(() => {
    if (id) {
      fetchUsers();
    }
  }, [id]);

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
            {featureList.map(([featureName, featureId]) => {
              const allowedPermIds = FEATURE_PERMISSIONS[featureId] || [];

              return (
                <Grid
                  item
                  xs={12}
                  key={featureName}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid #eee',
                    pb: 1
                  }}
                >
                  <Box sx={{ width: 180, fontWeight: 'bold' }}>{featureName}</Box>

                  {permissionLabels
                    .filter(([, permId]) => allowedPermIds.includes(permId))
                    .map(([permName, permId]) => (
                      <FormControlLabel
                        key={`${featureId}-${permId}`}
                        control={
                          <Controller
                            name={`permissions.${featureId}.${permId}`}
                            control={control}
                            defaultValue={false}
                            render={({ field }) => <Checkbox {...field} />}
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
            <Button type="submit" variant="contained">
             {t('text.SAVE_PERMISSIONS')}
            </Button>
            <Button variant="outlined"> {t('text.CANCEL')}</Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default AddUserFullPage;
