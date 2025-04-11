import React, { useState, useEffect } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Card, CardHeader, CardContent, Typography, Divider, LinearProgress } from '@mui/material';
import SalesLineCard from 'views/Dashboard/card/SalesLineCard';
import RevenuChartCard from 'views/Dashboard/card/RevenuChartCard';
import ReminderCard from '../card/ReminderCard';
import ReportCard from './ReportCard';
import { gridSpacing } from 'config.js';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Person4Icon from '@mui/icons-material/Person4';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayTwoTone from '@mui/icons-material/CalendarTodayTwoTone';
import { urls } from 'common/urls';
import { getApi } from 'common/apiClient';
import { useTranslation } from 'react-i18next';

const Default = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [monthlyVehicles, setMonthlyVehicles] = useState(0);
  const [monthlyDrivers, setMonthlyDrivers] = useState(0);
  const [monthlyCustomers, setMonthlyCustomers] = useState(0);
  const [monthlyBookings, setMonthlyBookings] = useState(0);

  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await getApi(`${urls.vehicle.get}?all=true`);
      setVehicles(response?.data?.pagination?.total || '');
      setMonthlyVehicles(response?.data?.totalMonthlyVehicles || '');
    };

    const fetchDriver = async () => {
      const response = await getApi(`${urls.driver.get}?all=true`);
      setDrivers(response?.data?.pagination?.total || '');
      setMonthlyDrivers(response?.data?.totalMonthlyDrivers || '');
    };

    const fetchCustomer = async () => {
      const response = await getApi(`${urls.customer.get}?all=true`);
      setCustomers(response?.data?.pagination?.total || '');
      setMonthlyCustomers(response?.data?.totalMonthlyCustomers || '');
    };

    const fetchBooking = async () => {
      const response = await getApi(`${urls.booking.get}?all=true`);
      setBookings(response?.data?.totalTodayBookings || '');
      setMonthlyBookings(response?.data?.totalMonthlyBookings || '');
    };

    fetchVehicles();
    fetchDriver();
    fetchCustomer();
    fetchBooking();
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={vehicles || '0'}
              secondary={t('text.TOTAL_VEHICLES')}
              color={theme.palette.warning.main}
              footerData={`${monthlyVehicles} ${t('text.VEHICLES_ADDED_THIS_MONTH')}`}
              iconPrimary={LocalShippingIcon}
              iconFooter={TrendingUpIcon}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={drivers || '0'}
              secondary={t('text.TOTAL_DRIVERS')}
              color={theme.palette.error.main}
              footerData={`${monthlyDrivers} ${t('text.DRIVER_JOINED_THIS_MONTH')}`}
              iconPrimary={Person4Icon}
              iconFooter={TrendingUpIcon}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={customers || '0'}
              secondary={t('text.TOTAL_CUSTOMERS')}
              color={theme.palette.success.main}
              footerData={`${monthlyCustomers} ${t('text.CUS_ADDED_MONTH')}`}
              iconPrimary={PersonIcon}
              iconFooter={TrendingUpIcon}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={bookings || '0'}
              secondary={t('text.TOTAL_TRIPS')}
              color={theme.palette.primary.main}
              footerData={`${monthlyBookings} ${t('text.BOOKINGS_THIS_MONTH')}`}
              iconPrimary={CalendarTodayTwoTone}
              iconFooter={TrendingUpIcon}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12}>
                    <SalesLineCard />
                  </Grid>
                  <Grid item xs={12} sx={{ display: { md: 'block', sm: 'none' } }}>
                   <ReminderCard/>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <RevenuChartCard />
              </Grid>
            </Grid>
          </Grid>

          <Grid item lg={4} xs={12}>
            <Card>
              <CardHeader
                title={
                  <Typography component="div" className="card-header">
                    Traffic Sources
                  </Typography>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Direct</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          80%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="direct" value={80} color="primary" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Social</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          50%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="Social" value={50} color="secondary" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Referral</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          20%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="Referral" value={20} color="primary" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Bounce</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          60%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="Bounce" value={60} color="secondary" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Internet</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          40%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="Internet" value={40} color="primary" />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Default;
