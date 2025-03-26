import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Button, TextField, FormControl, Select, MenuItem, FormLabel, Box, Typography, Card, CardContent } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { gridSpacing } from 'config.js';
import { urls } from 'common/urls';
import { postApi, updateApiPatch } from 'common/apiClient';
import toast from 'react-hot-toast';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant';

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
      toast.success(text.DRIVER_UPDATED);
    } else {
      response = await postApi(urls.driver.create, filteredData);
      toast.success(text.DRIVER_ADDED);
    }

    reset();
    navigate('/drivers');
  };

  return (
    <>
      <CustomBreadcrumbs
        title={id ? text.EDIT_DRIVER : text.ADD_DRIVER}
        links={[
          { name: text.DRIVER, path: '/drivers' },
          { name: id ? text.EDIT_DRIVER : text.ADD_DRIVER, path: '' }
        ]}
      />

      <Card sx={{ maxWidth: 'auto', mt: 3, padding: 1 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                {text.DRIVER_NAME}
                </FormLabel>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: text.REQUIRED,
                    minLength: { value: 3, message: text.MIN_3_CHAR },
                    maxLength: { value: 50, message: text.MAX_50_CHAR },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: text.ALPHABETS_ONLY
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
                  {text.MOBILE}
                </FormLabel>
                <Controller
                  name="mobileNo"
                  control={control}
                  rules={{
                    required: text.REQUIRED,
                    minLength: { value: 10, message: text.MIN_10_DIGIT },
                    maxLength: { value: 12, message: text.MAX_12_DIGIT },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: text.NUMBERS_ONLY
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
                  {text.AGE}
                </FormLabel>
                <Controller
                  name="age"
                  control={control}
                  rules={{
                    required: text.REQUIRED,
                    min: { value: 18, message: text.MIN_18_AGE },
                    max: { value: 50, message: text.MAX_50_AGE }
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
              {text.LICENSE_NO}
                </FormLabel>
                <Controller
                  name="licenseNo"
                  control={control}
                  rules={{
                    required: text.REQUIRED,
                    minLength: { value: 6, message: text.MIN_6_CHAR },
                    maxLength: { value: 14, message: text.MAX_14_CHAR },
                    pattern: {
                      value: /^[A-Za-z0-9]+$/,
                      message: text.ALPHA_NUM
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
                {text.LICENSE_EXP_DATE}
                </FormLabel>
                <Controller
                  name="licenseExpiry"
                  control={control}
                  rules={{
                    required: text.REQUIRED,
                    validate: (value) => {
                      if (!value) return text.REQUIRED;
                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return selectedDate >= today;
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
                 {text.TOTAL_EXP}
                </FormLabel>
                <Controller
                  name="totalExp"
                  control={control}
                  rules={{
                    required: text.REQUIRED,
                    min: { value: 1, message: text.MIN_1_EXP },
                    max: { value: 40, message: text.MAX_40_EXP }
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
                {text.DATE_OF_JOINING}
                </FormLabel>
                <Controller
                  name="dateOfJoining"
                  control={control}
                  rules={{ required: text.REQUIRED }}
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
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{text.NOTES}</FormLabel>
                <Controller
                  name="notes"
                  control={control}
                  rules={{
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: text.ALPHABETS_ONLY
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
                  {text.ADDRESS}
                </FormLabel>
                <Controller
                  name="address"
                  control={control}
                  rules={{
                    required: text.REQUIRED,
                    minLength: { value: 3, message: text.MIN_3_CHAR },
                    maxLength: { value: 100, message: text.MAX_100_CHAR}
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
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{text.STATUS}</FormLabel>
                  <Controller
                    name="status"
                    control={control}
                    defaultValue="Active"
                    rules={{ required: text.REQUIRED }}
                    render={({ field }) => (
                      <Select {...field} error={!!errors.status}>
                        <MenuItem value="Active">{text.ACTIVE}</MenuItem>
                        <MenuItem value="Inactive">{text.INACTIVE}</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{text.PHOTO}</FormLabel>
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
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{text.DOCUMENT}</FormLabel>
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
                {id ? text.update : text.add} {text.DRIVER}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default DriverForm;
