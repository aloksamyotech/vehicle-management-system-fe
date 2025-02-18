import React from 'react';
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
  CardContent
} from '@mui/material';
import { Link } from 'react-router-dom';
import { gridSpacing } from 'config.js';

const DriverForm = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0, m: 0 }}>
        <Typography variant="h3" sx={{ m: 0 }}>
          Add Driver
        </Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ display: 'flex', alignItems: 'center', p: 0, m: 0 }}>
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <Typography color="text.primary">Add Driver</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ maxWidth: 'auto', mt: 3, padding: 1 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacing}>
              {[
                { label: 'Driver Name*', name: 'driverName' },
                { label: 'Mobile*', name: 'mobile' },
                { label: 'Age*', name: 'age' },
                { label: 'License No*', name: 'licenseNo' },
                { label: 'License Expiry Date*', name: 'licenseExpiryDate', type: 'date' },
                { label: 'Total Experience*', name: 'totalExperience' },
                { label: 'Date of Joining*', name: 'dateOfJoining', type: 'date' },
                { label: 'Reference/Notes', name: 'referenceNotes' },
                { label: 'Address*', name: 'address', multiline: true, rows: 2 }
              ].map(({ label, name, type, ...rest }) => (
                <Grid item xs={12} sm={4} md={3} key={name}>
                  <FormLabel sx={{ fontSize: '16px', fontWeight: 700 }}>{label}</FormLabel>
                  <TextField fullWidth size="small" type={type || 'text'} {...register(name)} {...rest} />
                </Grid>
              ))}

              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth size="small">
                  <FormLabel sx={{ fontSize: '16px', fontWeight: 700 }}>Driver Status</FormLabel>
                  <Select {...register('driverStatus')} defaultValue="">
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {[{ label: 'Driver Photo', name: 'driverPhoto' }, { label: 'Driver Document', name: 'driverDocument' }].map(({ label, name }) => (
                <Grid item xs={12} sm={4} md={3} key={name}>
                  <FormLabel sx={{ fontSize: '16px', fontWeight: 700 }}>{label}</FormLabel>
                  <TextField fullWidth type="file" size="small" {...register(name)} sx={{ mb: 1 }} />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Add Driver
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default DriverForm;