import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Grid,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Box,
  FormLabel,
  Typography,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { gridSpacing } from 'config.js';
import { urls } from 'common/urls';
import { postApi, getApi, updateApiPatch } from 'common/apiClient';
import toast from 'react-hot-toast';
import CustomBreadcrumbs from 'common/customBreadcrumbs';

const VehicleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const initialData = location.state || null;
  const [vehicleGroups, setVehicleGroups] = useState([]);

  useEffect(() => {
    const fetchVehicleGroups = async () => {
      try {
        const response = await getApi(urls.vehicleGroup.get);
        setVehicleGroups(response.data);
      } catch (error) {
        console.error('Error fetching vehicle groups:', error);
      }
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
      vehicleType: '',
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

  const onSubmit = async (data) => {
    const { sNo, group, gpsApiUrl, apiUsername, apiPassword, ...filteredData } = data;
    let response;
    if (id) {
      response = await updateApiPatch(urls.vehicle.update.replace(':id', id), filteredData);
      toast.success('Vehicle updated successfully');
    } else {
      response = await postApi(urls.vehicle.create, filteredData);
      toast.success('Vehicle added successfully');
    }

    reset();
    navigate('/vehicles');
  };

  return (
    <>
      <CustomBreadcrumbs
        title={id ? 'Edit Vehicle' : 'Add Vehicle'}
        links={[
          { name: 'Vehicles', path: '/vehicles' },
          { name: id ? 'Edit Vehicle' : 'Add Vehicle', path: '' }
        ]}
      />

      <Card sx={{ mt: 3, padding: 1 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  Registration Number
                </FormLabel>
                <Controller
                  name="registrationNo"
                  control={control}
                  rules={{
                    required: 'Registration No. is required',
                    minLength: { value: 6, message: 'At least 6 characters required' },
                    maxLength: { value: 12, message: 'Cannot exceed 12 characters' },
                    pattern: {
                      value: /^[A-Za-z0-9]+$/,
                      message: 'Only alphanumeric characters allowed (A-Z, 0-9)'
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
                  Vehicle Name
                </FormLabel>
                <Controller
                  name="vehicleName"
                  control={control}
                  rules={{
                    required: 'Vehicle Name is required',
                    minLength: { value: 3, message: 'At least 3 characters required' },
                    maxLength: { value: 30, message: 'Max 30 characters required' },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: 'Only alphabets are allowed (A-Z, a-z)'
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
                        const alphabeticValue = e.target.value.replace(/[^A-Za-z\s]/g, '');
                        field.onChange(alphabeticValue);
                      }}
                      onKeyPress={(e) => {
                        if (!/[A-Za-z\s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  Model
                </FormLabel>
                <Controller
                  name="model"
                  control={control}
                  rules={{
                    required: 'Model is required',
                    minLength: { value: 4, message: 'At least 4 characters required' },
                    maxLength: { value: 20, message: 'Cannot exceed 20 characters' },
                    pattern: {
                      value: /^(19[0-9]{2}|20[0-9]{2}|[A-Za-z0-9 ]+)$/,
                      message: 'Invalid model format (e.g., "2015" or "XUV500")'
                    }
                  }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" error={!!errors.model} helperText={errors.model?.message} />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  Chassis No
                </FormLabel>
                <Controller
                  name="chasisNo"
                  control={control}
                  rules={{
                    required: 'Chassis No. is required',
                    minLength: { value: 5, message: 'At least 5 characters required' },
                    maxLength: { value: 17, message: 'Cannot exceed 17 characters' },
                    pattern: {
                      value: /^[A-HJ-NPR-Z0-9]+$/,
                      message: 'Only alphanumeric characters allowed (A-Z, 0-9)'
                    }
                  }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" error={!!errors.chasisNo} helperText={errors.chasisNo?.message} />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  Engine No
                </FormLabel>
                <Controller
                  name="engineNo"
                  control={control}
                  rules={{
                    required: 'Engine No. is required',
                    minLength: { value: 6, message: 'At least 6 characters required' },
                    maxLength: { value: 17, message: 'Cannot exceed 17 characters' },
                    pattern: {
                      value: /^[A-Za-z0-9]+$/,
                      message: 'Only alphanumeric characters allowed (A-Z, 0-9)'
                    }
                  }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" error={!!errors.engineNo} helperText={errors.engineNo?.message} />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  Manufactured By
                </FormLabel>
                <Controller
                  name="manufacturedBy"
                  control={control}
                  rules={{
                    required: 'Manufactured By is required',
                    minLength: { value: 3, message: 'At least 3 characters required' },
                    maxLength: { value: 50, message: 'Max 50 characters allowed' },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: 'Only alphabets are allowed (A-Z, a-z)'
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
                <FormControl fullWidth>
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                    Vehicle Type
                  </FormLabel>
                  <Controller
                    name="vehicleType"
                    control={control}
                    rules={{ required: 'Vehicle Type is required' }}
                    render={({ field }) => (
                      <Select {...field} size="small" displayEmpty>
                        <MenuItem value="" disabled>
                          Select Vehicle Type
                        </MenuItem>{' '}
                        <MenuItem value="car">CAR</MenuItem>
                        <MenuItem value="bus">BUS</MenuItem>
                        <MenuItem value="taxi">TAXI</MenuItem>
                        <MenuItem value="motorcycle">MOTORCYCLE</MenuItem>
                        <MenuItem value="truck">TRUCK</MenuItem>
                        <MenuItem value="bicycle">BICYCLE</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.vehicleType && (
                    <Typography color="error" sx={{ fontSize: '11px', mt: 0.5, ml: 2 }}>
                      {errors.vehicleType.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>Vehicle Color</FormLabel>
                <Controller
                  name="vehicleColor"
                  control={control}
                  render={({ field }) => <TextField {...field} fullWidth type="color" size="small" />}
                />
                <Typography sx={{ color: '#000' }}>{watch('vehicleColor')}</Typography>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  Registration Expiry Date
                </FormLabel>
                <Controller
                  name="registrationExpiry"
                  control={control}
                  rules={{
                    required: 'Registration Expiry Date is required',
                    validate: (value) => {
                      if (!value) return 'Registration Expiry Date is required';
                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return selectedDate >= today || 'Expiry date must be in the future';
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="date"
                      size="small"
                      value={field.value ? field.value.split('T')[0] : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                      error={!!errors.registrationExpiry}
                      helperText={errors.registrationExpiry?.message}
                      inputProps={{
                        min: new Date().toISOString().split('T')[0]
                      }}
                    />
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
                    Vehicle Group
                  </FormLabel>

                  <Controller
                    name="vehicleGroupId"
                    control={control}
                    rules={{ required: 'Vehicle group is required' }}
                    render={({ field }) => (
                      <Select {...field} size="small" displayEmpty>
                        <MenuItem value="" disabled>
                          Select Vehicle Group
                        </MenuItem>
                        {vehicleGroups.map((group) => (
                          <MenuItem key={group.id} value={group.id}>
                            {group.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />

                  {errors.vehicleGroupId && (
                    <Typography color="error" sx={{ fontSize: '11px', mt: 0.5, ml: 2 }}>
                      {errors.vehicleGroupId.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>Vehicle Image</FormLabel>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      size="small"
                      type="file"
                      inputProps={{ accept: 'image/*' }}
                      onChange={(e) => setValue('image', e.target.files[0])}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>Vehicle Document</FormLabel>
                <Controller
                  name="doc"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="file"
                      inputProps={{ accept: 'application/pdf, image/*' }}
                      onChange={(e) => setValue('doc', e.target.files[0])}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  GPS API Details(Feed GPS Data)
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>GPS API URL</FormLabel>
                <TextField fullWidth size="small" {...register('gpsApiUrl')} />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>API Username</FormLabel>
                <TextField fullWidth size="small" {...register('apiUsername')} />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>API Password</FormLabel>
                <TextField fullWidth type="password" size="small" {...register('apiPassword')} />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                {id ? 'Update Vehicle' : 'Add Vehicle'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default VehicleForm;
