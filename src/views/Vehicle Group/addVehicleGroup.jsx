import React, { useEffect } from 'react';
import { Modal, Box, Typography, Grid, FormLabel, TextField, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { urls } from 'common/urls';
import { postApi, updateApiPatch } from 'common/apiClient';
import toast from 'react-hot-toast';
import { text } from 'common/constant';

const AddVehicleGroupModal = ({ open, handleClose, refreshData, editItem }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      description: ''
    },
    mode: 'all'
  });

  useEffect(() => {
    if (open) {
      if (editItem) {
        reset({
          name: editItem.name || '',
          description: editItem.description || ''
        });
      } else {
        reset({
          name: '',
          description: ''
        });
      }
    }
  }, [editItem, open, reset]);

  const onSubmit = async (data) => {
    if (editItem?.id) {
      await updateApiPatch(urls.vehicleGroup.update.replace(':id', editItem.id), data);
      toast.success(text.GROUP_UPDATED);
    } else {
      await postApi(urls.vehicleGroup.create, data);
      toast.success(text.GROUP_ADDED);
    }

    handleClose();
    refreshData();
    reset();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: 400
        }}
      >
        <Typography variant="h5" mb={2}>
          {editItem ? text.edit : text.add} {text.vehicleGroup}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }} required>{text.NAME}</FormLabel>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: text.REQUIRED,
                  maxLength: { value: 30, message: text.MAX_30_CHAR},
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: text.ALPHABETS_ONLY
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
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    onKeyPress={(e) => {
                      if (!/[A-Za-z\s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <FormLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{text.DESCRIPTION}</FormLabel>
              <Controller
                name="description"
                control={control}
                rules={{
                  validate: (value) => {
                    if (!value.trim()) return text.REQUIRED;
                    const wordCount = value.trim().split(/\s+/).length;
                    return wordCount <= 100 || text.MAX_100_CHAR;
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    rows={2}
                    fullWidth
                    inputRef={field.ref}
                    onChange={(e) => {
                      const alphabeticValue = e.target.value.replace(/[^A-Za-z\s]/g, '');
                      field.onChange(alphabeticValue);
                    }}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    onKeyPress={(e) => {
                      if (!/[A-Za-z\s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : editItem?.id ? text.update : text.add} {text.vehicleGroup}
            </Button>
            <Button variant="outlined" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddVehicleGroupModal;
