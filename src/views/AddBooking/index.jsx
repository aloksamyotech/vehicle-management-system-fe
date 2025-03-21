import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Grid,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormLabel,
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { gridSpacing } from 'config.js';

const DriverForm = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue,reset } = useForm();

  useEffect(() => {
    if (id) {
      setLoading(true);
        const bookingData = {
          customerName: 'Customer1',
          vehicle: 'Vehicle1',
          driver: 'Driver1',
          tripType: 'One Way',
          tripStartLocation: 'New York',
          tripEndLocation: 'Los Angeles',
          approxTotalKm: '4500',
          tripStartDate: '2024-04-10',
          tripEndDate: '2024-04-12',
          totalAmount: '2500',
          tripStatus: 'Scheduled',
          sendEmailConfirmation: true
        };

      setTimeout(() => {
        Object.keys(bookingData).forEach((key) => {
          setValue(key, bookingData[key]);
        });
        setLoading(false);
        console.log('Booking Data Loaded:', bookingData);
      }, 1000);
    }
  }, [id, setValue]);

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0, m: 0 }}>
        <Typography variant="h3">{id ? 'Edit Booking' : 'Add Booking'}</Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ display: 'flex', alignItems: 'center', p: 0, m: 0 }}>
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <Typography color="text.primary">Add Booking</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ maxWidth: 'auto', mt: 3, padding: 1 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacing}>
              {[
                { label: 'Customer Name*', name: 'customerName', type: 'select', options: ['Customer1', 'Customer2'] },
                { label: 'Vehicle*', name: 'vehicle', type: 'select', options: ['Vehicle1', 'Vehicle2'] },
                { label: 'Driver*', name: 'driver', type: 'select', options: ['Driver1', 'Driver2'] },
                { label: 'Trip Type*', name: 'tripType', type: 'select', options: ['One Way', 'Round Trip'] },
                { label: 'Trip Start Location*', name: 'tripStartLocation' },
                { label: 'Trip End Location*', name: 'tripEndLocation' },
                { label: 'Approx Total KM*', name: 'approxTotalKm' },
                { label: 'Trip Start Date*', name: 'tripStartDate', type: 'date' },
                { label: 'Trip End Date*', name: 'tripEndDate', type: 'date' },
                { label: 'Total Amount*', name: 'totalAmount' },
                { label: 'Trip Status*', name: 'tripStatus', type: 'select', options: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'] }
              ].map(({ label, name, type, options, ...rest }) => (
                <Grid item xs={12} sm={4} md={3} key={name}>
                  <FormLabel sx={{ fontSize: '14px', fontWeight: 700 }}>{label}</FormLabel>
                  {type === 'select' ? (
                    <FormControl fullWidth size="small">
                      <Select {...register(name)} defaultValue="">
                        {options.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField fullWidth size="small" type={type || 'text'} {...register(name)} {...rest} />
                  )}
                </Grid>
              ))}

              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox {...register('sendEmailConfirmation')} />}
                  label="Is need to send email confirmation after booking?"
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                {id ? 'Update Booking' : 'Add Booking'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default DriverForm;
