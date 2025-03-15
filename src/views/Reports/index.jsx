import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Breadcrumbs, Link as MuiLink, Tabs, Tab, Card, CardContent, TextField, MenuItem, Button } from '@mui/material';

const Reports = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
    setSelectedOption(''); // Reset dropdown when tab changes
  };

  const tabData = [
    { label: 'Bookings', title: 'Booking Report', options: ['Booking 1', 'Booking 2'] },
    { label: 'Income & Expense', title: 'Income & Expense Report', options: ['Income', 'Expense'] },
    { label: 'Fuel', title: 'Fuel Report', options: ['Fuel Type 1', 'Fuel Type 2'] },
    { label: 'Driver', title: 'Driver Report', options: ['Driver 1', 'Driver 2'] }
  ];

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
        <Typography variant="h3">Report</Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <Typography color="text.primary">Reports</Typography>
        </Breadcrumbs>
      </Box>

      <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
        {tabData.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      <Box sx={{ mt: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {tabData[tabIndex].title}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                label="Report From"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                sx={{ flex: 1, minWidth: 150 }}
              />
              <TextField
                label="Report To"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                sx={{ flex: 1, minWidth: 150 }}
              />
              <TextField
                select
                label={`Select ${tabData[tabIndex].label}`}
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                sx={{ flex: 1, minWidth: 180 }}
              >
                {tabData[tabIndex].options.map((option, i) => (
                  <MenuItem key={i} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="outlined"
                sx={{
                  borderColor: '#17a2b8', 
                  color: '#17a2b8', 
                  backgroundColor: 'white', 
                  '&:hover': {
                    backgroundColor: '#17a2b8',
                    borderColor: '#17a2b8',
                    color: '#ffff', 
                  }
                }}
              >
                Generate Report
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Reports;
