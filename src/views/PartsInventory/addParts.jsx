import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Button, TextField, Box, FormLabel, FormControl, Select, MenuItem } from '@mui/material';
import { urls } from 'common/urls';
import { postApi, updateApiPatch } from 'common/apiClient';
import toast from 'react-hot-toast';

const AddPartForm = ({ initialData, onSave, refreshData, onCancel }) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      stock: '',
      status: 'Active'
    },
    mode: 'all'
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        description: initialData.description || '',
        stock: initialData.stock || '',
        status: initialData.status || ''
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    try {
      let response;
      const inventoryData = { ...data };

      if (initialData?.id) {
        response = await updateApiPatch(urls.partsInventory.update.replace(':id', initialData.id), inventoryData);
        toast.success('Parts inventory updated successfully!');
      } else {
        response = await postApi(urls.partsInventory.create, inventoryData);
        toast.success('Parts inventory added successfully!');
      }

      onSave(response.data);
      refreshData();
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Name</FormLabel>
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Name is required',
              maxLength: { value: 30, message: 'Max 30 characters' },
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: 'Only alphabets are allowed'
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
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Stock</FormLabel>
          <Controller
            name="stock"
            control={control}
            rules={{ required: 'Stock is required', max: { value: 1000, message: 'Stock must be below 1000' } }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                type="number"
                inputProps={{ min: 1, max: 1000 }}
                error={!!errors.stock}
                helperText={errors.stock?.message}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Status</FormLabel>
          <FormControl fullWidth>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} size="small">
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Parts Description</FormLabel>
          <Controller
            name="description"
            control={control}
            rules={{
              validate: (value) => {
                if (!value.trim()) return 'Description is required';
                const wordCount = value.trim().split(/\s+/).length;
                return wordCount <= 100 || 'Description must be at most 100 words';
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                multiline
                rows={2}
                fullWidth
                inputRef={field.ref}
                onChange={(e) => {
                  const alphabeticValue = e.target.value.replace(/[^A-Za-z\s]/g, '');
                  field.onChange(alphabeticValue);
                }}
                error={!!errors.description}
                helperText={errors.description?.message}
                onKeyPress={(e) => {
                  if (!/[A-Za-z\s]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" type="submit" disabled={isSubmitting}>
          {initialData ? 'Update Parts' : 'Add Parts'}
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddPartForm;
