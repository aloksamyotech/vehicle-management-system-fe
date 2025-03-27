import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Card } from '@mui/material';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import CustomBreadcrumbs from 'common/customBreadcrumbs';
import { text } from 'common/constant';

const VehicleAvailability = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingResponse, maintenanceResponse] = await Promise.all([getApi(urls.booking.get), getApi(urls.maintenance.get)]);

        const bookingData = bookingResponse.data;
        const maintenanceData = maintenanceResponse.data;

        const bookingEvents = bookingData.map((item) => ({
          id: `booking-${item._id}`,
          title: `${item.vehicle.registrationNo} - ${item.vehicle.vehicleName} [${item.tripStartLoc} to ${item.tripEndLoc}]`,
          start: item.tripStartDate,
          end: item.tripEndDate,
          backgroundColor: '#28a745',
          textColor: 'white'
        }));

        const maintenanceEvents = maintenanceData.map((item) => ({
          id: `maintenance-${item._id}`,
          title: `Maintenance: ${item.vehicle.registrationNo} - ${item.vehicle.vehicleName} [${item.details}]`,
          start: item.startDate,
          end: item.endDate,
          backgroundColor: '#dc3545',
          textColor: 'white'
        }));

        setEvents([...bookingEvents, ...maintenanceEvents]);
      } catch (error) {
        console.error(text.ERROR_FETCHING, error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
     <CustomBreadcrumbs title={text.CALENDAR} links={[{ name: text.CALENDAR, path: '/vehicleavailability' }]} />
    
      <Card style={{ height: 'auto', marginTop: '20px' }}>
        <Box sx={{ padding: '10px 10px' }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            width="100%"
            events={events}
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
              <div
                style={{
                  backgroundColor: eventInfo.event.backgroundColor,
                  color: eventInfo.event.textColor,
                  padding: '1px',
                  borderRadius: '5px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden', 
                }}
              >
                {eventInfo.event.title}
              </div>
            )}
          />
        </Box>
      </Card>
    </>
  );
};

export default VehicleAvailability;
