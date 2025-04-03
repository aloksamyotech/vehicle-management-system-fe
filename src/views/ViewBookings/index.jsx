import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Table,
  Button,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Divider
} from '@mui/material';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import DeleteIcon from '@mui/icons-material/Delete';
import { text } from 'common/constant';
import { urls } from 'common/urls';
import { getApi, updateApi, postApi } from 'common/apiClient';
import PaymentDialog from './paymentForm';
import BookingStatusDialog from './bookingstatus';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const ViewBookingPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState([]);
  const [bookings, setBookings] = useState({});
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookingId, setBookingId] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [excess, setExcess] = useState(0);
  const [status, setStatus] = useState(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tripExpense, setTripExpense] = useState([]);
  const [bookingExpense, setBookingExpense] = useState({
    amount: '',
    description: ''
  });

  const handleOpenStatusDialog = (id, currentStatus) => {
    setSelectedBookingId(id);
    setStatus(currentStatus);
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
  };

  const handleStatusUpdate = (newStatus) => {
    console.log('Status Updated:', newStatus);
  };

  const fetchBookingData = async () => {
    const response = await getApi(urls.booking.getById.replace(':id', id));
    setBookings(response?.data);
    setBookingId(response?.data?.id || 0);
  };

  useEffect(() => {
    if (id) {
      fetchBookingData();
    }
  }, [id]);

  const fetchPaymentData = async () => {
    if (bookingId) {
      const response = await getApi(urls.payment.getById.replace(':id', bookingId));
      setPaymentData(response?.data || []);

      const totalPaidAmount = response?.data?.reduce((sum, payment) => sum + payment.paidAmount, 0) || 0;
      setTotalAmount(bookings.totalAmt || 0);
      setPaidAmount(totalPaidAmount);
      setExcess(bookings.totalAmt - totalPaidAmount);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchPaymentData();
    }
  }, [bookingId, bookings]);

  const handleOpenPaymentDialog = () => {
    setTotalAmount(bookings.totalAmt || 0);
    setBookingId(bookings.id || 0);
    setOpenPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
  };

  const handleAddPayment = (payment) => {
    setPaymentData((prevPayments) => [...prevPayments, payment]);
  };

  const handleOpenDialog = () => {
    setBookingExpense({
      amount: '',
      description: ''
    });
    setOpenDialog(true);
  };

  const handleAddExpense = async () => {
    const expenseData = {
      ...bookingExpense,
      bookingId
    };

    const response = await postApi(urls.tripExpense.create, expenseData);
    toast.success(t('text.BOOKING_EXP_ADDED'));
    fetchBookingData();
    handleCloseDialog();
  };

  const fetchTripExpenseData = async () => {
    if (bookingId) {
      const response = await getApi(urls.tripExpense.getById.replace(':id', bookingId));
      setTripExpense(response?.data || []);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchTripExpenseData();
    }
  }, [bookingId, bookings]);

  const handleDeleteExpense = async (expenseId) => {
    await updateApi(urls.tripExpense.update.replace(':id', expenseId));
    toast.success(t('text.BOOKING_EXP_DELETED'));
    fetchTripExpenseData();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeletePayment = async (paymentId) => {
    await updateApi(urls.payment.update.replace(':id', paymentId));
    toast.success(t('text.PAYMENT_DELETED'));
    fetchPaymentData();

    const updatedPayments = paymentData.filter((payment) => payment.id !== paymentId);
    setPaymentData(updatedPayments);

    const newPaidAmount = updatedPayments.reduce((sum, payment) => sum + payment.paidAmount, 0);
    setPaidAmount(newPaidAmount);
    setExcess(bookings.totalAmt - newPaidAmount);
  };

  const handleGenerateInvoice = () => {
    navigate(`/invoice/${bookingId}`, {
      state: { excess, paidAmount }
    });
  };

  return (
    <Box>
      <CustomBreadcrumbs
        title={t('text.BOOKING_DETAILS')}
        links={[
          { name: t('text.BOOKINGS'), path: '/booking' },
          { name: t('text.BOOKING_DETAILS'), path: '' }
        ]}
      />

      <Card>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Grid container spacing={2} padding={2} justifyContent="center">
              {[
                 { title: t('text.TOTAL_AMOUNT'), value: bookings.totalAmt },
                 { title: t('text.PAID_AMOUNT'), value: paidAmount },
                 { title: t('text.PENDING_AMOUNT'), value: excess }
              ].map((item, index) => (
                <Grid item xs={12} sm={4} key={index} display="flex" justifyContent="center">
                  <Card sx={{ textAlign: 'center', width: '100%', backgroundColor: '#f8f9fa' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">
                        {item.title}
                      </Typography>
                      <Typography variant="h5">{item.value}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ p: 2 }}>
              <Typography variant="h5">{t('text.OVERVIEW')}:</Typography>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={4} textAlign="left">
                  <Typography variant="body1" fontWeight="bold">
                    {bookings.tripStartLoc}({bookings.tripStartPincode})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {bookings.tripStartDate ? dayjs(bookings.tripStartDate).format('YYYY-MM-DD HH:mm') : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={4} textAlign="center">
                  <Typography variant="body1" fontWeight="bold">
                    {t('text.TO')}
                  </Typography>
                </Grid>

                <Grid item xs={4} textAlign="right">
                  <Typography variant="body1" fontWeight="bold">
                    {bookings.tripEndLoc}({bookings.tripEndPincode})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {bookings.tripEndDate ? dayjs(bookings.tripEndDate).format('YYYY-MM-DD HH:mm') : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            <Box sx={{ mt: 2, p: 2 }}>
              <Typography variant="h5">{t('text.TRIP_EXPENSE')}</Typography>
              <TableContainer sx={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                <Table size="small" aria-label="a dense table" sx={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f4f4f4', p: 0 }}>
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>#</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>{t('text.AMOUNT')}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>{t('text.COMMENTS')}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>{t('text.PAID_ON')}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>{t('text.ACTION')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tripExpense.map((row, index) => (
                      <TableRow key={row.id}>
                        {' '}
                        <TableCell sx={{ border: '1px solid #ddd' }}>{index + 1}</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>{row.amount}</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>{row.description}</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>{dayjs(row.createdAt).format('DD-MM-YYYY')}</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>
                          <IconButton color="error" onClick={() => handleDeleteExpense(row.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ mt: 2, p: 2 }}>
              <Typography variant="h5">{t('text.PAYEMNT_ACTIVITY')}</Typography>
              <TableContainer sx={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                <Table size="small" aria-label="a dense table" sx={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f4f4f4', p: 0 }}>
                      {' '}
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>#</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>{t('text.AMOUNT')}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>{t('text.COMMENTS')}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>{t('text.PAID_ON')}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>{t('text.ACTION')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentData.map((row, index) => (
                      <TableRow key={row.id}>
                        {' '}
                        <TableCell sx={{ border: '1px solid #ddd' }}>{index + 1}</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>{row.paidAmount}</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>{row.notes}</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>{dayjs(row.createdAt).format('DD-MM-YYYY')}</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>
                          <IconButton color="error" onClick={() => handleDeletePayment(row.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>

          <Divider orientation="vertical" flexItem />

          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleOpenPaymentDialog}
                    sx={{ p: '2px 2px', width: '100%' }}
                  >
                    {t('text.ADD_PAYMENT')}
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={handleOpenDialog}
                    sx={{ p: '2px 2px', width: '100%' }}
                  >
                    {t('text.TRIP_EXPENSE')}
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      background: '#28a745',
                      p: '2px 2px',
                      width: '100%',
                      '&:hover': {
                        backgroundColor: '#148638',
                        p: '2px 2px'
                      }
                    }}
                    onClick={handleGenerateInvoice}
                  >
                    {t('text.GENERATE_INVOICE')}
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      background: '#f4a100',
                      p: '2px 2px',
                      width: '100%',
                      '&:hover': {
                        backgroundColor: '#cd9015',
                        p: '2px 2px'
                      }
                    }}
                    onClick={() => handleOpenStatusDialog(bookings.id, bookings.tripStatus)}
                  >
                    {t('text.UPDATE_STATUS')}
                  </Button>
                </Grid>
              </Grid>

              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                {t('text.CUSTOMER_INFO')}
              </Typography>
              <Typography variant="body2">{bookings?.customer?.name}</Typography>
              <Typography variant="body2">{bookings?.customer?.mobileNo}</Typography>
              <Typography variant="body2">{bookings?.customer?.email}</Typography>
              <Typography variant="body2">{bookings?.customer?.address}</Typography>

              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                {t('text.DRIVER_INFO')}
              </Typography>
              <Typography variant="body2">{bookings?.driver?.name}</Typography>
              <Typography variant="body2">{bookings?.driver?.mobileNo}</Typography>
              <Typography variant="body2">{bookings?.driver?.address}</Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                {t('text.TRACKING_URL')}
              </Typography>
              <Typography variant="body2" color="primary">
                <a href="https://codeforts.com/vms/triptracking/67d226feda21d" target="_blank" rel="noopener noreferrer">
                  https://codeforts.com/vms/triptracking/67d226feda21d
                </a>
              </Typography>

              <Button variant="contained" sx={{ mt: 2, background: '#28a745' }}>
                {t('text.SHARE_TO_CUSTOMER')}
              </Button>
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle sx={{ fontWeight: 'bold', fontSize: '18px' }}>{t('text.ADD_TRIP_EXPENSE')}</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  label={t('text.AMOUNT')}
                  variant="outlined"
                  margin="dense"
                  value={bookingExpense.amount}
                  onChange={(e) => setBookingExpense({ ...bookingExpense, amount: parseFloat(e.target.value) || 0 })}
                />
                <TextField
                  fullWidth
                  label={t('text.DESCRIPTION')}
                  variant="outlined"
                  margin="dense"
                  multiline
                  rows={3}
                  value={bookingExpense.description}
                  onChange={(e) => setBookingExpense({ ...bookingExpense, description: e.target.value })}
                />
              </DialogContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
                <Button type="submit" variant="contained" onClick={handleAddExpense}>
                  {t('text.ADD_EXPENSE')}
                </Button>
                <Button variant="outlined" onClick={handleCloseDialog}>
                  {t('text.CANCEL')}
                </Button>
              </Box>
            </Dialog>
          </Grid>
        </Grid>
      </Card>

      <PaymentDialog
        open={openPaymentDialog}
        handleClose={handleClosePaymentDialog}
        totalAmount={totalAmount}
        excess={excess}
        bookingId={bookingId}
        handleAddPayment={handleAddPayment}
        fetchPaymentData={fetchPaymentData}
      />

      <BookingStatusDialog
        open={openStatusDialog}
        handleClose={handleCloseStatusDialog}
        bookingId={selectedBookingId}
        status={status}
        onStatusUpdate={handleStatusUpdate}
      />
    </Box>
  );
};

export default ViewBookingPage;
