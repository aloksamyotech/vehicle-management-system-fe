import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import {
  Grid,
  Button,
  TextField,
  Box,
  Checkbox,
  FormLabel,
  Breadcrumbs,
  FormControlLabel,
  MenuItem,
  Link as MuiLink,
  Card,
  CardContent,
  Typography,
  Select,
  FormControl,
} from "@mui/material";
import { gridSpacing } from "config";
import { Link, useParams } from 'react-router-dom';

const FuelExpenseForm = ({ initialData = null, onSubmit }) => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      vehicle: "",
      driver: "",
      fuelFillDate: "",
      quantity: "",
      odometerReading: "",
      amount: "",
      comment: "",
      confirm: false,
    },
  });

  const confirmExpense = watch("confirm");

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => setValue(key, initialData[key]));
    }
  }, [initialData, setValue]);

  const onSubmitForm = (data) => {
    onSubmit(data); 
    reset();
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 0, m: 0 }}>
        <Typography variant="h3" sx={{ m: 0 }}>
          {id ? "Update Fuel" : "Add Fuel"}
        </Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <Typography color="text.primary">{initialData ? "Update Fuel" : "Add Fuel"}</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ maxWidth: "auto", mt: 3, padding: 1 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: "bold", fontSize: "16px" }}>Vehicle*</FormLabel>
                <FormControl fullWidth>
                  <Select {...register("vehicle", { required: true })} size="small">
                    <MenuItem value="">Select Vehicle</MenuItem>
                    <MenuItem value="Vehicle1">Vehicle 1</MenuItem>
                    <MenuItem value="Vehicle2">Vehicle 2</MenuItem>
                  </Select>
                </FormControl>
                {errors.vehicle && <Typography color="error">Vehicle is required</Typography>}
              </Grid>

               <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: "bold", fontSize: "16px" }}>Added Driver*</FormLabel>
                <FormControl fullWidth>
                  <Select {...register("driver", { required: true })} size="small">
                    <MenuItem value="">Select Driver</MenuItem>
                    <MenuItem value="Driver1">Driver 1</MenuItem>
                    <MenuItem value="Driver2">Driver 2</MenuItem>
                  </Select>
                </FormControl>
                {errors.driver && <Typography color="error">Driver is required</Typography>}
              </Grid>

             <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: "bold", fontSize: "16px" }}>Fuel Fill Date*</FormLabel>
                <TextField fullWidth required type="date" {...register("fuelFillDate", { required: true })} size="small" />
                {errors.fuelFillDate && <Typography color="error">Fuel fill date is required</Typography>}
              </Grid>

                <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: "bold", fontSize: "16px" }}>Quantity*</FormLabel>
                <TextField fullWidth required {...register("quantity", { required: true })} size="small" />
                {errors.quantity && <Typography color="error">Quantity is required</Typography>}
              </Grid>

               <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: "bold", fontSize: "16px" }}>Odometer Reading*</FormLabel>
                <TextField fullWidth required {...register("odometerReading", { required: true })} size="small" />
                {errors.odometerReading && <Typography color="error">Odometer reading is required</Typography>}
              </Grid>

               <Grid item xs={12} sm={4} md={3}>
                <FormLabel sx={{ fontWeight: "bold", fontSize: "16px" }}>Amount*</FormLabel>
                <TextField fullWidth required {...register("amount", { required: true })} size="small" />
                {errors.amount && <Typography color="error">Amount is required</Typography>}
              </Grid>

                <Grid item xs={12} sm={6} md={6}>
                <FormLabel sx={{ fontWeight: "bold", fontSize: "16px" }}>Comments</FormLabel>
                <TextField fullWidth {...register("comment")} size="small" />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox {...register("confirm")} />}
                  label="Need to add in expense?"
                />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button variant="contained" color="primary" type="submit">
                {id ? "Update Fuel" : "Add Fuel"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default FuelExpenseForm;
