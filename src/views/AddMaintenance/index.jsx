import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  TextField,
  Autocomplete,
  Box,
  FormLabel,
  Card,
  CardContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { gridSpacing } from 'config.js';
import { urls } from 'common/urls';
import { postApi, getApi } from 'common/apiClient';
import toast from 'react-hot-toast';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTranslation } from 'react-i18next';

const AddMaintenanceForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [partsList, setPartsList] = useState([]);
  const [minEndDate, setMinEndDate] = useState(new Date());
  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      vehicleId: '',
      startDate: '',
      endDate: '',
      details: '',
      totalCost: '',
      vendorName: '',
      status: '',
      parts: [{ partsInventoryId: '', quantity: 1 }]
    },
    mode: 'all'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'parts'
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await getApi(`${urls.vehicle.get}?all=true`);
      setVehicles(response?.data?.vehicleDetails || []);
    };

    const fetchParts = async () => {
      const response = await getApi(`${urls.partsInventory.get}?all=true`);
      setPartsList(response?.data?.partsDetails || []);
    };

    fetchVehicles();
    fetchParts();
  }, []);

  const onSubmit = async (data) => {
    const formattedParts = data.parts
      .map((part) => {
        const selectedPart = partsList.find((p) => p.name === part.partsName);

        if (!selectedPart) return null;

        return {
          partsInventoryId: selectedPart.id,
          quantity: part.qty || 1
        };
      })
      .filter((part) => part !== null);

    if (formattedParts.length === 0) {
      toast.error(t('text.SELECT_ONE'));
      return;
    }

    const finalData = {
      ...data,
      parts: formattedParts
    };

    let response = await postApi(urls.maintenance.create, finalData);
    toast.success(t('text.MAINTENANCE_ADDED'));

    reset();
    navigate('/maintenance');
  };

  const selectedParts = watch('parts').map((field) => field.partsName);

  return (
    <>
      <CustomBreadcrumbs
        title={t('text.ADD_MAINTENANCE')}
        links={[
          { name: t('text.MAINTENANCE'), path: '/maintenance' },
          { name: t('text.ADD_MAINTENANCE'), path: '' }
        ]}
      />

      <Card sx={{ maxWidth: 'auto', mt: 3, padding: 1 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={4} md={3}>
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

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {t('text.START_DATE')}
                </FormLabel>
                <Controller
                  name="startDate"
                  control={control}
                  defaultValue={new Date()}
                  rules={{ required: t('text.REQUIRED') }}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        {...field}
                        renderInput={(props) => <TextField {...props} fullWidth size="small" error={!!error} helperText={error?.message} />}
                        value={field.value}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          setMinEndDate(newValue);
                        }}
                        minDateTime={new Date()}
                        PopperProps={{ placement: 'top-start' }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {t('text.END_DATE')}
                </FormLabel>
                <Controller
                  name="endDate"
                  control={control}
                  defaultValue={new Date()}
                  rules={{
                    required: t('text.REQUIRED'),
                    validate: (value) => {
                      const mainStartDate = new Date(getValues('startDate'));
                      const mainEndDate = new Date(value);
                      return mainEndDate >= mainStartDate || t('text.END_DATE_AFTER_START');
                    }
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        {...field}
                        renderInput={(props) => <TextField {...props} fullWidth size="small" error={!!error} helperText={error?.message} />}
                        value={field.value}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                        }}
                        minDateTime={minEndDate}
                        PopperProps={{ placement: 'top-start' }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {t('text.TOTAL_COST')}
                </FormLabel>
                <Controller
                  name="totalCost"
                  control={control}
                  rules={{
                    required: t('text.REQUIRED'),
                    min: { value: 0.1, message: t('text.GREATER_THAN_0') },
                    max: { value: 100000, message: t('text.CANNOT_EXCEED') }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required
                      type="number"
                      size="small"
                      inputProps={{ step: '0.01', min: 0.01, max: 100000 }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      error={!!errors.totalCost}
                      helperText={errors.totalCost?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  {t('text.VENDOR_NAME')}
                </FormLabel>
                <Controller
                  name="vendorName"
                  control={control}
                  rules={{
                    required: t('text.REQUIRED'),
                    maxLength: { value: 30, message: t('text.MAX_30_CHAR') },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: t('text.ALPHABETS_ONLY')
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
                      error={!!errors.vendorName}
                      helperText={errors.vendorName?.message}
                      onKeyPress={(e) => {
                        if (!/[A-Za-z\s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth required>
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                    {t('text.STATUS')}
                  </FormLabel>
                  <Select {...register('status')} defaultValue="" size="small">
                    <MenuItem value="Pending">{t('text.PENDING')}</MenuItem>
                    <MenuItem value="In Progress">{t('text.IN_PROGRESS')}</MenuItem>
                    <MenuItem value="Completed">{t('text.COMPLETED')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{t('text.SERVICE_DETAILS')}</FormLabel>
                <Controller
                  name="details"
                  control={control}
                  rules={{ maxLength: { value: 100, message: t('text.MAX_100_CHAR') } }}
                  render={({ field }) => (
                    <TextField fullWidth size="small" {...field} error={!!errors.details} helperText={errors.details?.message} />
                  )}
                />
              </Grid>

              {fields.map((field, index) => (
                <React.Fragment key={field.id}>
                  <Grid item xs={6} sm={3} md={3}>
                    <FormControl fullWidth required>
                      <FormLabel
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '14px',
                          color: 'black',
                          '&.Mui-focused': { color: 'black' }
                        }}
                      >
                        {t('text.PARTS')}
                      </FormLabel>

                      <Controller
                        name={`parts.${index}.partsName`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select {...field} size="small">
                            {partsList
                              .filter((part) => !selectedParts.includes(part.name) || part.name === field.value)
                              .map((part) => (
                                <MenuItem key={part._id} value={part.name}>
                                  {part.name}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6} sm={2} md={2}>
                    <FormControl fullWidth required>
                      <FormLabel
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '14px',
                          color: 'black',
                          '&.Mui-focused': { color: 'black' }
                        }}
                      >
                        {t('text.QTY')}
                      </FormLabel>

                      <Controller
                        name={`parts.${index}.qty`}
                        control={control}
                        defaultValue={1}
                        render={({ field }) => (
                          <Select {...field} size="small">
                            {[...Array(10)].map((_, i) => (
                              <MenuItem key={i + 1} value={i + 1}>
                                {i + 1}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={3} sm={1} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
                    {index === 0 ? (
                      <IconButton color="primary" onClick={() => append({ partsName: '', qty: 1 })}>
                        <AddCircleOutlineIcon />
                      </IconButton>
                    ) : (
                      <IconButton color="error" onClick={() => remove(index)}>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    )}
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                {t('text.ADD_MAINTENANCE')}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AddMaintenanceForm;
