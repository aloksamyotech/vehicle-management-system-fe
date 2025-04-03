import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Grid, Button, TextField, Box, FormLabel, FormControl, Select, MenuItem, Typography, Autocomplete } from '@mui/material';
import toast from 'react-hot-toast';
import { postApi, getApi, updateApiPatch } from 'common/apiClient';
import { urls } from 'common/urls';
import { text } from 'common/constant';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTranslation } from 'react-i18next';

const IncomeExpenseForm = ({ initialData, onSave, refreshData, onCancel }) => {
  const { t } = useTranslation();
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
      const response = await getApi(urls.vehicle.get);
      setVehicles(response.data);
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
      toast.success(t('text.INC_EXP_UPDATED'));
    } else {
      response = await postApi(urls.incomeExpense.create, financeData);
      console.log(response);
      toast.success(t('text.INC_EXP_ADDED'));
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
            <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
              {t('text.VEHICLE')}
            </FormLabel>
            <Controller
              name="vehicleId"
              control={control}
              rules={{ required: t('text.REQUIRED') }}
              render={({ field }) => (
                <Autocomplete
                  options={vehicles}
                  getOptionLabel={(option) => option.vehicleName || ''}
                  isOptionEqualToValue={(option, value) => option.id === value}
                  value={vehicles.find((v) => v.id === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder={t('text.SELECT_VEHICLE')}
                      error={!!errors.vehicleId}
                      helperText={errors.vehicleId?.message}
                    />
                  )}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth size="small">
            <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
              {t('text.TYPE')}
            </FormLabel>
            <Controller
              name="type"
              control={control}
              rules={{ required: t('text.REQUIRED') }}
              render={({ field }) => (
                <Select {...field} displayEmpty size="small" error={!!errors.type}>
                  <MenuItem value="" disabled>
                    {t('text.SELECT_TYPE')}
                  </MenuItem>
                  <MenuItem value="Income">{t('text.INCOME')}</MenuItem>
                  <MenuItem value="Expense">{t('text.EXPENSE')}</MenuItem>
                </Select>
              )}
            />
            {errors.type && (
              <Typography color="error" sx={{ fontSize: '11px', mt: 0.5 }}>
                {errors.type.message}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
            {t('text.DATE')}
          </FormLabel>
          <Controller
            name="date"
            control={control}
            defaultValue={new Date()}
            rules={{ required: t('text.REQUIRED') }}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  {...field}
                  disablePast
                  value={field.value ? new Date(field.value) : null}
                  onChange={(newValue) => field.onChange(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth size="small" error={!!errors.date} helperText={errors.date?.message} />
                  )}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
            {t('text.AMOUNT')}
          </FormLabel>
          <Controller
            name="amount"
            control={control}
            rules={{
              required: t('text.REQUIRED'),
              min: { value: 0.01, message: t('text.GREATER_THAN_0') }
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
          {errors.amount && (
            <Typography color="error" sx={{ fontSize: '11px', mt: 0.5 }}>
              {errors.amount.message}
            </Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.DESCRIPTION')}</FormLabel>
          <Controller
            name="description"
            control={control}
            rules={{
              validate: (value) => {
                if (!value.trim()) return t('text.REQUIRED');
                const wordCount = value.trim().split(/\s+/).length;
                return wordCount <= 100 || t('text.MAX_100_CHAR');
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
          {initialData?.id ? t('text.UPDATE') : t('text.ADD')} {t('text.INCOME_EXPENSE')}
        </Button>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          {t('text.CANCEL')}
        </Button>
      </Box>
    </Box>
  );
};

export default IncomeExpenseForm;
