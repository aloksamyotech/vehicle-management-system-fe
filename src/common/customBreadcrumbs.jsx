import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Breadcrumbs, Typography, Link as MuiLink } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

const CustomBreadcrumbs = ({ title, links = [] }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#ffff',
        padding: '10px',
        marginBottom:'15px',
        borderRadius: '8px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Breadcrumbs aria-label="breadcrumb" separator="/">
        <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
          <HomeIcon sx={{ color: '#17a2b8', mt:'5px' }} />
        </MuiLink>
        {links.map((link, index) =>
          index === links.length - 1 ? (
            <Typography key={index} color="text.primary">
              {link.name}
            </Typography>
          ) : (
            <MuiLink key={index} component={Link} to={link.path} color="inherit" underline="hover">
              {link.name}
            </MuiLink>
          )
        )}
      </Breadcrumbs>
    </Box>
  );
};

export default CustomBreadcrumbs;
