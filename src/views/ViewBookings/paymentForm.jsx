import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, Box, TextField, Button, Snackbar } from '@mui/material';
import { urls } from 'common/urls';
import { postApi } from 'common/apiClient';
import { text } from 'common/constant';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const PaymentDialog = ({ open, handleClose, totalAmount, bookingId, handleAddPayment, excess ,fetchPaymentData}) => {
    const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      paidAmount: 0,
      notes: ''
    }
  });

  const paidAmount = watch('paidAmount');
  const pendingAmount = excess;

  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data) => {
    if (data.paidAmount > totalAmount) {
      toast.error(t('text.AMT_ERROR'));
      return;
    }
    setLoading(true);
    const paymentData = {
      bookingId,
      paidAmount: data.paidAmount,
      pendingAmount: pendingAmount,
      notes: data.notes
    };

    const response = await postApi(urls.payment.create, paymentData);
    toast.success(t('text.PAYMENT_ADDED'));
    fetchPaymentData();
    handleAddPayment(paymentData);
    reset();
    handleClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '18px' }}>{t('text.MAKE_PAYMENT')}</DialogTitle>
        <DialogContent>
          <TextField label={t('text.TOTAL_AMOUNT')} fullWidth margin="dense" value={totalAmount} disabled />

          <Controller
            name="paidAmount"
            control={control}
            rules={{
              required: t('text.REQUIRED'),
              validate: {
                lessThanTotal: (value) => value <= totalAmount || t('text.AMT_ERROR')
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('text.PAID_AMOUNT')}
                type="number"
                fullWidth
                margin="normal"
                onChange={(e) => {
                  setValue('paidAmount', parseFloat(e.target.value) || 0);
                }}
                error={!!errors.paidAmount}
                helperText={errors.paidAmount?.message || ''}
              />
            )}
          />

          <TextField label="Pending Amount" fullWidth margin="normal" value={pendingAmount} disabled />

          <Controller
            name="notes"
            control={control}
            render={({ field }) => <TextField {...field} label={t('text.NOTES')} fullWidth margin="normal" multiline rows={2} />}
          />
        </DialogContent>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Button onClick={handleSubmit(onSubmit)} color="primary" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : t("text.SAVE_PAYMENT")}
          </Button>
          <Button onClick={handleClose} variant="outlined">
            {t('text.CANCEL')}
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default PaymentDialog;
