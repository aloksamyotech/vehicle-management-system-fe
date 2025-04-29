import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Grid,
  Button,
  TextField,
  Box,
  Autocomplete,
  Checkbox,
  FormLabel,
  FormControlLabel,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Select,
  FormControl
} from '@mui/material';
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

const FuelExpenseForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const initialData = location.state || null;
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await getApi(`${urls.vehicle.get}?all=true`);
      setVehicles(response?.data?.vehicleDetails);
    };

    const fetchDriver = async () => {
      const response = await getApi(`${urls.driver.get}?all=true`);
      setDrivers(response?.data?.driverDetails);
    };

    fetchVehicles();
    fetchDriver();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: initialData || {
      vehicleId: '',
      driverId: '',
      fillDate: '',
      quantity: '',
      odometerReading: '',
      amount: '',
      comments: '',
      addToExpense: false
    },
    mode: 'all'
  });

  const addToExpense = watch('addToExpense');

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => setValue(key, initialData[key]));
    }
  }, [initialData, setValue]);

  const onSubmit = async (data) => {
    const { confirm, ...filteredData } = data;
    let response;
    if (id) {
      response = await updateApiPatch(urls.fuel.update.replace(':id', id), filteredData);
      toast.success(t('text.FUEL_UPDATED'));
    } else {
      response = await postApi(urls.fuel.create, filteredData);
      toast.success(t('text.FUEL_ADDED'));
    }

    reset();
    navigate('/fuel');
  };

  return (
    <>
      <CustomBreadcrumbs
        title={id ? t('text.EDIT_FUEL') : t('text.ADD_FUEL')}
        links={[
          { name: t('text.FUEL'), path: '/fuel' },
          { name: id ? t('text.EDIT_FUEL') : t('text.ADD_FUEL'), path: '' }
        ]}
      />

      <Card sx={{ maxWidth: 'auto', mt: 3, padding: 1 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth>
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                    {t('text.VEHICLE')}
                  </FormLabel>
                  <Controller
                    name="vehicleId"
                    control={control}
                    rules={{ required: t('text.REQUIRED') }}
                    render={({ field }) => (
                      <Autocomplete
                        options={vehicles}
                        getOptionLabel={(option) => option.vehicleName || ''}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                        value={vehicles.find((v) => v.id === field.value) || null}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder={t('text.SELECT_VEHICLE')}
                            error={!!errors.vehicleId}
                            helperText={errors.vehicleId?.message}
                          />
                        )}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth>
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                    {t('text.DRIVER')}
                  </FormLabel>

                  <Controller
                    name="driverId"
                    control={control}
                    rules={{ required: t('text.REQUIRED') }}
                    render={({ field }) => (
                      <Autocomplete
                        options={drivers}
                        getOptionLabel={(option) => option.name || ''}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                        value={drivers.find((v) => v.id === field.value) || null}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder={t('text.SELECT_DRIVER')}
                            error={!!errors.driverId}
                            helperText={errors.driverId?.message}
                          />
                        )}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {t('text.FILL_DATE')}
                </FormLabel>
                <Controller
                  name="fillDate"
                  control={control}
                  defaultValue={new Date()}
                  rules={{ required: t('text.REQUIRED') }}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        {...field}
                        disablePast
                        value={field.value ? new Date(field.value) : null}
                        onChange={(newValue) => field.onChange(newValue)}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth size="small" error={!!errors.fillDate} helperText={errors.fillDate?.message} />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {t('text.QUANTITY')}(litres)
                </FormLabel>
                <Controller
                  name="quantity"
                  control={control}
                  rules={{
                    required: t('text.REQUIRED'),
                    min: { value: 0.1, message: t('text.GREATER_THAN_0') },
                    max: { value: 100000, message: t('text.CANNOT_EXCEED') }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required
                      type="number"
                      size="small"
                      inputProps={{ step: '0.01', min: 0.1, max: 100000 }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  )}
                />
                {errors.quantity && (
                  <Typography color="error" sx={{ fontSize: '11px', mt: 0.5, ml: 2 }}>
                    {errors.quantity.message}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {t('text.ODOMETER_READING')}
                </FormLabel>
                <Controller
                  name="odometerReading"
                  control={control}
                  rules={{
                    required: t('text.REQUIRED'),
                    min: { value: 0.1, message: t('text.GREATER_THAN_0') },
                    max: { value: 100000, message: t('text.CANNOT_EXCEED') }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required
                      type="number"
                      size="small"
                      inputProps={{ step: '1', min: 0, max: 100000 }}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                {errors.odometerReading && (
                  <Typography color="error" sx={{ fontSize: '11px', mt: 0.5, ml: 2 }}>
                    {errors.odometerReading.message}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {t('text.AMOUNT')}
                </FormLabel>
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: t('text.REQUIRED'),
                    min: { value: 0.1, message: t('text.GREATER_THAN_0') },
                    max: { value: 100000, message: t('text.CANNOT_EXCEED') }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required
                      type="number"
                      size="small"
                      inputProps={{ step: '0.01', min: 0.01, max: 100000 }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  )}
                />
                {errors.amount && (
                  <Typography color="error" sx={{ fontSize: '11px', mt: 0.5, ml: 2 }}>
                    {errors.amount.message}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.COMMENTS')}</FormLabel>
                <Controller
                  name="comments"
                  control={control}
                  rules={{ required: t('text.REQUIRED') }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" error={!!errors.comments} helperText={errors.comments?.message} />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Controller
                      name="addToExpense"
                      control={control}
                      render={({ field }) => <Checkbox {...field} checked={field.value} />}
                    />
                  }
                  label="Need to add in expense?"
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button variant="contained" color="primary" type="submit">
                {id ? t('text.UPDATE_FUEL') : t('text.ADD_FUEL')}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default FuelExpenseForm;
