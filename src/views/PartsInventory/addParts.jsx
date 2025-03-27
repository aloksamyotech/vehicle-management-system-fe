import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Button, TextField, Box, FormLabel, FormControl, Select, MenuItem } from '@mui/material';
import { urls } from 'common/urls';
import { postApi, updateApiPatch } from 'common/apiClient';
import toast from 'react-hot-toast';
import { text } from 'common/constant';

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
    let response;
    const inventoryData = { ...data };

    if (initialData?.id) {
      response = await updateApiPatch(urls.partsInventory.update.replace(':id', initialData.id), inventoryData);
      toast.success(text.PARTS_UPDATED);
    } else {
      response = await postApi(urls.partsInventory.create, inventoryData);
      toast.success(text.PARTS_ADDED);
    }

    onSave(response.data);
    refreshData();
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
            {text.NAME}
          </FormLabel>
          <Controller
            name="name"
            control={control}
            rules={{
              required: text.REQUIRED,
              maxLength: { value: 30, message: text.MAX_30_CHAR },
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
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
            {text.stock}
          </FormLabel>
          <Controller
            name="stock"
            control={control}
            rules={{
              required: text.REQUIRED,
              min: { value: 1, message: text.MIN_1_STOCK },
              max: { value: 1000, message: text.MAX_1000_STOCK }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                type="number"
                inputProps={{ min: 1, max: 1000 }}
                error={!!errors.stock}
                helperText={errors.stock?.message}
                onChange={(e) => {
                  let value = Number(e.target.value);
                  if (value > 1000) value = 1000;
                  if (value < 1) value = 1;
                  field.onChange(value);
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{text.STATUS}</FormLabel>
          <FormControl fullWidth>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} size="small">
                  <MenuItem value="Active">{text.ACTIVE}</MenuItem>
                  <MenuItem value="Inactive">{text.INACTIVE}</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{text.DESCRIPTION}</FormLabel>
          <Controller
            name="description"
            control={control}
            rules={{
              validate: (value) => {
                if (!value.trim()) return text.REQUIRED;
                const wordCount = value.trim().split(/\s+/).length;
                return wordCount <= 100 || text.MAX_100_CHAR;
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
          {initialData?.id ? text.update : text.add} {text.parts}
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          {text.CANCEL}
        </Button>
      </Box>
    </Box>
  );
};

export default AddPartForm;
