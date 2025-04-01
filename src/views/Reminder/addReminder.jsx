import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Button, TextField, Box, FormLabel, FormControl, Select, MenuItem, Typography, Autocomplete } from '@mui/material';
import toast from 'react-hot-toast';
import { postApi, getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import { text } from 'common/constant';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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
      const response = await getApi(urls.vehicle.get);
      setVehicles(response.data);
    };

    fetchVehicles();
  }, []);

  const onSubmit = async (data) => {
    const response = await postApi(urls.reminder.create, data);
    toast.success(text.REM_ADDED);

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
              {text.VEHICLE}
            </FormLabel>
            <Controller
              name="vehicleId"
              control={control}
              rules={{ required: text.REQUIRED }}
              render={({ field }) => (
                <Autocomplete
                  options={vehicles}
                  getOptionLabel={(option) => option.vehicleName || ''}
                  isOptionEqualToValue={(option, value) => option.id === value}
                  onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder={text.SELECT_VEHICLE}
                      error={!!errors.vehicleId}
                      helperText={errors.vehicleId?.message}
                    />
                  )}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
              {text.DATE}
            </FormLabel>
            <Controller
              name="reminderDate"
              control={control}
              rules={{ required: text.REQUIRED }}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    {...field}
                    value={field.value ? new Date(field.value) : null}
                    onChange={(newValue) => field.onChange(newValue ? newValue.toISOString() : null)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        error={!!errors.reminderDate}
                        helperText={errors.reminderDate?.message}
                      />
                    )}
                    inputFormat="yyyy-MM-dd"
                    minDate={new Date()}
                  />
                </LocalizationProvider>
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{text.MESSAGE}</FormLabel>
          <Controller
            name="message"
            control={control}
            rules={{
              required: text.REQUIRED,
              maxLength: { value: 200, message: text.MAX_200_CHAR }
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
          {isSubmitting ? 'Saving...' : text.add} {text.REM}
        </Button>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          {text.CANCEL}
        </Button>
      </Box>
    </Box>
  );
};

export default AddFuelReminderForm;
