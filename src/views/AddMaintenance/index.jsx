import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  TextField,
  Box,
  FormLabel,
  Breadcrumbs,
  Link as MuiLink,
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
import { Link, useNavigate } from 'react-router-dom';
import { gridSpacing } from 'config.js';
import { urls } from 'common/urls';
import { postApi, getApi } from 'common/apiClient';
import toast from 'react-hot-toast';

const AddMaintenanceForm = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [partsList, setPartsList] = useState([]);
  const [minEndDate, setMinEndDate] = useState('');
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
    const fetchParts = async () => {
      try {
        const response = await getApi(urls.partsInventory.get);
        setPartsList(response.data);
      } catch (error) {
        console.error('Error fetching parts:', error);
      }
    };

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
      toast.error('Please select at least one valid part.');
      return;
    }

    const finalData = {
      ...data,
      parts: formattedParts
    };

    let response = await postApi(urls.maintenance.create, finalData);
    toast.success('Maintenance added successfully');

    reset();
    navigate('/maintenance');
  };

  const selectedParts = watch('parts').map((field) => field.partsName);

  return (
    <>
      <Box 
       sx={{
        backgroundColor: '#ffff',
        padding: '10px',
        borderRadius: '8px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h4" sx={{ m: 0 }}>
          Add Maintenance
        </Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <MuiLink component={Link} to="/maintenance" color="inherit" underline="none">
            <Typography color="#17a2b8">Maintenance</Typography>
          </MuiLink>
          <Typography color="text.primary">Add Maintenance</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ maxWidth: 'auto', mt: 3, padding: 1 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={4} md={3}>
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

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  Maintenance Start Date
                </FormLabel>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: 'Start Date is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="date"
                      value={field.value ? field.value.split('T')[0] : ''}
                      onChange={(e) => {
                        const newStartDate = new Date(e.target.value).toISOString();
                        field.onChange(newStartDate);
                        setMinEndDate(e.target.value);
                      }}
                      error={!!errors.startDate}
                      helperText={errors.startDate?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  Maintenance End Date
                </FormLabel>
                <Controller
                  name="endDate"
                  control={control}
                  rules={{
                    required: 'End Date is required',
                    validate: (value) => {
                      const startDate = new Date(getValues('startDate'));
                      const endDate = new Date(value);
                      return endDate >= startDate || 'End Date must be after Start Date';
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="date"
                      inputProps={{ min: minEndDate }} 
                      value={field.value ? field.value.split('T')[0] : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                      error={!!errors.endDate}
                      helperText={errors.endDate?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  Total Cost
                </FormLabel>
                <Controller
                  name="totalCost"
                  control={control}
                  rules={{
                    required: 'Cost is required',
                    min: { value: 0.01, message: 'Cost must be greater than 0' },
                    max: { value: 10000000, message: 'Cost cannot exceed 10,000,000' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required
                      type="number"
                      size="small"
                      inputProps={{ step: '0.01', min: 0.01, max: 10000000 }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      error={!!errors.totalCost}
                      helperText={errors.totalCost?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>
                  Vendor Name
                </FormLabel>
                <Controller
                  name="vendorName"
                  control={control}
                  rules={{
                    required: 'Name is required',
                    maxLength: { value: 30, message: 'Max 30 characters' },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: 'Only alphabets are allowed'
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
                    Maintenance Status
                  </FormLabel>
                  <Select {...register('status')} defaultValue="" size="small">
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>Service Details</FormLabel>
                <Controller
                  name="details"
                  control={control}
                  rules={{maxLength: { value: 100, message: 'Max 100 characters' } }}
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
                        Parts Name
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
                        Qty
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
                Add Maintenance
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AddMaintenanceForm;
