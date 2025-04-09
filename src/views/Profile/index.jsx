import { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, TextField, Stack, Tabs, Tab, Divider, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import ProfileLogo from 'assets/images/profile.png';
import Background from 'assets/images/background.jpg';
import { urls } from 'common/urls';
import { updateApiPatch } from 'common/apiClient';
import toast from 'react-hot-toast';
import { text } from 'common/constant';
import { useTranslation } from 'react-i18next';
import CustomBreadcrumbs from 'common/customBreadcrumbs';

const currencyList = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
  { code: 'JPY', symbol: '¥' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'CAD', symbol: 'C$' },
  { code: 'CHF', symbol: 'CHF' },
  { code: 'CNY', symbol: '¥' },
  { code: 'SEK', symbol: 'kr' },
  { code: 'NZD', symbol: 'NZ$' },
  { code: 'MXN', symbol: '$' },
  { code: 'SGD', symbol: 'S$' },
  { code: 'HKD', symbol: 'HK$' },
  { code: 'NOK', symbol: 'kr' },
  { code: 'KRW', symbol: '₩' },
  { code: 'TRY', symbol: '₺' },
  { code: 'BRL', symbol: 'R$' },
  { code: 'ZAR', symbol: 'R' }
];

const EmployeeDetails = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [currency, setCurrency] = useState({ code: 'INR', symbol: '₹' });
  const [currencyCode, setCurrencyCode] = useState('INR');
  const [currencySymbol, setCurrencySymbol] = useState('₹');

  const userObj = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrencyCode(user.currencyCode || 'INR');
      setCurrencySymbol(user.currencySymbol || '₹');
      setCurrency({ code: user.currencyCode || 'INR', symbol: user.currencySymbol || '₹' });
    }
  }, []);

  const handleCurrencyCodeChange = (event) => {
    const selectedCode = event.target.value;
    const selectedCurrency = currencyList.find((c) => c.code === selectedCode);
    if (selectedCurrency) {
      setCurrencyCode(selectedCurrency.code);
      setCurrencySymbol(selectedCurrency.symbol);
      setCurrency(selectedCurrency);
    }
  };

  const empData = {
    email: 'admin@gmail.com',
    phone: '+1 234 567 890',
    location: 'India',
    country: 'India'
  };

  const handleCurrencySave = async () => {
    const response = await updateApiPatch(urls.users.updateCurrency.replace(':id', userObj.id), { currencyCode, currencySymbol });
    const updatedUser = { ...userObj, currencyCode, currencySymbol };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrency(updatedUser);
    toast.success(t('text.CURRENCY_UPDATE'));
  };

  return (
    <>
      <CustomBreadcrumbs title={t('text.USER_ACCOUNT')} links={[{ name: t('text.USER_ACCOUNT'), path: '/profile' }]} />

      <Grid container spacing={2} p={2}>
        <Box sx={{ width: '100%', mt: '15px' }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              backgroundColor: '#ffff',
              borderRadius: '8px',
              '& .MuiTabs-indicator': {
                backgroundColor: 'transparent'
              }
            }}
          >
            <Tab
              label={t('text.PROFILE')}
              value={0}
              sx={{
                backgroundColor: tabValue === 0 ? '#1482d7' : 'transparent',
                color: tabValue === 0 ? '#fff !important' : '#000',
                borderRadius: '8px',
                fontWeight: tabValue === 0 ? 'bold' : 'normal'
              }}
            />
            <Tab
              label={t('text.SETTINGS')}
              value={1}
              sx={{
                backgroundColor: tabValue === 1 ? '#1482d7' : 'transparent',
                color: tabValue === 1 ? '#fff !important' : '#000',
                borderRadius: '8px',
                fontWeight: tabValue === 1 ? 'bold' : 'normal'
              }}
            />
          </Tabs>

          {tabValue === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4} mt={2}>
                <Box p={2} borderRadius={2} bgcolor="background.paper">
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {t('text.ABOUT_US')}
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body1">
                    Fleet management involves the administration and coordination of vehicles to ensure optimal efficiency, safety, and
                    compliance...
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={8} mt={2}>
                <Box p={2} boxShadow={3} borderRadius={2} bgcolor="background.paper">
                  <Card sx={{ maxWidth: 600, borderRadius: 3, overflow: 'hidden' }}>
                    <Box
                      sx={{
                        height: 80,
                        backgroundImage: `url(${Background})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        px: 15
                      }}
                    ></Box>

                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          border: '4px solid white',
                          position: 'relative',
                          top: '-50px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: '#ADD8E6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <img src={ProfileLogo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>

                      <Stack direction="row" alignItems="center" flexWrap="wrap" sx={{ mt: -8 }} spacing={1}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <WorkIcon fontSize="small" sx={{ color: '#6f7082' }} />
                          <Typography variant="body2" color="text.secondary">
                            {userObj.name}
                          </Typography>
                        </Box>
                        &nbsp;&nbsp;
                        <Box display="flex" alignItems="center" gap={0.2}>
                          <LocationOnIcon fontSize="small" sx={{ color: '#6f7082' }} />
                          <Typography variant="body2" color="text.secondary">
                            India
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>

                    <CardContent sx={{ mt: -9 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {t('text.CONTACT_INFO')}
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box display="flex" alignItems="center" mb={2}>
                        <EmailIcon sx={{ color: '#6f7082', mr: 1 }} />
                        <Typography variant="body1">
                          <b>{t('text.EMAIL')}:</b> {userObj.email}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <PhoneIcon sx={{ color: '#6f7082', mr: 1 }} />
                        <Typography variant="body1">
                          <b>{t('text.PHONE')}:</b> {userObj.phone || '+1 234 567 890'}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <LocationOnIcon sx={{ color: '#6f7082', mr: 1 }} />
                        <Typography variant="body1">
                          <b>{t('text.LOC')}:</b> {empData.location}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Card sx={{ width: '100%', margin: 'auto', mt: 2, p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {t('text.CURRENCY_SETTINGS')}
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label={t('text.CURRENCY_CODE')}
                      value={currencyCode}
                      onChange={handleCurrencyCodeChange}
                      SelectProps={{ native: true }}
                      fullWidth
                      margin="normal"
                    >
                      <option value="">-- {t('text.SELECT_CURRENCY')} --</option>
                      {currencyList.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.code}
                        </option>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField label={t('text.CURRENCY_SYMBOL')} value={currencySymbol} fullWidth margin="normal" />
                  </Grid>
                </Grid>

                <Box mt={3}>
                  <Button variant="contained" color="primary" onClick={handleCurrencySave}>
                    {t('text.SAVE_CURRENCY')}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Grid>
    </>
  );
};

export default EmployeeDetails;
