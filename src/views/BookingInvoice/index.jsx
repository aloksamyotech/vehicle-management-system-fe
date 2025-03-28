import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import { Box, Card, CardContent, Typography, Grid, Divider, Button } from '@mui/material';
import { jsPDF } from 'jspdf';
import { text } from 'common/constant';

const InvoicePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { excess, paidAmount } = location.state || {};
  const [booking, setBooking] = useState(null);
  const invoiceNo = `#INV${Math.floor(1000 + Math.random() * 9000)}`;
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    if (id) {
      fetchBookingData();
    }
  }, [id]);

  const fetchBookingData = async () => {
    const response = await getApi(urls.booking.getById.replace(':id', id));
    setBooking(response?.data);
  };

  const generateInvoicePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18).text('INVOICE', 105, 20, null, null, 'center');
    doc.setFontSize(12).text(`Invoice No: ${invoiceNo}`, 150, 20);
    doc.text(`Date: ${currentDate}`, 150, 30);

    doc.setFontSize(14).text('Booking Details', 14, 50).line(14, 55, 190, 55);
    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking?.id || ''}`, 14, 65);
    doc.text(`Vehicle Name: ${booking?.vehicle?.vehicleName || ''}`, 14, 75);
    doc.text(`Trip Status: ${booking?.tripStatus || ''}`, 14, 85);
    doc.text(`Driver Name: ${booking?.driver?.name || 'N/A'}`, 14, 95);
    doc.text(`Trip Start: ${booking?.tripStartDate || ''} | ${booking?.tripStartLoc || ''}`, 14, 105);
    doc.text(`Trip End: ${booking?.tripEndDate || ''} | ${booking?.tripEndLoc || ''}`, 14, 115);

    doc.setFontSize(14).text('Customer Information', 14, 135).line(14, 140, 190, 140);
    doc.setFontSize(12);
    doc.text(`Name: ${booking?.customer?.name || ''}`, 14, 150);
    doc.text(`Email: ${booking?.customer?.email || ''}`, 14, 160);
    doc.text(`Mobile: ${booking?.customer?.mobileNo || ''}`, 14, 170);
    doc.text(`Address: ${booking?.customer?.address || ''}`, 14, 180);

    doc.setFontSize(14).text('Payment Information', 14, 200).line(14, 205, 190, 205);
    doc.setFontSize(12);
    doc.text(`Total Amount: ₹${booking?.totalAmt || ''}`, 14, 215);
    doc.text(`Paid Amount: ₹${paidAmount || ''}`, 14, 225);
    doc.text(`Pending Amount: ₹${excess || ''}`, 14, 235);

    doc.text('Thank you for your business!', 105, 260, null, null, 'center');
    doc.save(`${invoiceNo}.pdf`);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Card sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold">
            {text.INVOICE}
          </Typography>
          <Box textAlign="right">
            <Typography variant="h5">
              {text.INV_NO}: {invoiceNo}
            </Typography>
            <Typography variant="h5">
              {text.DATE}: {currentDate}
            </Typography>
          </Box>

          <Typography variant="h6" fontWeight="bold" mt={3}>
            {text.BOOKING_DETAILS}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6">{text.BOOKING_ID}:</Typography>
              <Typography>{booking?.id || ''}</Typography>
              <Typography variant="h6">{text.VEHICLE_NAME}:</Typography>
              <Typography>{booking?.vehicle?.vehicleName || ''}</Typography>
              <Typography variant="h6">{text.STATUS}:</Typography>
              <Typography>{booking?.tripStatus || ''}</Typography>
              <Typography variant="h6">{text.DRIVER_NAME}:</Typography>
              <Typography>{booking?.driver?.name || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">{text.TRIP_START_LOC}:</Typography>
              <Typography>
                {booking?.tripStartDate || ''} | {booking?.tripStartLoc || ''}
              </Typography>
              <Typography variant="h6">{text.TRIP_END_LOC}:</Typography>
              <Typography>
                {booking?.tripEndDate || ''} | {booking?.tripEndLoc || ''}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" fontWeight="bold" mt={3}>
            {text.CUSTOMER_INFO}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6">{text.NAME}:</Typography>
              <Typography>{booking?.customer?.name || 'N/A'}</Typography>

              <Typography variant="h6">{text.EMAIL}:</Typography>
              <Typography>{booking?.customer?.email || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">{text.PHONE}:</Typography>
              <Typography>{booking?.customer?.mobileNo || 'N/A'}</Typography>

              <Typography variant="h6">{text.ADDRESS}:</Typography>
              <Typography>{booking?.customer?.address || 'N/A'}</Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" fontWeight="bold" mt={3}>
            {text.PAYMENT_INFO}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6">{text.PAID_AMOUNT}:</Typography>
              <Typography>₹{paidAmount || ''}</Typography>
              <Typography variant="h5">
                {text.TOTAL_AMOUNT}: ₹{booking?.totalAmt || ''}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">{text.PENDING_AMOUNT}:</Typography>
              <Typography>₹{excess || ''}</Typography>
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              onClick={generateInvoicePDF}
              sx={{
                backgroundColor: 'green',
                color: 'white',
                fontWeight: 'bold',
                px: 2,
                py: 1,
                borderRadius: '8px',
                '&:hover': { backgroundColor: 'darkgreen' }
              }}
            >
              {text.DOWNLOAD}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InvoicePage;
