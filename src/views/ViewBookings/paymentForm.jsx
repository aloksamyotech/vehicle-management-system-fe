import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, Box, TextField, Button } from '@mui/material';
import { text } from 'common/constant';

const PaymentDialog = ({ open, handleClose, totalAmount }) => {
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      paidAmount: 0,
      notes: ''
    }
  });

  const paidAmount = watch('paidAmount');
  const pendingAmount = totalAmount - (paidAmount || 0);

  const onSubmit = (data) => {
    console.log({ totalAmount, ...data, pendingAmount });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '18px' }}>{text.MAKE_PAYMENT}</DialogTitle>
      <DialogContent>
        <TextField label={text.TOTAL_AMOUNT} fullWidth margin="dense" value={totalAmount} disabled />
        <Controller
          name="paidAmount"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={text.PAID_AMOUNT}
              type="number"
              fullWidth
              margin="normal"
              onChange={(e) => {
                setValue('paidAmount', Number(e.target.value) || 0);
              }}
            />
          )}
        />
        <TextField label="Pending Amount" fullWidth margin="normal" value={pendingAmount} disabled />
        <Controller
          name="notes"
          control={control}
          render={({ field }) => <TextField {...field} label={text.NOTES} fullWidth margin="normal" multiline rows={2} />}
        />
      </DialogContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p:2 }}>
        <Button onClick={handleSubmit(onSubmit)} color="primary" variant="contained">
          {text.SAVE_PAYMENT}
        </Button>
        <Button onClick={handleClose} variant="outlined">
          {text.CANCEL}
        </Button>
      </Box>
    </Dialog>
  );
};

export default PaymentDialog;
