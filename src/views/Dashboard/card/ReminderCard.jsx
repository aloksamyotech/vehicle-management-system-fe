import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Grid, List, ListItem, ListItemText, Divider, Box, Pagination } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import { text } from 'common/constant';
import { useTranslation } from 'react-i18next';

const ReminderCard = () => {
  const [reminders, setReminders] = useState([]);
  const [todayPage, setTodayPage] = useState(1);
  const [todayLimit] = useState(5);
  const [totalTodayPages, setTotalTodayPages] = useState(1);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchReminders = async (page = 1) => {
    const response = await getApi(`${urls.reminder.get}?todayPage=${page}&todayLimit=${todayLimit}`);
    const { todaysReminders, todayPagination } = response?.data || {};
    setReminders(todaysReminders || []);
    setTotalTodayPages(todayPagination?.totalPages || 1);
  };

  useEffect(() => {
    fetchReminders(todayPage);
  }, [todayPage]);

  const handlePageChange = (_event, value) => {
    setTodayPage(value);
  };

  return (
    <Grid item xs={12}>
      <Card>
        <Box sx={{ position: 'relative' }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: '600' }}>
              {t('text.REM')}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <List dense>
              {reminders.length > 0 ? (
                reminders.map((item, index) => {
                  const vehicle = item.vehicle;
                  return (
                    <ListItem key={index} alignItems="flex-start" sx={{ py: 1 }}>
                      <Box sx={{ mr: 1 }}>
                        <Typography variant="subtitle2" sx={{ mt: '6px' }}>
                          {(todayPage - 1) * todayLimit + index + 1}.
                        </Typography>
                      </Box>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {vehicle?.vehicleName || 'Vehicle'} ({vehicle?.registrationNo || 'N/A'})
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'normal' }}>
                            {item.message}
                          </Typography>
                        }
                      />
                    </ListItem>
                  );
                })
              ) : (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {t('text.NO_REM')}
                </Typography>
              )}
            </List>

            {totalTodayPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1}}>
                <Pagination count={totalTodayPages} page={todayPage} onChange={handlePageChange} color="primary" size="small" />
              </Box>
            )}
          </CardContent>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate('/reminder')}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              textTransform: 'none',
              fontWeight: 500,
              backgroundColor: '#17a2b8',
              '&:hover': {
                backgroundColor: '#138496'
              }
            }}
          >
            {t('text.ADD_REM')}
          </Button>
        </Box>
      </Card>
    </Grid>
  );
};

export default ReminderCard;
