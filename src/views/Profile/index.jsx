import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Stack,
  Tabs,
  Tab,
  Divider,
  Button,
  IconButton,
  InputAdornment
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LockResetIcon from '@mui/icons-material/LockReset';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ProfileLogo from 'assets/images/profile.png';
import Background from 'assets/images/background.jpg';
import { urls } from 'common/urls';
import { updateApiPatch, updateApi } from 'common/apiClient';
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
  const [userObj, setUserObj] = useState({
    email: '',
    phone: '',
    address: '',
    name: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const newPassword = watch('newPassword');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrencyCode(user.currencyCode || 'INR');
      setCurrencySymbol(user.currencySymbol || '₹');
      setCurrency({ code: user.currencyCode || 'INR', symbol: user.currencySymbol || '₹' });

      setUserObj({
        id: user.id || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        name: user.name || ''
      });
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

  const handleCurrencySave = async () => {
    const response = await updateApiPatch(urls.users.updateCurrency.replace(':id', userObj.id), { currencyCode, currencySymbol });
    const updatedUser = { ...userObj, currencyCode, currencySymbol };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrency(updatedUser);
    toast.success(t('text.CURRENCY_UPDATE'));
  };

  const handleProfileSave = async () => {
    const { id, ...updateData } = userObj;
    const response = await updateApi(urls.users.update.replace(':id', user.id), updateData);
    if (response?.success) {
      localStorage.setItem('user', JSON.stringify(response.data));
      setEditMode(false);
      toast.success(t('text.USER_UPDATED'));
    } else {
      toast.error(t('text.ERROR_UPDATING'));
    }
  };

  const onSubmit = async (data) => {
    const { oldPassword, newPassword } = data;
    try {
      await updateApiPatch(urls.users.changePassword.replace(':id', user.id), {
        oldPassword,
        newPassword
      });
      toast.success(t('text.PASSWORD_UPDATED_SUCCESSFULLY'));
      reset(); 
    } catch (error) {
      toast.error(t('text.ERROR_FETCHING'));
    }
  };

  return (
    <>
      <CustomBreadcrumbs title={t('text.USER_ACCOUNT')} links={[{ name: t('text.USER_ACCOUNT'), path: '/profile' }]} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Tabs
            orientation="vertical"
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              backgroundColor: '#fff',
              borderRadius: 2,
              boxShadow: 2,
              height: '100%',
              '& .MuiTab-root': {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                textAlign: 'left',
                px: 2,
                py: 1,
                borderRadius: 1,
                color: 'text.primary'
              },
              '& .Mui-selected': {
                color: 'primary.main',
                fontWeight: 'bold',
                backgroundColor: 'transparent'
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            <Tab icon={<PersonIcon />} iconPosition="start" label={t('text.PROFILE')} value={0} />
            <Tab icon={<AttachMoneyIcon />} iconPosition="start" label={t('text.UPDATE_CURRENCY')} value={1} />
            {user?.role === 'USER' && <Tab icon={<LockResetIcon />} iconPosition="start" label={t('text.CHANGE_PASSWORD')} value={2} />}
          </Tabs>
        </Grid>

        <Grid item xs={12} md={9}>
          {tabValue === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box p={2} borderRadius={2} bgcolor="background.paper" boxShadow={2}>
                  <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
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
                    />

                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          border: '4px solid white',
                          position: 'relative',
                          top: '-50px',
                          borderRadius: '50%',
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

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box display="flex" alignItems="center">
                            <EmailIcon sx={{ color: '#6f7082', mr: 1 }} />
                            <TextField
                              label={t('text.NAME')}
                              value={userObj.name}
                              onChange={(e) => setUserObj({ ...userObj, name: e.target.value })}
                              fullWidth
                              size="small"
                              disabled={!editMode}
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box display="flex" alignItems="center">
                            <EmailIcon sx={{ color: '#6f7082', mr: 1 }} />
                            <TextField
                              label={t('text.EMAIL')}
                              value={userObj.email}
                              onChange={(e) => setUserObj({ ...userObj, email: e.target.value })}
                              fullWidth
                              size="small"
                              disabled={!editMode}
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box display="flex" alignItems="center">
                            <PhoneIcon sx={{ color: '#6f7082', mr: 1 }} />
                            <TextField
                              label={t('text.PHONE')}
                              value={userObj.phone || ''}
                              onChange={(e) => setUserObj({ ...userObj, phone: e.target.value })}
                              fullWidth
                              size="small"
                              disabled={!editMode}
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box display="flex" alignItems="center">
                            <LocationOnIcon sx={{ color: '#6f7082', mr: 1 }} />
                            <TextField
                              label={t('text.ADDRESS')}
                              value={userObj.address || ''}
                              onChange={(e) => setUserObj({ ...userObj, address: e.target.value })}
                              fullWidth
                              size="small"
                              disabled={!editMode}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                      <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button
                          variant="contained"
                          onClick={() => {
                            if (editMode) {
                              handleProfileSave();
                            } else {
                              setUserObj({ ...user });
                              setEditMode(true);
                            }
                          }}
                        >
                          {editMode ? t('text.SAVE_PROFILE') : t('text.EDIT_PROFILE')}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Card sx={{ width: '100%', margin: 'auto', p: 2 }} elevation={2}>
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
                      size='small'
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
                    <TextField label={t('text.CURRENCY_SYMBOL')} value={currencySymbol} fullWidth  size='small' margin="normal" />
                  </Grid>
                </Grid>

                <Box mt={3} display="flex" justifyContent="flex-end">
                  <Button variant="contained" color="primary" onClick={handleCurrencySave}>
                    {t('text.SAVE_CURRENCY')}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {tabValue === 2 && (
            <Card sx={{ width: '100%', margin: 'auto', p: 2 }} elevation={2}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {t('text.CHANGE_PASSWORD')}
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label={t('text.OLD_PASSWORD')}
                        type={showOld ? 'text' : 'password'}
                        fullWidth
                        size="small"
                        {...register('oldPassword', {
                          required: t('text.REQUIRED'),
                          minLength: { value: 6, message: t('text.MIN_6_CHAR') }
                        })}
                        error={!!errors.oldPassword}
                        helperText={errors.oldPassword?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowOld(!showOld)} edge="end">
                                {showOld ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label={t('text.NEW_PASSWORD')}
                        type={showNew ? 'text' : 'password'}
                        fullWidth
                        size="small"
                        {...register('newPassword', {
                          required: t('text.REQUIRED'),
                          minLength: { value: 6, message: t('text.MIN_6_CHAR') }
                        })}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowNew(!showNew)} edge="end">
                                {showNew ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label={t('text.CONFIRM_PASSWORD')}
                        type={showConfirm ? 'text' : 'password'}
                        fullWidth
                        size="small"
                        {...register('confirmPassword', {
                          required: t('text.REQUIRED'),
                          validate: (value) => value === newPassword || t('text.PASSWORDS_DO_NOT_MATCH')
                        })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                                {showConfirm ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box mt={3} display="flex" justifyContent="flex-end">
                    <Button type="submit" variant="contained">
                      {t('text.UPDATE_PASSWORD')}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default EmployeeDetails;
