import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { text } from 'common/constant';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { postApi } from 'common/apiClient';
import { urls } from 'common/urls';

const AuthLogin = ({ ...rest }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <>
      <Formik
        initialValues={{ email: '', password: '', submit: null }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const response = await postApi(urls.user.login, values);

            if (response?.success) {
              const { access_token, user } = response?.data;

              localStorage.setItem('token', access_token);
              localStorage.setItem('user', JSON.stringify(user));
              toast.success(t('text.LOGIN_SUCCESS'));
              navigate('/dashboard/default');
            } else {
              setErrors({ submit: response?.message });
            }
          } catch (error) {
            setErrors({ submit: error.response?.data?.message });
          }
          setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...rest}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <FormLabel htmlFor="email">{t('text.EMAIL_USERNAME')}</FormLabel>
              <TextField
                id="email"
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                value={values.email}
                variant="outlined"
              />
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ mt: 3, mb: 1 }}>
              <FormLabel htmlFor="outlined-adornment-password">{t('text.PASSWORD')}</FormLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
            </FormControl>

            {errors.submit && (
              <Box mt={3}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box mt={2}>
              <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                {t('text.LOGIN')}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
