import React, { useEffect } from 'react';

import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import theme from 'themes';
import Routes from 'routes/index';
import NavigationScroll from './NavigationScroll';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();
const location = useLocation();
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     navigate('/login');
  //   }
  // }, []);
 useEffect(() => {
    const token = localStorage.getItem('token');
    const publicPaths = ['/login', '/track-driver/']; 

    const isPublic = publicPaths.some(path => location.pathname.startsWith(path));

    if (!token && !isPublic) {
      navigate('/login');
    }
  }, [location.pathname, navigate]);
  return (
    <>
      {
        <NavigationScroll>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme(customization)}>
              <CssBaseline />
              <Routes />
            </ThemeProvider>
          </StyledEngineProvider>
        </NavigationScroll>
      }
    </>
  );
};

export default App;
