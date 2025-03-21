import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Grid,
  Button,
  TextField,
  Box,
  Checkbox,
  FormLabel,
  Breadcrumbs,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Link as MuiLink,
  Card,
  CardContent,
  Typography,
  Select,
  FormControl
} from '@mui/material';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { gridSpacing } from 'config.js';
import { urls } from 'common/urls';
import { postApi, getApi, updateApiPatch } from 'common/apiClient';
import toast from 'react-hot-toast';

const FuelExpenseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const initialData = location.state || null;
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await getApi(urls.vehicle.get);
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await getApi(urls.driver.get);
        setDrivers(response.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

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
      console.log(initialData);
      Object.keys(initialData).forEach((key) => setValue(key, initialData[key]));
    }
  }, [initialData, setValue]);

  const onSubmit = async (data) => {
    const { confirm, ...filteredData } = data;
    let response;
    if (id) {
      response = await updateApiPatch(urls.fuel.update.replace(':id', id), filteredData);
      toast.success('Fuel updated successfully');
    } else {
      response = await postApi(urls.fuel.create, filteredData);
      toast.success('Fuel added successfully');
    }

    reset();
    navigate('/fuel');
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0, m: 0 }}>
        <Typography variant="h3" sx={{ m: 0 }}>
          {id ? 'Edit Fuel' : 'Add Fuel'}
        </Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <MuiLink component={Link} to="/fuel" color="inherit" underline="none">
            <Typography color="#17a2b8">Fuel</Typography>
          </MuiLink>
          <Typography color="text.primary">{id ? 'Edit Fuel' : 'Add Fuel'}</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ maxWidth: 'auto', mt: 3, padding: 1 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth>
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                    Vehicle
                  </FormLabel>
                  <Controller
                    name="vehicleId"
                    control={control}
                    rules={{ required: 'Vehicle is required' }}
                    render={({ field }) => (
                      <Select {...field} size="small" displayEmpty>
                        <MenuItem value="" disabled>
                          Select Vehicle
                        </MenuItem>
                        {vehicles.map((group) => (
                          <MenuItem key={group.id} value={group.id}>
                            {group.vehicleName}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.vehicleId && (
                    <Typography color="error" sx={{ fontSize: '11px', mt: 0.5, ml: 2 }}>
                      {errors.vehicleId.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth>
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                    Added Driver
                  </FormLabel>
                  <Controller
                    name="driverId"
                    control={control}
                    rules={{ required: 'Driver is required' }}
                    render={({ field }) => (
                      <Select {...field} size="small" displayEmpty>
                        <MenuItem value="" disabled>
                          Select Driver
                        </MenuItem>
                        {drivers.map((group) => (
                          <MenuItem key={group.id} value={group.id}>
                            {group.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.driverId && (
                    <Typography color="error" sx={{ fontSize: '11px', mt: 0.5, ml: 2 }}>
                      {errors.driverId.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  Fuel Fill Date
                </FormLabel>
                <Controller
                  name="fillDate"
                  control={control}
                  rules={{ required: 'Fuel Fill Date is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="date"
                      value={field.value ? field.value.split('T')[0] : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                      error={!!errors.fillDate}
                      helperText={errors.fillDate?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  Quantity
                </FormLabel>
                <Controller
                  name="quantity"
                  control={control}
                  rules={{
                    required: 'Quantity is required',
                    min: { value: 0.1, message: 'Quantity must be greater than 0' },
                    max: { value: 100000, message: 'Quantity cannot exceed 100,000' }
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
                  Odometer Reading
                </FormLabel>
                <Controller
                  name="odometerReading"
                  control={control}
                  rules={{
                    required: 'Odometer reading is required',
                    min: { value: 0, message: 'Odometer reading cannot be negative' },
                    max: { value: 1000000, message: 'Odometer reading cannot exceed 1,000,000' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required
                      type="number"
                      size="small"
                      inputProps={{ step: '1', min: 0, max: 1000000 }}
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
                  Amount
                </FormLabel>
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: 'Amount is required',
                    min: { value: 0.01, message: 'Amount must be greater than 0' },
                    max: { value: 1000000, message: 'Amount cannot exceed 1,000,000' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required
                      type="number"
                      size="small"
                      inputProps={{ step: '0.01', min: 0.01, max: 1000000 }}
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
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>Comments</FormLabel>
                <Controller
                  name="comments"
                  control={control}
                  rules={{ required: 'Comments is required' }}
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
                {id ? 'Update Fuel' : 'Add Fuel'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default FuelExpenseForm;
