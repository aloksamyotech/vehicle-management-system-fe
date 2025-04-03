import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, FormControl, Select, MenuItem, Button } from '@mui/material';
import { updateApi } from 'common/apiClient';
import { urls } from 'common/urls';
import { text } from 'common/constant';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const BookingStatusDialog = ({ open, handleClose, bookingId, status, onStatusUpdate }) => {
  const { t } = useTranslation();
  const [tripStatus, setTripStatus] = useState(status || '');

  useEffect(() => {
    setTripStatus(status || '');
  }, [status]);

  const handleUpdateStatus = async () => {
    await updateApi(urls.booking.updateStatus.replace(':id', bookingId), { tripStatus });
    onStatusUpdate(tripStatus);
    toast.success(t('text.BOOKING_STATUS_UPDATED'));
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '18px' }}>{t('text.UPDATE_STATUS')}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <Select labelId="trip-status-label" value={tripStatus} onChange={(e) => setTripStatus(e.target.value)}>
            <MenuItem value="YetToStart">{t('text.YET_TO_START')}</MenuItem>
            <MenuItem value="Ongoing">{t('text.ONGOING')}</MenuItem>
            <MenuItem value="Completed">{t('text.COMPLETED')}</MenuItem>
            <MenuItem value="Cancelled">{t('text.CANCELLED')}</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        <Button onClick={handleUpdateStatus} color="primary" variant="contained">
          {t('text.UPDATE')}
        </Button>
        <Button onClick={handleClose} variant="outlined">
          {t('text.CANCEL')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default BookingStatusDialog;
