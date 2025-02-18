import React from 'react';
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
import { useForm, useFieldArray } from 'react-hook-form';
import { gridSpacing } from 'config';
import { Link } from 'react-router-dom';

const partsList = ["Part 1", "Part 2", "Part 3", "Part 4"];

const AddMaintenanceForm = () => {
  const { register, handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      vehicle: '',
      startDate: '',
      endDate: '',
      serviceDetails: '',
      totalCost: '',
      vendorName: '',
      status: '',
      parts: [{ partsName: '', qty: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "parts"
  });

  const onSubmit = (data) => {
    console.log('Submitted Data:', data);
  };

  const selectedParts = watch("parts").map((field) => field.partsName);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0, m: 0 }}>
        <Typography variant="h3" sx={{ m: 0 }}>Add Maintenance</Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <Typography color="text.primary">Add Maintenance</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ maxWidth: 'auto', mt: 3, padding: 1 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth required>
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Select Vehicle</FormLabel>
                  <Select {...register("vehicle")} defaultValue="" size="small">
                    <MenuItem value="Vehicle 1">Vehicle 1</MenuItem>
                    <MenuItem value="Vehicle 2">Vehicle 2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Maintenance Start Date*</FormLabel>
                <TextField fullWidth type="date" {...register("startDate")} size="small" required />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Maintenance End Date*</FormLabel>
                <TextField fullWidth type="date" {...register("endDate")} size="small" required />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Total Cost*</FormLabel>
                <TextField fullWidth type="number" {...register("totalCost")} size="small" required />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Vendor Name*</FormLabel>
                <TextField fullWidth {...register("vendorName")} size="small" required />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth required>
                  <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Maintenance Status</FormLabel>
                  <Select {...register("status")} defaultValue="" size="small">
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Service Details*</FormLabel>
                <TextField fullWidth {...register("serviceDetails")} size="small" required />
              </Grid>
              {fields.map((field, index) => (
                <React.Fragment key={field.id}>
                  <Grid item xs={6} sm={3} md={3}>
                    <FormControl fullWidth required>
                      <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Parts Name</FormLabel>
                      <Select
                        {...register(`parts.${index}.partsName`)}
                        defaultValue=""
                        size="small"
                      >
                        {partsList.filter(part => !selectedParts.includes(part) || part === field.partsName).map(part => (
                          <MenuItem key={part} value={part}>{part}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={2} md={2}>
                    <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Qty*</FormLabel>
                    <TextField fullWidth type="number" {...register(`parts.${index}.qty`)} size="small" required />
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
              <Button type="submit" variant="contained" color="primary">Add Maintenance</Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AddMaintenanceForm;

 