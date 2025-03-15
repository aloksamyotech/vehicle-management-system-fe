import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
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
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ViewBookingPage = () => {
  const paymentData = [{ id: 1, amount: 1200, comments: 'cc', paidOn: '2025-03-13 00:31:37' }];
  const [openDialog, setOpenDialog] = useState(false);
  const [tripExpense, setTripExpense] = useState({ amount: '', notes: '' });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2
        }}
      >
        <Typography variant="h3">Booking Details</Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <MuiLink component={Link} to="/booking" color="inherit" underline="none">
            <Typography color="#17a2b8">Bookings</Typography>
          </MuiLink>
          <Typography color="text.primary">Booking Details</Typography>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2} justifyContent="center">
            {[
              { title: 'Total Amount', value: '1200' },
              { title: 'Paid Amount', value: '1200' },
              { title: 'Excess', value: '0' }
            ].map((item, index) => (
              <Grid item xs={12} sm={4} key={index} display="flex" justifyContent="center">
                <Card sx={{ textAlign: 'center', width: '100%' }}>
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

          <Card sx={{ mt: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                Overview :
              </Typography>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={4} textAlign="left">
                  <Typography variant="body1" fontWeight="bold">
                    Start Location
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    2025-03-13
                  </Typography>
                </Grid>

                <Grid item xs={4} textAlign="center">
                  <Typography variant="body1" fontWeight="bold">
                    To
                  </Typography>
                </Grid>

                <Grid item xs={4} textAlign="right">
                  <Typography variant="body1" fontWeight="bold">
                    End Location
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    2025-03-13
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Payment Activity
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Comments</TableCell>
                      <TableCell>Paid On</TableCell>
                      <TableCell>Action</TableCell>
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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Grid container spacing={1} justifyContent="center">
                <Grid item>
                  <Button variant="contained" color="primary">
                    Add Payment
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="secondary" onClick={handleOpenDialog}>
                    Trip Expense
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" sx={{background:'#28a745'}}>
                    Generate Invoice
                  </Button>
                </Grid>
              </Grid>

              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                Customer Info
              </Typography>
              <Typography variant="body2">010101101</Typography>
              <Typography variant="body2">01010101011</Typography>
              <Typography variant="body2">010101010@gmail.com</Typography>
              <Typography variant="body2">000001</Typography>

              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                Driver Info
              </Typography>
              <Typography variant="body2">Gerald Bautista</Typography>
              <Typography variant="body2">6456456565</Typography>
              <Typography variant="body2">6565656</Typography>

              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                Tracking URL
              </Typography>
              <Typography variant="body2" color="primary">
                <a href="https://codeforts.com/vms/triptracking/67d226feda21d" target="_blank" rel="noopener noreferrer">
                  https://codeforts.com/vms/triptracking/67d226feda21d
                </a>
              </Typography>

              <Button variant="contained" sx={{ mt: 2 ,background:'#28a745'}}>
                Share to Customer
              </Button>
            </CardContent>
          </Card>

          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle  sx={{ fontWeight: 'bold', fontSize: '16px' }}>Add Trip Expense</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Amount"
                variant="outlined"
                margin="dense"
                value={tripExpense.amount}
                onChange={(e) => setTripExpense({ ...tripExpense, amount: e.target.value })}
              />
              <TextField
                fullWidth
                label="Notes"
                variant="outlined"
                margin="dense"
                multiline
                rows={3}
                value={tripExpense.notes}
                onChange={(e) => setTripExpense({ ...tripExpense, notes: e.target.value })}
              />
            </DialogContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p:2}}>
                <Button type="submit" variant="contained">
                  Add Expense
                </Button>
                <Button variant="outlined" onClick={handleCloseDialog}>
                  Cancel
                </Button>
              </Box>
          </Dialog>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewBookingPage;
