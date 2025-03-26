import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Button, TextField, Box, FormLabel, FormControl, Select, MenuItem, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { postApi, getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import { text } from 'common/constant';

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
                <Select {...field} size="small" displayEmpty>
                  <MenuItem value="" disabled>
                    {text.SELECT_VEHICLE}
                  </MenuItem>
                  {vehicles.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.vehicleName}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.vehicleId && <Typography color="error" sx={{ fontSize: '11px', mt: 0.5, ml: 2 }}>{errors.vehicleId.message}</Typography>}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
            {text.DATE}
          </FormLabel>
          <Controller
            name="reminderDate"
            control={control}
            rules={{ required: text.REQUIRED }}
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
