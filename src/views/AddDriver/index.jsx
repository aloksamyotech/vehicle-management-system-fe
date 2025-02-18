import React, { useState } from 'react';
import {
  Grid,
  Button,
  TextField,
  Input,
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
import { Link } from 'react-router-dom';
import { gridSpacing } from 'config.js';

const DriverForm = () => {
  const [driverData, setDriverData] = useState({
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDriverData({ ...driverData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDriverData({ ...driverData, [name]: files[0] });
  };

  const handleSubmit = () => {
    console.log(driverData);
    resetForm();
  };

  return (
    <>
       <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 0, 
          m: 0 
        }}
      >
        <Typography variant="h3" sx={{ m: 0 }}>
        Add Driver
        </Typography>
        <Breadcrumbs
          separator="/"
          aria-label="breadcrumb"
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0,
            m: 0,
          }}
        >
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">
              Dashboard
            </Typography>
          </MuiLink>
          <Typography color="text.primary">
             Add Driver
          </Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ maxWidth: 'auto',mt:3, padding: 1 }}>
        <CardContent>
          <Grid container spacing={gridSpacing}>
             <Grid item xs={12} sm={4} md={3}>
              <FormLabel sx={{ fontWeight: 'bold' , fontSize: '16px'}}>Driver Name*</FormLabel>
              <TextField fullWidth value={driverData.driverName} onChange={handleChange} name="driverName" size="small" />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <FormLabel sx={{ fontWeight: 'bold' , fontSize: '16px'}}>Mobile*</FormLabel>
              <TextField fullWidth value={driverData.mobile} onChange={handleChange} name="mobile" size="small" />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <FormLabel sx={{ fontWeight: 'bold' , fontSize: '16px'}}>Age*</FormLabel>
              <TextField fullWidth value={driverData.age} onChange={handleChange} name="age" size="small" />
            </Grid>
             <Grid item xs={12} sm={4} md={3}>
              <FormLabel sx={{ fontWeight: 'bold' , fontSize: '16px'}}>License No*</FormLabel>
              <TextField fullWidth value={driverData.licenseNo} onChange={handleChange} name="licenseNo" size="small" />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <FormLabel sx={{ fontWeight: 'bold' , fontSize: '16px'}}>License Expiry Date*</FormLabel>
              <TextField
                fullWidth
                type="date"
                value={driverData.licenseExpiryDate}
                onChange={handleChange}
                name="licenseExpiryDate"
                size="small"
              />
            </Grid>
              <Grid item xs={12} sm={4} md={3}>
              <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Total Experience*</FormLabel>
              <TextField fullWidth value={driverData.totalExperience} onChange={handleChange} name="totalExperience" size="small" />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Date of Joining*</FormLabel>
              <TextField fullWidth type="date" value={driverData.dateOfJoining} onChange={handleChange} name="dateOfJoining" size="small" />
            </Grid>
           <Grid item xs={12} sm={4} md={3}>
              <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Reference/Notes</FormLabel>
              <TextField fullWidth value={driverData.referenceNotes} onChange={handleChange} name="referenceNotes" size="small" />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth size="small">
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Driver Status</FormLabel>
                <Select value={driverData.driverStatus} onChange={handleChange} name="driverStatus">
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
             <Grid item xs={12} sm={4} md={3}>
              <FormLabel sx={{ fontWeight: 'bold' , fontSize: '16px'}}>Driver Photo</FormLabel>
              <TextField
                fullWidth
                type="file"
                inputProps={{ accept: 'image/*' }}
                onChange={handleFileChange}
                name="driverPhoto"
                size="small"
                sx={{ mb: 1 }}
              />
            </Grid>
             <Grid item xs={12} sm={4} md={3}>
              <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Driver Document</FormLabel>
              <TextField
               fullWidth
                type="file"
                onChange={handleFileChange}
                name="driverDocument"
                size="small"
                inputProps={{ accept: 'application/pdf, image/*' }}
                sx={{ mb: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Address*</FormLabel>
              <TextField fullWidth value={driverData.address} onChange={handleChange} name="address" size="small" multiline rows={2} />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Add Driver
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default DriverForm;
