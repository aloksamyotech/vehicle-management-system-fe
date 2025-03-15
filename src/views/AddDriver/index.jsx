import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
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
import { Link, useParams } from 'react-router-dom';
import { gridSpacing } from 'config.js';

const DriverForm = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      driverName: '',
      mobile: '',
      age: '',
      licenseNo: '',
      licenseExpiryDate: '',
      totalExperience: '',
      dateOfJoining: '',
      referenceNotes: '',
      address: '',
      driverStatus: '',
      driverPhoto: null,
      driverDocument: null
    }
  });

  useEffect(() => {
    if (id) {
      setLoading(true);

      const driverData = {
        driverName: 'John Doe',
        mobile: '45656532656',
        age: '20',
        licenseNo: 'L1234567',
        licenseExpiryDate: '2027-05-09',
        totalExperience: '5',
        dateOfJoining: '2024-02-01',
        referenceNotes: 'null',
        address: 'indore',
        driverStatus: 'active',
        driverPhoto: null,
        driverDocument: null
      };

      setTimeout(() => {
        Object.keys(driverData).forEach((key) => {
          setValue(key, driverData[key]);
        });
        setLoading(false);
        console.log('Driver Data Loaded:', driverData);
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
        <Typography variant="h3">{id ? 'Edit Driver' : 'Add Driver'}</Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
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
                { label: 'Driver Name', name: 'driverName' },
                { label: 'Mobile', name: 'mobile' },
                { label: 'Age', name: 'age' },
                { label: 'License No', name: 'licenseNo' },
                { label: 'License Expiry Date', name: 'licenseExpiryDate', type: 'date' },
                { label: 'Total Experience', name: 'totalExperience' },
                { label: 'Date of Joining', name: 'dateOfJoining', type: 'date' },
                { label: 'Reference/Notes', name: 'referenceNotes' },
                { label: 'Address', name: 'address', multiline: true, rows: 2 }
              ].map((field) => (
                <Grid item xs={12} sm={4} md={3} key={field.name}>
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>{field.label}*</FormLabel>
                  <TextField
                    fullWidth
                    size="small"
                    {...register(field.name)}
                    type={field.type || 'text'}
                    multiline={field.multiline}
                    rows={field.rows}
                  />
                </Grid>
              ))}
              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth size="small">
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Driver Status</FormLabel>
                  <Select {...register('driverStatus')}>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {[
                { label: 'Driver Photo', name: 'driverPhoto', accept: 'image/*' },
                { label: 'Driver Document', name: 'driverDocument', accept: 'application/pdf, image/*' }
              ].map((fileField) => (
                <Grid item xs={12} sm={4} md={3} key={fileField.name}>
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>{fileField.label}</FormLabel>
                  <TextField fullWidth size="small" type="file" {...register(fileField.name)} inputProps={{ accept: fileField.accept }} />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                {id ? 'Update Driver' : 'Add Driver'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default DriverForm;
