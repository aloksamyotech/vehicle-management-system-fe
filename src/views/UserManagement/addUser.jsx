import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, FormLabel, Grid, Box } from '@mui/material';

const AddUserForm = ({ onSave, onCancel, initialData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key, initialData[key]);
      });
    }
  }, [initialData, setValue]);

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Name</FormLabel>
          <TextField
            fullWidth
            {...register('name', { required: 'Name is required' })}
            size="small"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Email</FormLabel>
          <TextField
            fullWidth
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
            })}
            size="small"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Username</FormLabel>
          <TextField
            fullWidth
            {...register('username', { required: 'Username is required' })}
            size="small"
            error={!!errors.username}
            helperText={errors.username?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Password</FormLabel>
          <TextField
            fullWidth
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
            size="small"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          {initialData ? 'Update' : 'Add'} User
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddUserForm;
