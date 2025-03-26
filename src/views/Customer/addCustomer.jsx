import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Button, TextField, Box, FormLabel } from '@mui/material';
import { postApi, updateApiPatch } from 'common/apiClient';
import { urls } from 'common/urls';
import toast from 'react-hot-toast';
import { text } from 'common/constant';

const AddCustomerForm = ({ initialData, onSave, refreshData, onCancel }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobileNo: '',
      address: ''
    },
    mode: 'all'
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        email: initialData.email || '',
        mobileNo: initialData.mobileNo || '',
        address: initialData.address || ''
      });
    }
  }, [initialData, reset]);
  
  const onSubmit = async (data) => {
      let response;
      const financeData = { ...data };

      if (initialData?.id) {
        response = await updateApiPatch(urls.customer.update.replace(':id', initialData.id), financeData);
        toast.success(text.CUSTOMER_UPDATED);
      } else {
        response = await postApi(urls.customer.create, financeData);
        toast.success(text.CUSTOMER_ADDED);
      }

      onSave(response.data);
      refreshData();
      reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{text.NAME}</FormLabel>
          <Controller
            name="name"
            control={control}
            rules={{
              required: text.REQUIRED,
              maxLength: { value: 30, message: text.MAX_30_CHAR},
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: text.ALPHABETS_ONLY
              }
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                fullWidth
                size="small"
                inputRef={ref}
                value={value}
                onChange={(e) => {
                  const alphabeticValue = e.target.value.replace(/[^A-Za-z\s]/g, '');
                  onChange(alphabeticValue);
                }}
                onBlur={onBlur}
                error={!!errors.name}
                helperText={errors.name?.message}
                onKeyPress={(e) => {
                  if (!/[A-Za-z\s]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{text.EMAIL}</FormLabel>
          <Controller
            name="email"
            control={control}
            rules={{
              required: text.REQUIRED,
              pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: text.INVALID_FORMAT}
            }}
            render={({ field }) => (
              <TextField fullWidth size="small" type="email" {...field} error={!!errors.email} helperText={errors.email?.message} />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{text.PHONE}</FormLabel>
          <Controller
            name="mobileNo"
            control={control}
            rules={{
              required: text.REQUIRED,
              pattern: {
                value: /^[789]\d{9,11}$/,
                message: 'Must start with 7, 8, or 9 (10-12 digits only)'
              },
              maxLength: {
                value: 12,
                message: text.MAX_12_DIGIT
              }
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                fullWidth
                size="small"
                type="tel"
                inputRef={ref}
                value={value}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^0-9]/g, '');
                  onChange(numericValue);
                }}
                onBlur={onBlur}
                error={!!errors.mobileNo}
                helperText={errors.mobileNo?.message}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{text.ADDRESS}</FormLabel>
          <Controller
            name="address"
            control={control}
            rules={{ required:text.REQUIRED, maxLength: { value: 100, message: text.MAX_100_CHAR } }}
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
        <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : initialData?.id ? text.update : text.add} {text.CUSTOMER}
        </Button>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
         {text.CANCEL}
        </Button>
      </Box>
    </Box>
  );
};

export default AddCustomerForm;
