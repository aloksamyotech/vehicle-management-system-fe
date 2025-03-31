import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, FormControl, Select, MenuItem, Button } from '@mui/material';
import { updateApi } from 'common/apiClient';
import { urls } from 'common/urls';
import { text } from 'common/constant';
import toast from 'react-hot-toast';

const BookingStatusDialog = ({ open, handleClose, bookingId, status, onStatusUpdate }) => {
  const [tripStatus, setTripStatus] = useState(status || '');

  useEffect(() => {
    setTripStatus(status || '');
  }, [status]);

  const handleUpdateStatus = async () => {
    await updateApi(urls.booking.updateStatus.replace(':id', bookingId), { tripStatus });
    onStatusUpdate(tripStatus);
    toast.success(text.BOOKING_STATUS_UPDATED);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '18px' }}>{text.UPDATE_STATUS}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <Select labelId="trip-status-label" value={tripStatus} onChange={(e) => setTripStatus(e.target.value)}>
            <MenuItem value="YetToStart">{text.YET_TO_START}</MenuItem>
            <MenuItem value="Ongoing">{text.ONGOING}</MenuItem>
            <MenuItem value="Completed">{text.COMPLETED}</MenuItem>
            <MenuItem value="Cancelled">{text.CANCELLED}</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        <Button onClick={handleUpdateStatus} color="primary" variant="contained">
          {text.update}
        </Button>
        <Button onClick={handleClose} variant="outlined">
          {text.CANCEL}
        </Button>
      </Box>
    </Dialog>
  );
};

export default BookingStatusDialog;
