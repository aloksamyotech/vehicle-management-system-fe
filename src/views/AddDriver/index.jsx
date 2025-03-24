import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Button, TextField, FormControl, Select, MenuItem, FormLabel, Box, Typography, Card, CardContent } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { gridSpacing } from 'config.js';
import { urls } from 'common/urls';
import { postApi, updateApiPatch } from 'common/apiClient';
import toast from 'react-hot-toast';
import CustomBreadcrumbs from 'common/customBreadcrumbs';

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
  };

  return (
    <>
      <CustomBreadcrumbs
        title={id ? 'Edit Driver' : 'Add Driver'}
        links={[
          { name: 'Driver', path: '/drivers' },
          { name: id ? 'Edit Driver' : 'Add Driver', path: '' }
        ]}
      />

      <Card sx={{ maxWidth: 'auto', mt: 3, padding: 1 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  Driver Name
                </FormLabel>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: 'Driver Name is required',
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
                      error={!!errors.name}
                      helperText={errors.name?.message}
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
                  Mobile
                </FormLabel>
                <Controller
                  name="mobileNo"
                  control={control}
                  rules={{
                    required: 'Mobile is required',
                    minLength: { value: 10, message: 'Must be at least 10 digits' },
                    maxLength: { value: 12, message: 'Cannot exceed 12 digits' },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Only numbers are allowed'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      error={!!errors.mobileNo}
                      helperText={errors.mobileNo?.message}
                      inputProps={{ maxLength: 12 }}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, '');
                        field.onChange(numericValue);
                      }}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  Age
                </FormLabel>
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
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  License No
                </FormLabel>
                <Controller
                  name="licenseNo"
                  control={control}
                  rules={{
                    required: 'License No is required',
                    minLength: { value: 6, message: 'At least 6 characters required' },
                    maxLength: { value: 14, message: 'Cannot exceed 14 characters' },
                    pattern: {
                      value: /^[A-Za-z0-9]+$/,
                      message: 'Only alphabets and numbers are allowed'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      error={!!errors.licenseNo}
                      helperText={errors.licenseNo?.message}
                      onChange={(e) => {
                        const alphanumericValue = e.target.value.replace(/[^A-Za-z0-9]/g, '');
                        field.onChange(alphanumericValue);
                      }}
                      onKeyPress={(e) => {
                        if (!/[A-Za-z0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  License Expiry Date
                </FormLabel>
                <Controller
                  name="licenseExpiry"
                  control={control}
                  rules={{
                    required: 'License Expiry Date is required',
                    validate: (value) => {
                      if (!value) return 'License Expiry Date is required';
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
                      size="small"
                      type="date"
                      value={field.value ? field.value.split('T')[0] : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                      error={!!errors.licenseExpiry}
                      helperText={errors.licenseExpiry?.message}
                      inputProps={{
                        min: new Date().toISOString().split('T')[0]
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  Total Experience
                </FormLabel>
                <Controller
                  name="totalExp"
                  control={control}
                  rules={{
                    required: 'Total Experience is required',
                    min: { value: 1, message: 'At least 1 year exp is required' },
                    max: { value: 40, message: 'Max 40 years exp is allowed' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="number"
                      error={!!errors.totalExp}
                      helperText={errors.totalExp?.message}
                      inputProps={{
                        min: 1,
                        max: 40
                      }}
                      onChange={(e) => {
                        let value = Number(e.target.value);
                        if (value > 40) value = 40;
                        if (value < 1) value = 1;
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  Date of Joining
                </FormLabel>
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
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>Reference/Notes</FormLabel>
                <Controller
                  name="notes"
                  control={control}
                  rules={{
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
                      error={!!errors.notes}
                      helperText={errors.notes?.message}
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
                  Address
                </FormLabel>
                <Controller
                  name="address"
                  control={control}
                  rules={{
                    required: 'Address is required',
                    minLength: { value: 5, message: 'Address must be at least 5 characters' },
                    maxLength: { value: 100, message: 'Address cannot exceed 100 characters' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth size="small">
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>Driver Status</FormLabel>
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
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>Driver Photo</FormLabel>
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
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>Driver Document</FormLabel>
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
