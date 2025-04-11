import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Grid, List, ListItem, ListItemText, Divider, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import toast from 'react-hot-toast';
import { text } from 'common/constant';
import { useTranslation } from 'react-i18next';

const ReminderCard = () => {
  const [reminders, setReminders] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReminders = async () => {
        const response = await getApi(urls.reminder.get);
        const { todaysReminders } = response?.data || {};
        setReminders(todaysReminders || []);
    };

    fetchReminders();
  }, []);

  return (
    <Grid item xs={12} sx={{ display: { md: 'block', sm: 'none' } }}>
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
                  const message = `${vehicle?.vehicleName || 'Vehicle'} (${vehicle?.registrationNo || ''}) - ${item.message}`;
                  return (
                    <ListItem key={index} alignItems="flex-start" sx={{ py: 1 }}>
                      <Box sx={{ mr: 1 }}>
                        <Typography variant="subtitle2" sx={{mt:'6px'}}>{index + 1}.</Typography>
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
