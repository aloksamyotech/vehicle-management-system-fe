import React,{useState,useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Grid,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  FormLabel,
  Typography,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
  Card,
  CardContent
} from '@mui/material';
import { Link , useParams} from 'react-router-dom';
import { gridSpacing } from 'config.js';

const VehicleForm = () => {
  const { id } = useParams();  
  const [loading, setLoading] = useState(false);

  const {
    register, handleSubmit, control, setValue, watch, reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      registrationNumber: '',
      vehicleName: '',
      model: '',
      chassisNo: '',
      engineNo: '',
      manufacturedBy: '',
      vehicleType: '',
      vehicleColor: '#D6E1F3',
      registrationExpiryDate: '',
      vehicleGroup: '',
      vehicleImage: null,
      vehicleDocument: null,
      traccarDeviceId: '',
      gpsApiUrl: 'https://codeforts.com/vms/api',
      apiUsername: '',
      apiPassword: ''
    }
  });
  const vehicleColor = watch('vehicleColor');

  useEffect(() => {
    if (id) {
      setLoading(true);
     
      const vehicleData = {
        registrationNumber: "ABC123",
        vehicleName: "Test Vehicle",
        model: "2024",
        chassisNo: "CH123456",
        engineNo: "EN987654",
        manufacturedBy: "Test Manufacturer",
        vehicleType: "car",
        vehicleColor: "#FF5733",
        registrationExpiryDate: "2025-12-31",
        vehicleGroup: "Fleet A",
        vehicleImage: null,
        vehicleDocument: null,
        traccarDeviceId: "12345",
        gpsApiUrl: "https://codeforts.com/vms/api",
        apiUsername: "testUser",
        apiPassword: "testPass",
      };
  
      setTimeout(() => {
        Object.keys(vehicleData).forEach((key) => {
          setValue(key, vehicleData[key]);
        });
        setLoading(false);
        console.log("Vehicle Data Loaded:", vehicleData); 
      }, 1000);  
    }
  }, [id, setValue]);
  

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);  
  };
  

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h3">{id ? 'Edit Vehicle' : 'Add Vehicle'}</Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <Typography color="text.primary">Add Vehicle</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ mt: 3, padding: 1 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Registration Number</FormLabel>
                <TextField
                  fullWidth
                  size="small"
                  {...register('registrationNumber', { required: true })}
                  error={!!errors.registrationNumber}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Vehicle Name</FormLabel>
                <TextField fullWidth size="small" {...register('vehicleName', { required: true })} error={!!errors.vehicleName} />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Model</FormLabel>
                <TextField fullWidth size="small" {...register('model', { required: true })} error={!!errors.model} />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Chassis No</FormLabel>
                <TextField fullWidth size="small" {...register('chassisNo')} />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Engine No</FormLabel>
                <TextField fullWidth size="small" {...register('engineNo')} />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Manufactured By</FormLabel>
                <TextField fullWidth size="small" {...register('manufacturedBy')} />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth>
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Vehicle Type</FormLabel>
                  <Controller
                    name="vehicleType"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} size="small">
                        <MenuItem value="car">CAR</MenuItem>
                        <MenuItem value="bus">BUS</MenuItem>
                        <MenuItem value="taxi">TAXI</MenuItem>
                        <MenuItem value="motorcycle">MOTORCYCLE</MenuItem>
                        <MenuItem value="truck">TRUCK</MenuItem>
                        <MenuItem value="bicycle">BICYCLE</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Vehicle Color</FormLabel>
                <TextField fullWidth type="color" {...register('vehicleColor')} size="small" />
                <Typography sx={{ mt: 1, color: '#000' }}>{vehicleColor}</Typography>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Registration Expiry Date</FormLabel>
                <TextField fullWidth type="date" size="small" {...register('registrationExpiryDate')} />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Vehicle Image</FormLabel>
                <TextField fullWidth type="file" size="small" {...register('vehicleImage')} />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Vehicle Document</FormLabel>
                <TextField fullWidth type="file" size="small" {...register('vehicleDocument')} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  GPS API Details(Feed GPS Data)
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>GPS API URL</FormLabel>
                <TextField fullWidth size="small" {...register('gpsApiUrl')} />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>API Username</FormLabel>
                <TextField fullWidth size="small" {...register('apiUsername')} />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>API Password</FormLabel>
                <TextField fullWidth type="password" size="small" {...register('apiPassword')} />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                {id ? 'Update Vehicle' : 'Add Vehicle'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default VehicleForm;
