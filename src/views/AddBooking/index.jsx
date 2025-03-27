import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Grid,
  Button,
  TextField,
  Box,
  Checkbox,
  Autocomplete,
  FormLabel,
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

const DriverForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const initialData = location.state || null;
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [minEndDate, setMinEndDate] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await getApi(urls.vehicle.get);
      setVehicles(response.data);
    };

    const fetchDriver = async () => {
      const response = await getApi(urls.driver.get);
      setDrivers(response.data);
    };

    const fetchCustomer = async () => {
      const response = await getApi(urls.customer.get);
      setCustomers(response.data);
    };

    fetchVehicles();
    fetchDriver();
    fetchCustomer();
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: initialData || {
      vehicleId: '',
      driverId: '',
      customerId: '',
      tripType: '',
      tripStartDate: '',
      tripEndDate: '',
      tripStartLoc: '',
      tripEndLoc: '',
      totalKm: '',
      totalAmt: '',
      tripStatus: ''
    },
    mode: 'all'
  });
  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => setValue(key, initialData[key]));
    }
  }, [initialData, setValue]);

  const onSubmit = async (data) => {
    const { ...filteredData } = data;
    let response;
    if (id) {
      response = await updateApiPatch(urls.booking.update.replace(':id', id), filteredData);
      toast.success(text.BOOKING_UPDATED);
    } else {
      response = await postApi(urls.booking.create, filteredData);
      toast.success(text.BOOKING_ADDED);
    }

    reset();
    navigate('/booking');
  };

  return (
    <>
      <CustomBreadcrumbs
        title={id ? text.EDIT_BOOKING : text.ADD_BOOKING}
        links={[
          { name: text.BOOKINGS, path: '/booking' },
          { name: id ? text.EDIT_BOOKING : text.ADD_BOOKING, path: '' }
        ]}
      />
      <Card sx={{ maxWidth: 'auto', mt: 3, padding: 1 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth>
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                    {text.CUSTOMER}
                  </FormLabel>

                  <Controller
                    name="customerId"
                    control={control}
                    rules={{ required: text.REQUIRED }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={customers}
                        getOptionLabel={(option) => option.name || ''}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                        value={customers.find((v) => v.id === field.value) || null}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder={text.SELECT_CUSTOMER}
                            error={!!errors.customerId}
                            helperText={errors.customerId?.message}
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
                    {text.VEHICLE}
                  </FormLabel>

                  <Controller
                    name="vehicleId"
                    control={control}
                    rules={{ required: text.REQUIRED }}
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
                            placeholder={text.SELECT_VEHICLE}
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
                    {text.DRIVER}
                  </FormLabel>

                  <Controller
                    name="driverId"
                    control={control}
                    rules={{ required: text.REQUIRED }}
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
                            placeholder={text.SELECT_DRIVER}
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
                <FormControl fullWidth required>
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{text.TRIP_TYPE}</FormLabel>
                  <Controller
                    name="tripType"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} size="small">
                        <MenuItem value="Single Trip">{text.SINGLE_TRIP}</MenuItem>
                        <MenuItem value="Round Trip">{text.ROUND_TRIP}</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {text.TRIP_START_LOC}
                </FormLabel>
                <Controller
                  name="tripStartLoc"
                  control={control}
                  rules={{ required: text.REQUIRED }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" error={!!errors.tripStartLoc} helperText={errors.tripStartLoc?.message} />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {text.TRIP_END_LOC}
                </FormLabel>
                <Controller
                  name="tripEndLoc"
                  control={control}
                  rules={{ required: text.REQUIRED }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" error={!!errors.tripEndLoc} helperText={errors.tripEndLoc?.message} />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {text.TOTAL_KM}
                </FormLabel>
                <Controller
                  name="totalKm"
                  control={control}
                  rules={{
                    required: text.REQUIRED,
                    min: { value: 0.1, message: text.GREATER_THAN_0 },
                    max: { value: 100000, message: text.CANNOT_EXCEED }
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
                {errors.totalKm && (
                  <Typography color="error" sx={{ fontSize: '11px', mt: 0.5, ml: 2 }}>
                    {errors.totalKm.message}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {text.START_DATE}
                </FormLabel>
                <Controller
                  name="tripStartDate"
                  control={control}
                  rules={{ required: text.REQUIRED }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="datetime-local"
                      value={field.value ? field.value.split('.')[0] : ''}
                      onChange={(e) => {
                        const newStartDate = new Date(e.target.value).toISOString();
                        field.onChange(newStartDate);
                        setMinEndDate(e.target.value);
                      }}
                      error={!!errors.tripStartDate}
                      helperText={errors.tripStartDate?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {text.END_DATE}
                </FormLabel>
                <Controller
                  name="tripEndDate"
                  control={control}
                  rules={{
                    required: text.REQUIRED,
                    validate: (value) => {
                      const startDate = new Date(getValues('tripStartDate'));
                      const endDate = new Date(value);
                      return endDate >= startDate || text.END_DATE_AFTER_START;
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="datetime-local"
                      inputProps={{ min: minEndDate }}
                      value={field.value ? field.value.split('.')[0] : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                      error={!!errors.tripEndDate}
                      helperText={errors.tripEndDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {text.TOTAL_AMOUNT}
                </FormLabel>
                <Controller
                  name="totalAmt"
                  control={control}
                  rules={{
                    required: text.REQUIRED,
                    min: { value: 0.1, message: text.GREATER_THAN_0 },
                    max: { value: 100000, message: text.CANNOT_EXCEED }
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
                {errors.totalAmt && (
                  <Typography color="error" sx={{ fontSize: '11px', mt: 0.5, ml: 2 }}>
                    {errors.totalAmt.message}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth required>
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{text.STATUS}</FormLabel>
                  <Controller
                    name="tripStatus"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} size="small">
                        <MenuItem value="YetToStart">{text.YET_TO_START}</MenuItem>
                        <MenuItem value="Completed">{text.COMPLETED}</MenuItem>
                        <MenuItem value="Ongoing">{text.ONGOING}</MenuItem>
                        <MenuItem value="Cancelled">{text.CANCELLED}</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox {...register('sendEmailConfirmation')} />}
                  label="Is need to send email confirmation after booking?"
                />
              </Grid> */}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                {id ? text.UPDATE_BOOKING : text.ADD_BOOKING}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default DriverForm;
