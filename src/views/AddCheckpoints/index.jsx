import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { TextField, Button, IconButton, Grid, Box, Card, Typography, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { postApi, getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Delete, DirectionsCar } from '@mui/icons-material';

const dotColors = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];

const AddCheckpointForm = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const bookingId = location.state?.bookingId;
  const [bookings, setBookings] = useState({});
  const [checkpoints, setCheckpoints] = useState([]);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      checkpoints: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'checkpoints'
  });

  const handleAddCheckpoint = () => {
    append({ cityName: '' });
  };

  const onSubmit = async (data) => {
    const isAnyFieldEmpty = data.checkpoints.some((cp) => !cp.cityName.trim());
    if (isAnyFieldEmpty) {
      toast.error(t('text.FILL_CHECKPOINTS_FEILD'));
      return;
    }

    const cleanedData = {
      checkpoints: data.checkpoints.map((cp) => ({
        cityName: cp.cityName
      }))
    };

    const endpoint = urls.booking.addCheckpoint.replace(':id', bookingId);
    const res = await postApi(endpoint, cleanedData);
    toast.success(t('text.CHECKPOINTS_ADDED'));
    reset({
      checkpoints: []
    });
    fetchCheckpointsData();
  };

  const fetchCheckpointsData = async () => {
    if (bookingId) {
      const response = await getApi(urls.booking.getCheckpoint.replace(':bookingId', bookingId));
      const sorted = response?.data?.sort((a, b) => a.order - b.order) || [];
      setCheckpoints(sorted);
    }
  };

  useEffect(() => {
    fetchCheckpointsData();
  }, [bookingId]);

  const fetchBookingData = async () => {
    const response = await getApi(urls.booking.getById.replace(':id', bookingId));
    setBookings(response?.data);
  };

  useEffect(() => {
    if (bookingId) {
      fetchBookingData();
    }
  }, [bookingId]);

  const formattedTimelineItems = [];

  if (bookings.tripStartLoc) {
    formattedTimelineItems.push({
      isSpecialLocation: true,
      cityName: bookings.tripStartLoc,
      updatedAt: bookings.tripStartDate,
      isActive: true, 
    });
  }

  formattedTimelineItems.push(...checkpoints);

  if (bookings.tripEndLoc) {
    const allCheckpointsActive = checkpoints.every(cp => cp.isActive === true || cp.isActive === 'true');
    formattedTimelineItems.push({
      isSpecialLocation: true,
      cityName: bookings.tripEndLoc,
      updatedAt: bookings.tripEndDate,
      isActive: allCheckpointsActive,
    });
  }

  return (
    <>
      <CustomBreadcrumbs
        title={t('text.ADD_CHECKPOINTS')}
        links={[
          { name: t('text.BOOKINGS'), path: '/booking' },
          { name: t('text.ADD_CHECKPOINTS'), path: '' }
        ]}
      />

      <Card sx={{ maxWidth: 'auto', mt: 3, padding: 1 }}>
        <CardContent>
          <Box display="flex" justifyContent="center">
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', maxWidth: 600 }}>
              <Grid container spacing={2}>
                {fields?.map((checkpoint, index) => (
                  <Grid item xs={12} key={checkpoint.id}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={10}>
                        <Controller
                          name={`checkpoints[${index}].cityName`}
                          control={control}
                          defaultValue={checkpoint.cityName || ''}
                          render={({ field }) => <TextField {...field} label="City Name" fullWidth />}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <IconButton color="error" onClick={() => remove(index)}>
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>

              <Box mt={2}>
                <Button variant="outlined" onClick={handleAddCheckpoint}>
                  + {t('text.ADD_CHECKPOINTS')}
                </Button>
              </Box>

              <Box mt={2} display="flex" justifyContent="center">
                <Button variant="contained" color="primary" type="submit" disabled={fields.length === 0}>
                  {t('text.SAVE_CHECKPOINTS')}
                </Button>
              </Box>
            </form>
          </Box>

          <Box sx={{ maxWidth: 600, margin: 'auto', mt: 3 }}>
            <Timeline position="alternate">
              {formattedTimelineItems.map((item, index, array) => {
                const isSpecialLocation = item.isSpecialLocation;
                const isActive = item.isActive === true || item.isActive === 'true';

                return (
                  <TimelineItem key={item.id || `loc-${index}`}>
                    <TimelineOppositeContent color="text.secondary" variant="body2">
                      {isSpecialLocation ? (
                        index === 0 ? t('text.TRIP_START_LOC') : t('text.TRIP_END_LOC')
                      ) : (
                        item.updatedAt ? new Date(item.updatedAt).toLocaleString() : ''
                      )}
                    </TimelineOppositeContent>

                    <TimelineSeparator>
                      {index !== 0 && <TimelineConnector sx={{ height: 20, bgcolor: 'secondary.main' }} />}
                      <TimelineDot color={isSpecialLocation ? 'primary' : dotColors[index % dotColors.length]}>
                        <DirectionsCar />
                      </TimelineDot>
                      {index !== array.length - 1 && <TimelineConnector sx={{ height: 20, bgcolor: 'secondary.main' }} />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography
                        variant="h5"
                        color={isActive ? 'text.primary' : 'text.disabled'}
                        fontWeight={isActive ? 'bold' : 'normal'}
                      >
                        {item.cityName}
                      </Typography>
                      {!isSpecialLocation && (
                        <Typography variant="body2" color={isActive ? 'text.secondary' : 'text.disabled'}>
                          {/* {isActive ? 'Active' : 'Inactive checkpoint'} */}
                        </Typography>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default AddCheckpointForm;
