import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Button, TextField, Autocomplete, FormControl, Box, FormLabel, Typography, Divider, Card, CardContent } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { gridSpacing } from 'config.js';
import { urls } from 'common/urls';
import { postApi, getApi, updateApiPatch } from 'common/apiClient';
import toast from 'react-hot-toast';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTranslation } from 'react-i18next';

const VehicleForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const initialData = location.state || null;
  const [vehicleGroups, setVehicleGroups] = useState([]);

  useEffect(() => {
    const fetchVehicleGroups = async () => {
      const response = await getApi(urls.vehicleGroup.get);
      setVehicleGroups(response.data);
    };

    fetchVehicleGroups();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      registrationNo: '',
      vehicleName: '',
      model: '',
      chasisNo: '',
      engineNo: '',
      manufacturedBy: '',
      vehicleColor: '#D6E1F3',
      registrationExpiry: '',
      vehicleGroupId: '',
      image: null,
      doc: null,
      gpsApiUrl: 'https://codeforts.com/vms/api',
      apiUsername: 'testUser',
      apiPassword: 'testPass'
    },
    mode: 'all'
  });
  const vehicleColor = watch('vehicleColor');

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key, initialData[key]);
      });
    }
  }, [initialData, setValue]);

  useEffect(() => {
    if (initialData) {
      const expDate = initialData.registrationExpiry ? new Date(initialData.registrationExpiry) : new Date();

      setValue('registrationExpiry', expDate);
    }
  }, [initialData, setValue]);

  const onSubmit = async (data) => {
    const { sNo, group, gpsApiUrl, apiUsername, apiPassword, image, doc, ...filteredData } = data;

    const formData = new FormData();

    Object.entries(filteredData).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value);
      }
    });

    if (image instanceof File) {
      formData.append('image', image);
    } else if (initialData?.image) {
      formData.append('image', initialData.image);
    }

    if (doc instanceof File) {
      formData.append('doc', doc);
    } else if (initialData?.doc) {
      formData.append('doc', initialData.doc);
    }

    let response;
    if (id) {
      response = await updateApiPatch(urls.vehicle.update.replace(':id', id), formData, true);
      toast.success(t('text.VEHICLE_UPDATED'));
    } else {
      response = await postApi(urls.vehicle.create, formData, true);
      toast.success(t('text.VEHICLE_ADDED'));
    }

    reset();
    navigate('/vehicles');
  };

  return (
    <>
      <CustomBreadcrumbs
        title={id ? t('text.EDIT_VEHICLE') : t('text.ADD_VEHICLE')}
        links={[
          { name: t('text.VEHICLE'), path: '/vehicles' },
          { name: id ? t('text.EDIT_VEHICLE') : t('text.ADD_VEHICLE'), path: '' }
        ]}
      />

      <Card sx={{ mt: 3, padding: 1 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {t('text.RES_NO')}
                </FormLabel>
                <Controller
                  name="registrationNo"
                  control={control}
                  rules={{
                    required: t('text.REQUIRED'),
                    minLength: { value: 6, message: t('text.MIN_6_CHAR') },
                    maxLength: { value: 12, message: t('text.MAX_12_CHAR') },
                    pattern: {
                      value: /^[A-Za-z0-9]+$/,
                      message: t('text.ALPHA_NUM')
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      error={!!errors.registrationNo}
                      helperText={errors.registrationNo?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {t('text.VEHICLE_NAME')}
                </FormLabel>
                <Controller
                  name="vehicleName"
                  control={control}
                  rules={{
                    required: t('text.REQUIRED'),
                    minLength: { value: 3, message: t('text.MIN_3_CHAR') },
                    maxLength: { value: 30, message: t('text.MAX_30_CHAR') },
                    pattern: {
                      value: /^[A-Za-z0-9\s]+$/,
                      message: t('text.ALPHA_NUM')
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      error={!!errors.vehicleName}
                      helperText={errors.vehicleName?.message}
                      onChange={(e) => {
                        const alphanumericValue = e.target.value.replace(/[^A-Za-z0-9\s]/g, '');
                        field.onChange(alphanumericValue);
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {t('text.MODEL')}
                </FormLabel>
                <Controller
                  name="model"
                  control={control}
                  rules={{
                    required: t('text.REQUIRED'),
                    minLength: { value: 4, message: t('text.MIN_4_CHAR') },
                    maxLength: { value: 20, message: t('text.MAX_20_CHAR') },
                    pattern: {
                      value: /^[A-Za-z0-9\s\-_@#&]+$/,
                      message: 'Invalid model format (e.g., "2015" or "XUV500@#")'
                    }
                  }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" error={!!errors.model} helperText={errors.model?.message} />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {t('text.CHASIS_NO')}
                </FormLabel>
                <Controller
                  name="chasisNo"
                  control={control}
                  rules={{
                    required: t('text.REQUIRED'),
                    minLength: { value: 5, message: t('text.MIN_5_CHAR') },
                    maxLength: { value: 17, message: t('text.MAX_17_CHAR') },
                    pattern: {
                      value: /^[A-HJ-NPR-Z0-9]+$/,
                      message: t('text.ALPHA_NUM')
                    }
                  }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" error={!!errors.chasisNo} helperText={errors.chasisNo?.message} />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {t('text.ENGINE_NO')}
                </FormLabel>
                <Controller
                  name="engineNo"
                  control={control}
                  rules={{
                    required: t('text.REQUIRED'),
                    minLength: { value: 6, message: t('text.MIN_6_CHAR') },
                    maxLength: { value: 17, message: t('text.MAX_17_CHAR') },
                    pattern: {
                      value: /^[A-Za-z0-9]+$/,
                      message: t('text.ALPHA_NUM')
                    }
                  }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" error={!!errors.engineNo} helperText={errors.engineNo?.message} />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {t('text.MANUFACTURED_BY')}
                </FormLabel>
                <Controller
                  name="manufacturedBy"
                  control={control}
                  rules={{
                    required: t('text.REQUIRED'),
                    minLength: { value: 3, message: t('text.MIN_3_CHAR') },
                    maxLength: { value: 50, message: t('text.MAX_50_CHAR') },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: t('text.ALPHABETS_ONLY')
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      error={!!errors.manufacturedBy}
                      helperText={errors.manufacturedBy?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.COLOR')}</FormLabel>
                <Controller
                  name="vehicleColor"
                  control={control}
                  render={({ field }) => <TextField {...field} fullWidth type="color" size="small" />}
                />
                <Typography sx={{ color: '#000' }}>{watch('vehicleColor')}</Typography>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {t('text.RES_EXP_DATE')}
                </FormLabel>
                <Controller
                  name="registrationExpiry"
                  control={control}
                  rules={{
                    required: t('text.REQUIRED'),
                    validate: (value) => {
                      if (!value) return t('text.REQUIRED');
                      return new Date(value) > new Date();
                    }
                  }}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        {...field}
                        renderInput={(props) => (
                          <TextField
                            {...props}
                            fullWidth
                            size="small"
                            error={!!errors.registrationExpiry}
                            helperText={errors.registrationExpiry?.message}
                          />
                        )}
                        value={field.value || null}
                        onChange={(newValue) => field.onChange(newValue)}
                        minDate={new Date()}
                        PopperProps={{ placement: 'top-start' }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth required>
                  <FormLabel
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    {t('text.VEHICLE_GROUP')}
                  </FormLabel>

                  <Controller
                    name="vehicleGroupId"
                    control={control}
                    rules={{ required: t('text.REQUIRED') }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={vehicleGroups}
                        getOptionLabel={(option) => option.name || ''}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                        value={vehicleGroups.find((v) => v.id === field.value) || null}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder={t('text.SELECT_GROUP')}
                            error={!!errors.vehicleGroupId}
                            helperText={errors.vehicleGroupId?.message}
                          />
                        )}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.PHOTO')}</FormLabel>
                <Controller
                  name="image"
                  control={control}
                  render={() => (
                    <>
                      <TextField
                        fullWidth
                        size="small"
                        type="file"
                        inputProps={{ accept: 'image/*' }}
                        onChange={(e) => setValue('image', e.target.files[0])}
                      />
                      {initialData?.image && (
                        <Typography variant="caption" color="textSecondary">
                          {initialData.image.split('/').pop()}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.DOCUMENT')}</FormLabel>
                <Controller
                  name="doc"
                  control={control}
                  render={() => (
                    <>
                      <TextField
                        fullWidth
                        size="small"
                        type="file"
                        inputProps={{ accept: 'application/pdf, image/*' }}
                        onChange={(e) => setValue('doc', e.target.files[0])}
                      />
                      {initialData?.doc && (
                        <Typography variant="caption" color="textSecondary">
                          {initialData.doc.split('/').pop()}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {t('text.GPS_DETAILS')}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.GPS_API')}</FormLabel>
                <TextField fullWidth size="small" {...register('gpsApiUrl')} />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.API_USERNAME')}</FormLabel>
                <TextField fullWidth size="small" {...register('apiUsername')} />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.API_PASS')}</FormLabel>
                <TextField fullWidth type="password" size="small" {...register('apiPassword')} />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                {id ? t('text.UPDATE') : t('text.ADD')} {t('text.VEHICLE')}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default VehicleForm;
