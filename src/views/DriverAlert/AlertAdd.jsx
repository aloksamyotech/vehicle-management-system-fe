import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Grid,
  Button,
  TextField,
  Box,
  FormLabel,
  FormControl,
  Typography,
  Autocomplete
} from '@mui/material';
import toast from 'react-hot-toast';
import { postApi, getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTranslation } from 'react-i18next';

const AddDriverReminderForm = ({ onSave, onCancel, refreshData }) => {
  const { t } = useTranslation();
  const [drivers, setDrivers] = useState([]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      driverId: '',
      reminderDate: '',
      message: ''
    },
    mode: 'all'
  });

  useEffect(() => {
    const fetchDrivers = async () => {
      const response = await getApi(`${urls.driver.get}?all=true`);
      setDrivers(response?.data?.driverDetails || []);
    };

    fetchDrivers();
  }, []);

  const onSubmit = async (data) => {
  
    
    // const response = await postApi(urls.reminder.create, data);
    toast.success(t('text.REM_ADDED'));

    onSave();
    refreshData();
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {/* Driver Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
              {t('text.DRIVER')}
            </FormLabel>
            <Controller
              name="driverId"
              control={control}
              rules={{ required: t('text.REQUIRED') }}
              render={({ field }) => (
                <Autocomplete
                  options={drivers}
                  getOptionLabel={(option) =>
                    option.driverName || option.name || ''
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.id === value
                  }
                  onChange={(_, newValue) =>
                    field.onChange(newValue?.id || '')
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder={t('text.SELECT_DRIVER')}
                      error={!!errors.driverId}
                      helperText={errors.driverId?.message}
                    />
                  )}
                />
              )}
            />
          </FormControl>
        </Grid>

        {/* Reminder Date */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
              {t('text.DATE')}
            </FormLabel>
            <Controller
              name="reminderDate"
              control={control}
              rules={{ required: t('text.REQUIRED') }}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    {...field}
                    value={field.value ? new Date(field.value) : null}
                    onChange={(newValue) =>
                      field.onChange(
                        newValue ? newValue.toISOString() : null
                      )
                    }
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

        {/* Reminder Message */}
        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>
            {t('text.MESSAGE')}
          </FormLabel>
          <Controller
            name="message"
            control={control}
            rules={{
              required: t('text.REQUIRED'),
              maxLength: { value: 200, message: t('text.MAX_200_CHAR') }
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

      {/* Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : t('text.ADD')} {t('text.REM')}
        </Button>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          {t('text.CANCEL')}
        </Button>
      </Box>
    </Box>
  );
};

export default AddDriverReminderForm;
