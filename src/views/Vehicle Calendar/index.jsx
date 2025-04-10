import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Card, MenuItem, Select, Typography, Tooltip } from '@mui/material';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant';
import { useTranslation } from 'react-i18next';

const VehicleAvailability = () => {
     const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingResponse, maintenanceResponse, vehicleResponse] = await Promise.all([
          getApi(`${urls.booking.get}?all=true`),
          getApi(`${urls.maintenance.get}?all=true`),
          getApi(`${urls.vehicle.get}?all=true`),
        ]);

        const bookingData = bookingResponse?.data?.bookingDetails || [];
        const maintenanceData = maintenanceResponse?.data?.mainDetails || [];
        const vehicleData = vehicleResponse?.data?.vehicleDetails || [];

        setVehicles(vehicleData);

        const bookingEvents = bookingData.map((item) => ({
          id: `booking-${item.id}`,
          title: `${item.vehicle.registrationNo} - ${item.vehicle.vehicleName} [${item.tripStartLoc} to ${item.tripEndLoc}]`,
          start: item.tripStartDate,
          end: item.tripEndDate,
          backgroundColor: '#28a745',
          textColor: 'white',
          vehicleId: item.vehicle.id
        }));

        const maintenanceEvents = maintenanceData.map((item) => ({
          id: `maintenance-${item.id}`,
          title: `Maintenance: ${item.vehicle.registrationNo} - ${item.vehicle.vehicleName} [${item.details}]`,
          start: item.startDate,
          end: item.endDate,
          backgroundColor: '#dc3545',
          textColor: 'white',
          vehicleId: item.vehicle.id
        }));

        setEvents([...bookingEvents, ...maintenanceEvents]);
      } catch (error) {
        console.error(t('text.ERROR_FETCHING'));
      }
    };

    fetchData();
  }, []);

  const filteredEvents = selectedVehicleId ? events.filter((event) => event.vehicleId === selectedVehicleId) : events;

  return (
    <>
      <CustomBreadcrumbs title={t('text.CALENDAR')} links={[{ name: t('text.CALENDAR'), path: '/vehicleavailability' }]} />

      <Card style={{ height: 'auto', marginTop: '20px', padding: '10px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '10px' }}>
          <Typography sx={{ fontWeight: 'bold' }}>{t('text.SELECT_VEHICLE')}:</Typography>
          <Select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            displayEmpty
            size="small"
            sx={{ width: '200px' }}
          >
            <MenuItem value="">{t('text.ALL_VEHICLE')}</MenuItem>
            {vehicles.map((vehicle) => (
              <MenuItem key={vehicle.id} value={vehicle.id}>
                {vehicle.registrationNo} - {vehicle.vehicleName}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={filteredEvents}
          height="auto"
          headerToolbar={{
            left: 'prev,today,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day'
          }}
          eventContent={(eventInfo) => (
            <Tooltip title={`${eventInfo.event.title} ( ${eventInfo.event.startStr} - ${eventInfo.event.endStr} )`} arrow>
              <div
                style={{
                  backgroundColor: eventInfo.event.backgroundColor,
                  color: eventInfo.event.textColor,
                  padding: '2px',
                  borderRadius: '5px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }}
              >
                {eventInfo.event.title}
              </div>
            </Tooltip>
          )}
        />
      </Card>
    </>
  );
};

export default VehicleAvailability;
