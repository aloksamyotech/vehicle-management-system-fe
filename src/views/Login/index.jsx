import React from 'react';
import { Grid, Card, CardContent, Typography, Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AuthLogin from './AuthLogin';
import VehicleImage from '../../../public/vehicle.jpg';
import LogoSection from 'layout/MainLayout/Header/LogoSection';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: '#ffff',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isSmallScreen ? 2 : 4,
          textAlign: 'center'
        }}
      >
        <Typography
          variant={isSmallScreen ? 'h5' : 'h4'}
          sx={{
            fontWeight: 'bold',
            marginBottom: 3,
            color: 'black'
          }}
        >
          {t('text.WELCOME_FLEET')}
        </Typography>

        <Box
          component="img"
          src={VehicleImage}
          alt="Login Illustration"
          sx={{
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain',
            borderRadius: '20px',
            width: isSmallScreen ? '90%' : '80%',
            marginBottom: '1rem'
          }}
        />
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: '#0769b4',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isSmallScreen ? 2 : 0
        }}
      >
        <Card
          sx={{
            backgroundColor: '#fff',
            borderRadius: 3,
            width: isSmallScreen ? '90%' : '80%',
            maxWidth: 400,
            padding: isSmallScreen ? 2 : 3,
            boxShadow: 5
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '2px'
              }}
            >
              <LogoSection />
            </Box>

            <AuthLogin />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;
