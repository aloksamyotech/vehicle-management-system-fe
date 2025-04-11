import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import toast from 'react-hot-toast';
import { text } from 'common/constant';
import { useTranslation } from 'react-i18next';
import { fetchCurrencySymbol } from 'common/function';

const SalesLineCard = ({ bgColor, chartData, footerData, title }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ padding: 0, paddingBottom: '0 !important' }}>
        <Box
          sx={{
            background: bgColor || '#ffff',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            color: 'black',
            p: 3
          }}
        >
          <Grid container direction="column" spacing={1}>
            <Grid item container justifyContent="space-between" alignItems="center">
              {title && (
                <Grid item>
                  <Typography variant="body1" sx={{ fontSize: '16px', mt: '-12px', fontWeight: '600' }}>
                    {title}
                  </Typography>
                </Grid>
              )}
            </Grid>
            {chartData && (
              <Grid item>
                <Chart {...chartData} />
              </Grid>
            )}
          </Grid>
        </Box>

        <Divider />
        <Box px={2} pt={2}>
          <Grid container spacing={2}>
            <Grid item>
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#66bb6a',
                    mr: 1
                  }}
                />
                <Typography variant="body2">{t('text.INCOME')}</Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#ef5350',
                    mr: 1
                  }}
                />
                <Typography variant="body2">{t('text.EXPENSE')}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {footerData.length >= 2 && (
          <Box px={2} py={1}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Box>
                  <Typography variant="h4" style={{ color: footerData[0].color || 'inherit' }}>
                    {footerData[0].value}
                  </Typography>
                  <Typography variant="subtitle2" color="secondary">
                    {footerData[0].label}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box textAlign="right">
                  <Typography variant="h4" style={{ color: footerData[1].color || 'inherit' }}>
                    {footerData[1].value}
                  </Typography>
                  <Typography variant="subtitle2" color="secondary">
                    {footerData[1].label}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

SalesLineCard.propTypes = {
  bgColor: PropTypes.string,
  chartData: PropTypes.object,
  footerData: PropTypes.array,
  title: PropTypes.string
};

const MonthlyIncomeChart = () => {
  const { t } = useTranslation();
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [footerData, setFooterData] = useState([]);
  const [chartData, setChartData] = useState({
    type: 'line',
    height: 140,
    options: {},
    series: []
  });

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrencySymbol();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  useEffect(() => {
    const fetchIncomeExpenseData = async () => {
      try {
        const res = await getApi(urls.incomeExpense.summary);
        const summary = res?.data;

        const months = summary.map((item) => item.name);
        const incomeData = summary.map((item) => item.income || 0);
        const expenseData = summary.map((item) => item.expense || 0);
        const currentMonthIndex = new Date().getMonth();
        const currentMonth = summary[currentMonthIndex] || {};
        const currentIncome = currentMonth.income || 0;
        const currentExpense = currentMonth.expense || 0;

        setChartData({
          type: 'line',
          height: 140,
          options: {
            chart: {
              sparkline: { enabled: true },
              toolbar: { show: false },
              animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                  enabled: true,
                  delay: 150
                },
                dynamicAnimation: {
                  enabled: true,
                  speed: 350
                }
              }
            },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 3 },
            colors: ['#66bb6a', '#ef5350'],
            grid: {
              show: true,
              borderColor: '#90caf9',
              strokeDashArray: 4
            },
            xaxis: {
              categories: months,
              labels: {
                style: { colors: '#fff', fontSize: '12px' }
              }
            },
            yaxis: {
              labels: {
                style: { colors: '#fff', fontSize: '12px' }
              }
            },
            tooltip: {
              theme: 'dark',
              shared: true,
              custom: function ({ series, dataPointIndex }) {
                const income = series[0][dataPointIndex];
                const expense = series[1][dataPointIndex];
                const profitLoss = income - expense;

                return `
                  <div style="padding: 10px;">
                    <strong>${months[dataPointIndex]}</strong><br/>
                    Income: ${currencySymbol}${income}<br/>
                    Expense: ${currencySymbol}${expense}<br/>
                    <span style="color: ${profitLoss >= 0 ? 'lightgreen' : 'salmon'};">
                      Profit/Loss: ${currencySymbol}${profitLoss}
                    </span>
                  </div>
                `;
              }
            },
            legend: { show: false }
          },
          series: [
            { name: t('text.INCOME'), data: incomeData },
            { name: t('text.EXPENSE'), data: expenseData }
          ]
        });

        setFooterData([
          {
            value: `${currencySymbol}${currentIncome}`,
            label: t('text.TOTAL_INCOME'),
            color: '#4CAF50'
          },
          {
            value: `${currencySymbol}${currentExpense}`,
            label: t('text.TOTAL_EXPENSE'),
            color: '#F44336'
          }
        ]);
      } catch (error) {
        toast.error(t('text.ERROR_FETCHING'));
      }
    };

    fetchIncomeExpenseData();
  }, [currencySymbol]);

  return (
    <Grid item xs={12}>
      <SalesLineCard chartData={chartData} title={t('text.MONTHLY_INC_EXP')} footerData={footerData} />
    </Grid>
  );
};

export default MonthlyIncomeChart;
