import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Button, TextField, Box, FormLabel, FormControl, Select, MenuItem } from '@mui/material';

const AddPartForm = ({ initialData, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      stock: '',
      status: 'Active'
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = (data) => {
    onSave(data);
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Name</FormLabel>
          <TextField
            fullWidth
            size="small"
            {...register('name', { required: 'Name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Stock</FormLabel>
          <TextField
            fullWidth
            size="small"
            type="number"
            {...register('stock', { required: 'Stock is required' })}
            error={!!errors.stock}
            helperText={errors.stock?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Status</FormLabel>
          <FormControl fullWidth>
            <Select {...register('status')} defaultValue="Active" onChange={(e) => setValue('status', e.target.value)} size="small">
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Parts Description</FormLabel>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={3}
            {...register('description', { required: 'Description is required' })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" type="submit">
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
