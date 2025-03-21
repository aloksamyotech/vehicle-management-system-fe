import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Grid,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormLabel,
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Card,
  CardContent
} from '@mui/material';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { gridSpacing } from 'config.js';
import { urls } from 'common/urls';
import { postApi, updateApiPatch } from 'common/apiClient';
import toast from 'react-hot-toast';

const DriverForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const initialData = location.state || null;

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      mobileNo: '',
      age: '',
      licenseNo: '',
      licenseExpiry: '',
      totalExp: '',
      dateOfJoining: '',
      notes: '',
      address: '',
      status: 'Active',
      image: null,
      doc: null
    },
    mode: 'all'
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key, initialData[key]);
      });
    }
  }, [initialData, setValue]);

  const onSubmit = async (data) => {
    const { sNo, ...filteredData } = data;
    try {
      let response;
      if (id) {
        response = await updateApiPatch(urls.driver.update.replace(':id', id), filteredData);
        toast.success('Driver updated successfully');
      } else {
        response = await postApi(urls.driver.create, filteredData);
        toast.success('Driver added successfully');
      }

      reset();
      navigate('/drivers');
    } catch (error) {
      toast.error('Error: ' + (error.response?.data?.error || 'Something went wrong!'));
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0, m: 0 }}>
        <Typography variant="h3">{id ? 'Edit Driver' : 'Add Driver'}</Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <Typography color="text.primary">{id ? 'Edit Driver' : 'Add Driver'}</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ maxWidth: 'auto', mt: 3, padding: 1 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Driver Name*</FormLabel>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Driver Name is required' }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" error={!!errors.name} helperText={errors.name?.message} />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Mobile*</FormLabel>
                <Controller
                  name="mobileNo"
                  control={control}
                  rules={{ required: 'Mobile is required' }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" error={!!errors.mobileNo} helperText={errors.mobileNo?.message} />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Age*</FormLabel>
                <Controller
                  name="age"
                  control={control}
                  rules={{
                    required: 'Age is required',
                    min: { value: 18, message: 'Age must be at least 18' },
                    max: { value: 50, message: 'Age must be below 50' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="number"
                      inputProps={{ min: 18, max: 50 }}
                      error={!!errors.age}
                      helperText={errors.age?.message}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>License No*</FormLabel>
                <Controller
                  name="licenseNo"
                  control={control}
                  rules={{ required: 'License No is required' }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" error={!!errors.licenseNo} helperText={errors.licenseNo?.message} />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>License Expiry Date*</FormLabel>
                <Controller
                  name="licenseExpiry"
                  control={control}
                  rules={{ required: 'License Expiry Date is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="date"
                      value={field.value ? field.value.split('T')[0] : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                      error={!!errors.licenseExpiry}
                      helperText={errors.licenseExpiry?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Total Experience*</FormLabel>
                <Controller
                  name="totalExp"
                  control={control}
                  rules={{ required: 'Total Experience is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="number"
                      error={!!errors.totalExp}
                      helperText={errors.totalExp?.message}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Date of Joining*</FormLabel>
                <Controller
                  name="dateOfJoining"
                  control={control}
                  rules={{ required: 'Date of Joining is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="date"
                      value={field.value ? field.value.split('T')[0] : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                      error={!!errors.dateOfJoining}
                      helperText={errors.dateOfJoining?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Reference/Notes*</FormLabel>
                <Controller
                  name="notes"
                  control={control}
                  rules={{ required: 'Notes is required' }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" error={!!errors.notes} helperText={errors.notes?.message} />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Address*</FormLabel>
                <Controller
                  name="address"
                  multiline
                  rows={2}
                  control={control}
                  rules={{ required: 'Address is required' }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" error={!!errors.address} helperText={errors.address?.message} />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth size="small">
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Driver Status</FormLabel>
                  <Controller
                    name="status"
                    control={control}
                    defaultValue="Active"
                    rules={{ required: 'Status is required' }}
                    render={({ field }) => (
                      <Select {...field} error={!!errors.status}>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Driver Photo</FormLabel>
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
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Driver Document</FormLabel>
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                {id ? 'Update Driver' : 'Add Driver'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default DriverForm;
