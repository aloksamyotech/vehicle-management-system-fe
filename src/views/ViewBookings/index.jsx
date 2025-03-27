import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  DialogActions,
  TextField,
  Divider
} from '@mui/material';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import DeleteIcon from '@mui/icons-material/Delete';
import { text } from 'common/constant';
import { urls } from 'common/urls';
import { getApi, postApi } from 'common/apiClient';
import PaymentDialog from './paymentForm';
import toast from 'react-hot-toast';

const ViewBookingPage = () => {
  const paymentData = [{ id: 1, amount: 1200, comments: 'cc', paidOn: '2025-03-13 00:31:37' }];
  const { id } = useParams();
  const [bookings, setBookings] = useState({});

  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchBookingData = async () => {
    const response = await getApi(urls.booking.getById.replace(':id', id));
    setBookings(response?.data);
  };

  useEffect(() => {
    if (id) {
      fetchBookingData();
    }
  }, [id]);

  const handleOpenPaymentDialog = () => {
    setTotalAmount(bookings.totalAmt || 0);
    setOpenPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [tripExpense, setTripExpense] = useState({
    amount: '',
    description: '',
    vehicleId: '',
    date: '',
    type: 'expense'
  });

  const handleOpenDialog = () => {
    setTripExpense({
      amount: '',
      description: '',
      vehicleId: bookings?.vehicleId || '',
      date: new Date().toISOString(),
      type: 'Expense'
    });
    setOpenDialog(true);
  };

  const handleAddExpense = async () => {
    const response = await postApi(urls.incomeExpense.create, tripExpense);
    toast.success(text.INC_EXP_ADDED);
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
          <Grid item xs={12} md={8}>
            <Grid container spacing={2} padding={2} justifyContent="center">
              {[
                { title: text.TOTAL_AMOUNT, value: bookings.totalAmt },
                { title: text.PAID_AMOUNT, value: '1200' },
                { title: text.EXCESS, value: '0' }
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
                    {bookings.tripStartLoc}
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
                    {bookings.tripEndLoc}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {bookings.tripEndDate}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            <Box sx={{ mt: 2, p: 2 }}>
              <Typography variant="h5">{text.PAYEMNT_ACTIVITY}</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>{text.AMOUNT}</TableCell>
                      <TableCell>{text.COMMENTS}</TableCell>
                      <TableCell>{text.PAID_ON}</TableCell>
                      <TableCell>{text.ACTION}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentData.map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.amount}</TableCell>
                        <TableCell>{row.comments}</TableCell>
                        <TableCell>{row.paidOn}</TableCell>
                        <TableCell>
                          <IconButton color="error">
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

          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={1} justifyContent="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleOpenPaymentDialog}>
                    {text.ADD_PAYMENT}
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="secondary" onClick={handleOpenDialog}>
                    {text.TRIP_EXPENSE}
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" sx={{ background: '#28a745' }}>
                    {text.GENERATE_INVOICE}
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
                  value={tripExpense.amount}
                  onChange={(e) => setTripExpense({ ...tripExpense, amount: parseFloat(e.target.value) || 0 })}
                />
                <TextField
                  fullWidth
                  label={text.DESCRIPTION}
                  variant="outlined"
                  margin="dense"
                  multiline
                  rows={3}
                  value={tripExpense.description}
                  onChange={(e) => setTripExpense({ ...tripExpense, description: e.target.value })}
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

      <PaymentDialog open={openPaymentDialog} handleClose={handleClosePaymentDialog} totalAmount={totalAmount} />
    </Box>
  );
};

export default ViewBookingPage;
