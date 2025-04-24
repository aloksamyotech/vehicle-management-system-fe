import React, {useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, TextField, FormLabel, Grid, Box, IconButton, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { postApi, updateApi } from 'common/apiClient';
import { urls } from 'common/urls';
import { text } from 'common/constant';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import toast from 'react-hot-toast';

const AddUserForm = ({ onSave, onCancel, refreshData, userData }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: userData ? userData.name : '',
      email: userData ? userData.email : '',
      phone: userData ? userData.phone : '',
      address: userData ? userData.address : '',
      password: ''
    },
    mode: 'all'
  });

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        password: ''
      });
    }
  }, [userData, reset]);

  const onSubmit = async (data) => {
    const finalData = { ...data };

    const response = userData
      ? await updateApi(urls.users.update.replace(':id', userData.id), finalData)
      : await postApi(urls.users.create, finalData);

    toast.success(t(userData ? 'text.USER_UPDATED' : 'text.USER_ADDED'));
    onSave(response?.data);
    refreshData();
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.NAME')}</FormLabel>
          <Controller
            name="name"
            control={control}
            rules={{
              required: t('text.REQUIRED'),
              maxLength: { value: 30, message: t('text.MAX_30_CHAR') },
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: t('text.ALPHABETS_ONLY')
              }
            }}
            render={({ field }) => <TextField fullWidth size="small" {...field} error={!!errors.name} helperText={errors.name?.message} />}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.EMAIL')}</FormLabel>
          <Controller
            name="email"
            control={control}
            rules={{
              required: t('text.REQUIRED'),
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: t('text.INVALID_FORMAT')
              }
            }}
            render={({ field }) => (
              <TextField fullWidth size="small" {...field} error={!!errors.email} helperText={errors.email?.message} />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.PHONE')}</FormLabel>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: t('text.REQUIRED'),
              pattern: {
                value: /^[789]\d{9,11}$/,
                message: 'Must start with 7, 8, or 9 (10-12 digits only)'
              },
              maxLength: { value: 12, message: t('text.MAX_12_DIGIT') }
            }}
            render={({ field }) => (
              <TextField fullWidth size="small" {...field} error={!!errors.phone} helperText={errors.phone?.message} />
            )}
          />
        </Grid>

        {!userData && (
          <Grid item xs={12}>
            <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.PASSWORD')}</FormLabel>
            <TextField
              fullWidth
              size="small"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: t('text.REQUIRED'),
                minLength: { value: 6, message: t('text.MIN_6_CHAR') }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.ADDRESS')}</FormLabel>
          <Controller
            name="address"
            control={control}
            rules={{
              required: t('text.REQUIRED'),
              maxLength: { value: 100, message: t('text.MAX_100_CHAR') }
            }}
            render={({ field }) => (
              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                {...field}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
          {userData?.id ? t('text.UPDATE') : t('text.ADD')} {t('text.USER')}
        </Button>

        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          {t('text.CANCEL')}
        </Button>
      </Box>
    </form>
  );
};

export default AddUserForm;
