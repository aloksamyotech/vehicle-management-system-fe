import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Link } from 'react-router-dom';
import { Box, Typography, Breadcrumbs, Link as MuiLink, Card } from '@mui/material';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';

const VehicleAvailability = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchMaintenanceData = async () => {
        const response = await getApi(urls.maintenance.get);
        const maintenanceData = response.data;

        const formattedEvents = maintenanceData.map((item) => ({
          title: `Maintenance: ${item.vehicle.registrationNo} - ${item.vehicle.vehicleName} [${item.details}]`,
          start: item.startDate,
          end: item.endDate,
          backgroundColor: '#ff0000', 
          textColor: 'white',
        }));

        setEvents(formattedEvents);
    };

    fetchMaintenanceData();
  }, []);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0, m: 0 }}>
        <Typography variant="h3" sx={{ m: 0 }}>Vehicle Calendar</Typography>
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit" underline="none">
            <Typography color="#17a2b8">Dashboard</Typography>
          </MuiLink>
          <Typography color="text.primary">Vehicle Calendar</Typography>
        </Breadcrumbs>
      </Box>

      <Card style={{ height: 'auto', marginTop: '20px' }}>
        <Box sx={{ padding: '10px 20px' }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            selectable={true}
            editable={true}
            eventClick={(info) => alert(`Vehicle: ${info.event.title}`)}
            height="auto"
            headerToolbar={{
              left: 'prev,today,next',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            buttonText={{
              today: 'Today',
              month: 'Month',
              week: 'Week',
              day: 'Day',
            }}
            eventContent={(eventInfo) => (
              <div style={{
                backgroundColor: eventInfo.event.backgroundColor,
                color: eventInfo.event.textColor,
                padding: '1px',
                borderRadius: '5px',
              }}>
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
