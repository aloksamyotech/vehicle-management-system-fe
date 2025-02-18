import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Button, TextField, Box, FormLabel, FormControl } from '@mui/material';

const AddFuelReminderForm = ({ onSave, onCancel, initialData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      vehicle: '',
      date: '',
      message: '',
    },
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
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Vehicle</FormLabel>
          <TextField
            fullWidth
            size="small"
            {...register('vehicle', { required: 'Vehicle is required' })}
            error={!!errors.vehicle}
            helperText={errors.vehicle?.message}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Date</FormLabel>
          <TextField
            fullWidth
            type="date"
            size="small"
            {...register('date', { required: 'Date is required' })}
            error={!!errors.date}
            helperText={errors.date?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Message</FormLabel>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={3}
            {...register('message', { required: 'Message is required' })}
            error={!!errors.message}
            helperText={errors.message?.message}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button type="submit" variant="contained">
          Add Reminder
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddFuelReminderForm;
