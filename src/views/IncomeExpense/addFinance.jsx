import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Button, TextField, Box, FormLabel, FormControl, Select, MenuItem, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { postApi, getApi , updateApiPatch} from 'common/apiClient';
import { urls } from 'common/urls';

const IncomeExpenseForm = ({ initialData, onSave, refreshData, onCancel }) => {
  const [vehicles, setVehicles] = useState([]);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      vehicleId: '',
      type: '',
      date: '',
      description: '',
      amount: ''
    },
    mode: 'all'
  });

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
    if (initialData) {
      reset({
        vehicleId: initialData.vehicleId || '',
        type: initialData.type || '',
        date: initialData.date || '',
        amount: initialData.amount || '',
        description: initialData.description || ''
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
      let response;
      const financeData = { ...data };

      if (initialData?.id) {
        response = await updateApiPatch(urls.incomeExpense.update.replace(':id', initialData.id), financeData);
        toast.success('Income expense updated successfully!');
      } else {
        response = await postApi(urls.incomeExpense.create, financeData);
        toast.success('Income expense added successfully!');
      }

      onSave(response.data);
      refreshData();
      reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>Vehicle</FormLabel>
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
            {errors.vehicleId && <Typography color="error" sx={{ fontSize: '11px', mt: 0.5}}>{errors.vehicleId.message}</Typography>}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth size="small">
            <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>Type</FormLabel>
            <Controller
              name="type"
              control={control}
              rules={{ required: 'Type is required' }}
              render={({ field }) => (
                <Select {...field} displayEmpty size="small" error={!!errors.type}>
                  <MenuItem value="" disabled>Select Type</MenuItem>
                  <MenuItem value="Income">Income</MenuItem>
                  <MenuItem value="Expense">Expense</MenuItem>
                </Select>
              )}
            />
            {errors.type && <Typography color="error" sx={{ fontSize: '11px', mt: 0.5}}>{errors.type.message}</Typography>}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>Date</FormLabel>
          <Controller
            name="date"
            control={control}
            rules={{ required: 'Date is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="date"
                size="small"
                value={field.value ? field.value.split('T')[0] : ''}
                onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>Amount</FormLabel>
          <Controller
            name="amount"
            control={control}
            rules={{
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                required
                type="number"
                size="small"
                inputProps={{ step: '0.01' }}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            )}
          />
          {errors.amount && <Typography color="error" sx={{ fontSize: '11px', mt: 0.5}}>{errors.amount.message}</Typography>}
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>Description</FormLabel>
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
        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
          {initialData?.id ? 'Update' : 'Add'} Income Expense
        </Button>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default IncomeExpenseForm;
