import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Grid, FormLabel, TextField, Button } from '@mui/material';
import { urls } from 'common/urls';
import { postApi , updateApi } from 'common/apiClient';

const AddVehicleGroupModal = ({ open, handleClose, refreshData, editItem }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setDescription(editItem.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [editItem]);

  const handleSubmit = async () => {
    if (!name || !description) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    
    try {
      let response;
      
      if (editItem) {
        response = await updateApi(urls.vehicleGroup.update, {
          id: editItem.id,
          name,
          description
        });
      } else {
        response = await postApi(urls.vehicleGroup.save, {
          name,
          description
        });
        console.log("API URL:", urls.vehicleGroup.create);

      }

      if (response?.status === 200 || response?.status === 201) {
        console.log(response);
        alert(editItem ? "Vehicle group updated!" : "Vehicle group added!");
        refreshData(); 
        handleClose();
      } else {
        throw new Error("API request failed!");
      }
    } catch (error) {
      alert("Failed to save vehicle group.");
    } finally {
      setLoading(false);
    }
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
          {editItem ? 'Edit' : 'Add'} Vehicle Group
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Name</FormLabel>
            <TextField fullWidth required value={name} onChange={(e) => setName(e.target.value)} size="small" />
          </Grid>
          <Grid item xs={12}>
            <FormLabel sx={{ fontWeight: 'bold', fontSize: '16px' }}>Description</FormLabel>
            <TextField fullWidth required value={description} onChange={(e) => setDescription(e.target.value)} size="small" />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : editItem ? 'Update' : 'Add'} Group
          </Button>
          <Button variant="outlined" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddVehicleGroupModal;
