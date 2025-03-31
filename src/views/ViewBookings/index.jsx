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
import { getApi, updateApi } from 'common/apiClient';
import PaymentDialog from './paymentForm';
import BookingStatusDialog from './bookingstatus';
import toast from 'react-hot-toast';

const ViewBookingPage = () => {
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
  const [bookingExpense, setBookingExpense] = useState({
    tripExpense: '',
    desc: ''
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
      tripExpense: '',
      desc: ''
    });
    setOpenDialog(true);
  };

  const handleAddExpense = async () => {
    const response = await updateApi(urls.booking.updateExpense.replace(':id', id), bookingExpense);
    toast.success(text.BOOKING_EXP_ADDED);
    fetchBookingData();
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeletePayment = async (paymentId) => {
    await updateApi(urls.payment.update.replace(':id', paymentId));
    toast.success(text.PAYMENT_DELETED);
    fetchPaymentData();

    const updatedPayments = paymentData.filter((payment) => payment.id !== paymentId);
    setPaymentData(updatedPayments);

    const newPaidAmount = updatedPayments.reduce((sum, payment) => sum + payment.paidAmount, 0);
    setPaidAmount(newPaidAmount);
    setExcess(bookings.totalAmt - newPaidAmount);
  };
  const handleGenerateInvoice = () => {
    navigate(`/invoice/${bookingId}`, {
      state: { excess, paidAmount}
    });
  };

  return (
    <Box>
      <CustomBreadcrumbs
        title={text.BOOKING_DETAILS}
        links={[
          { name: text.BOOKINGS, path: '/booking' },
          { name: text.BOOKING_DETAILS, path: '' }
        ]}
      />

      <Card>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Grid container spacing={2} padding={2} justifyContent="center">
              {[
                { title: text.TOTAL_AMOUNT, value: bookings.totalAmt },
                { title: text.PAID_AMOUNT, value: paidAmount },
                { title: text.PENDING_AMOUNT, value: excess }
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
              <Typography variant="h5">{text.OVERVIEW}:</Typography>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={4} textAlign="left">
                  <Typography variant="body1" fontWeight="bold">
                    {bookings.tripStartLoc}({bookings.tripStartPincode})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {bookings.tripStartDate}
                  </Typography>
                </Grid>

                <Grid item xs={4} textAlign="center">
                  <Typography variant="body1" fontWeight="bold">
                    {text.TO}
                  </Typography>
                </Grid>

                <Grid item xs={4} textAlign="right">
                  <Typography variant="body1" fontWeight="bold">
                    {bookings.tripEndLoc}({bookings.tripEndPincode})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {bookings.tripEndDate}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            <Box sx={{ mt: 2, p: 2 }}>
              <Typography variant="h5">{text.TRIP_EXPENSE}</Typography>
              <TableContainer sx={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                <Table size="small" aria-label="a dense table" sx={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f4f4f4', p: 0 }}>
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>{text.AMOUNT}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>{text.DESCRIPTION}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      {' '}
                      <TableCell sx={{ border: '1px solid #ddd' }}>{bookings.tripExpense || ''}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd' }}>{bookings.desc || ''}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ mt: 2, p: 2 }}>
              <Typography variant="h5">{text.PAYEMNT_ACTIVITY}</Typography>
              <TableContainer sx={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                <Table size="small" aria-label="a dense table" sx={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f4f4f4', p: 0 }}>
                      {' '}
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>#</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>{text.AMOUNT}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>{text.COMMENTS}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>{text.PAID_ON}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontWeight: 'bold' }}>{text.ACTION}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentData.map((row, index) => (
                      <TableRow key={row.id}>
                        {' '}
                        <TableCell sx={{ border: '1px solid #ddd' }}>{index + 1}</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>{row.paidAmount}</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>{row.notes}</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd' }}>{row.createdAt}</TableCell>
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
                    {text.ADD_PAYMENT}
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
                    {text.TRIP_EXPENSE}
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
                    {text.GENERATE_INVOICE}
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
                    {text.UPDATE_STATUS}
                  </Button>
                </Grid>
              </Grid>

              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                {text.CUSTOMER_INFO}
              </Typography>
              <Typography variant="body2">{bookings?.customer?.name}</Typography>
              <Typography variant="body2">{bookings?.customer?.mobileNo}</Typography>
              <Typography variant="body2">{bookings?.customer?.email}</Typography>
              <Typography variant="body2">{bookings?.customer?.address}</Typography>

              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                {text.DRIVER_INFO}
              </Typography>
              <Typography variant="body2">{bookings?.driver?.name}</Typography>
              <Typography variant="body2">{bookings?.driver?.mobileNo}</Typography>
              <Typography variant="body2">{bookings?.driver?.address}</Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                {text.TRACKING_URL}
              </Typography>
              <Typography variant="body2" color="primary">
                <a href="https://codeforts.com/vms/triptracking/67d226feda21d" target="_blank" rel="noopener noreferrer">
                  https://codeforts.com/vms/triptracking/67d226feda21d
                </a>
              </Typography>

              <Button variant="contained" sx={{ mt: 2, background: '#28a745' }}>
                {text.SHARE_TO_CUSTOMER}
              </Button>
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle sx={{ fontWeight: 'bold', fontSize: '18px' }}>{text.ADD_TRIP_EXPENSE}</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  label={text.AMOUNT}
                  variant="outlined"
                  margin="dense"
                  value={bookingExpense.tripExpense}
                  onChange={(e) => setBookingExpense({ ...bookingExpense, tripExpense: parseFloat(e.target.value) || 0 })}
                />
                <TextField
                  fullWidth
                  label={text.DESCRIPTION}
                  variant="outlined"
                  margin="dense"
                  multiline
                  rows={3}
                  value={bookingExpense.desc}
                  onChange={(e) => setBookingExpense({ ...bookingExpense, desc: e.target.value })}
                />
              </DialogContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
                <Button type="submit" variant="contained" onClick={handleAddExpense}>
                  {text.ADD_EXPENSE}
                </Button>
                <Button variant="outlined" onClick={handleCloseDialog}>
                  {text.CANCEL}
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
