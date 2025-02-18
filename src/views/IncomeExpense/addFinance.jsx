import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, MenuItem, FormControl, Box, Select, FormLabel, Grid } from '@mui/material';

const IncomeExpenseForm = ({ open, onClose, onSave, initialData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      vehicle: '',
      type: '',
      date: '',
      description: '',
      amount: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = (data) => {
    onSave(data);
    onClose();
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth size="small">
            <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Vehicle</FormLabel>
            <Select
              {...register('vehicle', { required: 'Vehicle is required' })}
              defaultValue=""
              size="small"
              error={!!errors.vehicle}
            >
              <MenuItem value="">Select Vehicle</MenuItem>
              <MenuItem value="Vehicle 1">Vehicle 1</MenuItem>
              <MenuItem value="Vehicle 2">Vehicle 2</MenuItem>
            </Select>
            {errors.vehicle && <span style={{ color: 'red' }}>{errors.vehicle.message}</span>}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth size="small">
            <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Type</FormLabel>
            <Select
              {...register('type', { required: 'Type is required' })}
              defaultValue=""
              size="small"
              error={!!errors.type}
            >
              <MenuItem value="">Select Type</MenuItem>
              <MenuItem value="Income">Income</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </Select>
            {errors.type && <span style={{ color: 'red' }}>{errors.type.message}</span>}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Date</FormLabel>
          <TextField
            fullWidth
            type="date"
            {...register('date', { required: 'Date is required' })}
            InputLabelProps={{ shrink: true }}
            size="small"
            error={!!errors.date}
            helperText={errors.date?.message}
          />
        </Grid>

        <Grid item xs={6}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Amount</FormLabel>
          <TextField
            fullWidth
            type="number"
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 1, message: 'Amount must be greater than 0' },
            })}
            size="small"
            error={!!errors.amount}
            helperText={errors.amount?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Description</FormLabel>
          <TextField
            fullWidth
            {...register('description')}
            size="small"
            multiline
            rows={2}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          {initialData ? 'Update' : 'Add'} Income Expense
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default IncomeExpenseForm;
