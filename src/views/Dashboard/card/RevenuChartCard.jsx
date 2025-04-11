import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import value from 'assets/scss/_themes-vars.module.scss';
import { Box, Card, CardContent, CardHeader, Divider, Grid, Typography, useMediaQuery } from '@mui/material';
import Chart from 'react-apexcharts';
import { text } from 'common/constant';
import { useTranslation } from 'react-i18next';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import toast from 'react-hot-toast';

const RevenuChartCard = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const matchDownXs = useMediaQuery(theme.breakpoints.down('sm'));

  const [chartData, setChartData] = useState({
    series: [0, 0, 0],
    options: {
      chart: { type: 'donut', height: 228 },
      dataLabels: { enabled: false },
      yaxis: { min: 0, max: 100 },
      labels: [t('text.MAINTENANCE'), t('text.BOOKINGS'), t('text.AVAILABLE')],

      legend: {
        show: true,
        position: 'bottom',
        fontFamily: 'inherit',
        labels: { colors: 'inherit' }
      },
      itemMargin: { horizontal: 10, vertical: 10 },
      colors: [value.error, value.primary, value.info]
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicleRes = await getApi(`${urls.vehicle.get}?all=true`);
        const totalVehicles = vehicleRes?.data?.pagination?.total || 0;

        const mainRes = await getApi(`${urls.maintenance.get}?all=true`);
        const totalMaintenance = mainRes?.data?.totalTodayMaintenance || 0;

        const bookingRes = await getApi(`${urls.booking.get}?all=true`);
        const todayBookings = bookingRes?.data?.totalTodayBookings || 0;

        const available = totalVehicles - (totalMaintenance + todayBookings);

        setChartData((prev) => ({
          ...prev,
          series: [totalMaintenance, todayBookings, available >= 0 ? available : 0]
        }));
      } catch (err) {
        toast.error(t('text.ERROR_FETCHING'));
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader
        title={
          <Typography t="div" className="card-header">
            {t('text.VEHICLE_AVAIL')}
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2} direction={matchDownMd && !matchDownXs ? 'row' : 'column'}>
          <Grid item xs={12} sm={7} md={12}>
            <Chart options={chartData.options} series={chartData.series} type="donut" height={228} />
          </Grid>
          <Grid item sx={{ display: { md: 'block', sm: 'none' } }}>
            <Divider />
          </Grid>
          <Grid
            item
            container
            direction={matchDownMd && !matchDownXs ? 'column' : 'row'}
            justifyContent="space-around"
            alignItems="center"
            xs={12}
            sm={5}
            md={12}
          >
            <Grid item>
              <Grid container direction="column">
                <Typography variant="h6">{t('text.MAINTENANCE')}</Typography>
                <Typography variant="subtitle1" sx={{ color: theme.palette.error.main }}>
                  {chartData.series[0]} {t('text.VEHICLE')}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="column">
                <Typography variant="h6">{t('text.BOOKINGS')}</Typography>
                <Box color={theme.palette.primary.main}>
                  <Typography variant="subtitle1" color="inherit">
                    {chartData.series[1]} {t('text.TODAY')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="column">
                <Typography variant="h6">{t('text.AVAILABLE')}</Typography>
                <Typography variant="subtitle1" sx={{ color: theme.palette.info.main }}>
                  {chartData.series[2]} {t('text.VEHICLE')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

RevenuChartCard.propTypes = {
  chartData: PropTypes.object
};

export default RevenuChartCard;
