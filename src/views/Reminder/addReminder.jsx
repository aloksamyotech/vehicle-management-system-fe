import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Button, TextField, Box, FormLabel, FormControl, Select, MenuItem, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { postApi, getApi } from 'common/apiClient';
import { urls } from 'common/urls';

const AddFuelReminderForm = ({ onSave, onCancel, refreshData }) => {
  const [vehicles, setVehicles] = useState([]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      vehicleId: '',
      reminderDate: '',
      message: ''
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

  const onSubmit = async (data) => {
      const response = await postApi(urls.reminder.create, data);
      toast.success('Reminder added successfully!');

      onSave(response.data);
      refreshData();
      reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
              Vehicle
            </FormLabel>
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
            {errors.vehicleId && <Typography color="error">{errors.vehicleId.message}</Typography>}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>Date*</FormLabel>
          <Controller
            name="reminderDate"
            control={control}
            rules={{ required: 'Date is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="date"
                size="small"
                value={field.value ? field.value.split('T')[0] : ''}
                inputProps={{ min: new Date().toISOString().split('T')[0] }} 
                onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                error={!!errors.reminderDate}
                helperText={errors.reminderDate?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>Message</FormLabel>
          <Controller
            name="message"
            control={control}
            rules={{
              required: 'Message is required',
              maxLength: { value: 200, message: 'Max 200 characters allowed' }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                multiline
                rows={3}
                error={!!errors.message}
                helperText={errors.message?.message}
              />
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Add Reminder'}
        </Button>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddFuelReminderForm;
