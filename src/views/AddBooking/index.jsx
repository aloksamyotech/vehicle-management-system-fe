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
import axios from 'axios';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DriverForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const initialData = location.state || null;
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [minEndDate, setMinEndDate] = useState(new Date());
  const [totalKm, setTotalKm] = useState('');
  const [isAutoCalculated, setIsAutoCalculated] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await getApi(urls.vehicle.get);
      setVehicles(response?.data);
    };

    const fetchDriver = async () => {
      const response = await getApi(urls.driver.get);
      setDrivers(response?.data);
    };

    const fetchCustomer = async () => {
      const response = await getApi(urls.customer.get);
      setCustomers(response?.data);
    };

    fetchVehicles();
    fetchDriver();
    fetchCustomer();
  }, []);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: initialData || {
      vehicleId: '',
      driverId: null,
      customerId: '',
      tripType: '',
      tripStartDate: '',
      tripEndDate: '',
      tripStartPincode: '',
      tripEndPincode: '',
      tripStartLoc: '',
      tripEndLoc: '',
      totalKm: '',
      totalAmt: '',
      tripStatus: 'YetToStart'
    },
    mode: 'all'
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => setValue(key, initialData[key]));
    }
  }, [initialData, setValue]);

  useEffect(() => {
    if (initialData) {
      const startDate = initialData.tripStartDate ? new Date(initialData.tripStartDate) : new Date();
      const endDate = initialData.tripEndDate ? new Date(initialData.tripEndDate) : new Date(startDate.getTime() + 3600000);

      setValue('tripStartDate', startDate);
      setValue('tripEndDate', endDate);
      setMinEndDate(startDate);
    }
  }, [initialData, setValue]);

  const fetchCityAndDetails = async (pincode) => {
    if (pincode && pincode.length === 6) {
      try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = response.data[0];

        if (data.Status === 'Success') {
          const { District, State, Division } = data.PostOffice[0];

          setValue('tripStartLoc', `${Division}, ${District}, ${State}`);
          setValue('tripStartPincode', pincode);
        } else {
          setValue('tripStartLoc', '');
          setValue('tripStartPincode', '');
        }
      } catch (error) {
        console.error(text.ERROR_FETCHING, error);
      }
    }
  };

  const fetchEndCityAndDetails = async (pincode) => {
    if (pincode && pincode.length === 6) {
      try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = response.data[0];

        if (data.Status === 'Success') {
          const { District, State, Division } = data.PostOffice[0];
          setValue('tripEndLoc', `${Division}, ${District}, ${State}`);
          setValue('tripEndPincode', pincode);
        } else {
          setValue('tripEndLoc', '');
          setValue('tripEndPincode', '');
        }
      } catch (error) {
        console.error(text.ERROR_FETCHING, error);
      }
    }
  };

  const fetchCoordinates = async (pincode) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`);
      const data = response.data[0];

      if (data) {
        return { lat: parseFloat(data.lat), lon: parseFloat(data.lon) };
      }
      return null;
    } catch (error) {
      console.error(text.ERROR_FETCHING, error);
      return null;
    }
  };

  useEffect(() => {
    if (watch('tripStartPincode') && watch('tripEndPincode') && isAutoCalculated) {
      calculateDistance();
    }
  }, [watch('tripStartPincode'), watch('tripEndPincode')]);

  const calculateDistance = async () => {
    const startPincode = watch('tripStartPincode');
    const endPincode = watch('tripEndPincode');

    if (startPincode && endPincode) {
      const startCoords = await fetchCoordinates(startPincode);
      const endCoords = await fetchCoordinates(endPincode);

      if (startCoords && endCoords) {
        let distance = getDistance(startCoords.lat, startCoords.lon, endCoords.lat, endCoords.lon);

        distance = parseFloat(distance.toFixed(2));

        if (isAutoCalculated) {
          setTotalKm(distance);
          setValue('totalKm', distance);
        }
      }
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

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
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{text.DRIVER}</FormLabel>

                  <Controller
                    name="driverId"
                    control={control}
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
                  {text.TRIP_START_PIN}
                </FormLabel>
                <Controller
                  name="tripStartPincode"
                  control={control}
                  rules={{ required: text.REQUIRED }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      error={!!errors.tripStartPincode}
                      helperText={errors.tripStartPincode?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        fetchCityAndDetails(e.target.value);
                      }}
                    />
                  )}
                />
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
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      error={!!errors.tripStartLoc}
                      helperText={errors.tripStartLoc?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        fetchCityAndDetails(e.target.value);
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {text.TRIP_END_PIN}
                </FormLabel>
                <Controller
                  name="tripEndPincode"
                  control={control}
                  rules={{ required: text.REQUIRED }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      error={!!errors.tripEndPincode}
                      helperText={errors.tripEndPincode?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        fetchEndCityAndDetails(e.target.value);
                      }}
                    />
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
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      error={!!errors.tripEndLoc}
                      helperText={errors.tripEndLoc?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        fetchEndCityAndDetails(e.target.value);
                      }}
                    />
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
                      value={totalKm}
                      onChange={(e) => {
                        setIsAutoCalculated(false);
                        let value = parseFloat(e.target.value);

                        if (!isNaN(value)) {
                          setTotalKm(value);
                          field.onChange(value);
                        }
                      }}
                      onBlur={() => {
                        if (!totalKm) {
                          setIsAutoCalculated(true);
                          calculateDistance();
                        } else {
                          setTotalKm(parseFloat(totalKm));
                        }
                      }}
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
                  defaultValue={new Date()}
                  rules={{ required: text.REQUIRED }}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        {...field}
                        renderInput={(props) => <TextField {...props} fullWidth size="small" error={!!error} helperText={error?.message} />}
                        value={field.value}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          setMinEndDate(newValue);
                        }}
                        minDateTime={new Date()}
                        PopperProps={{ placement: 'top-start' }}
                      />
                    </LocalizationProvider>
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
                  defaultValue={new Date()}
                  rules={{
                    required: text.REQUIRED,
                    validate: (value) => {
                      const startDate = new Date(getValues('tripStartDate'));
                      const endDate = new Date(value);
                      return endDate >= startDate || text.END_DATE_AFTER_START;
                    }
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        {...field}
                        renderInput={(props) => <TextField {...props} fullWidth size="small" error={!!error} helperText={error?.message} />}
                        value={field.value}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                        }}
                        minDateTime={minEndDate}
                        PopperProps={{ placement: 'top-start' }}
                      />
                    </LocalizationProvider>
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
                      onChange={(e) => {
                        let value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          value = parseFloat(value);
                        }
                        field.onChange(value);
                      }}
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
                    defaultValue="YetToStart"
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
