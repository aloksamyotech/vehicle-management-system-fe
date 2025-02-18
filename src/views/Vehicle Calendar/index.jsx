import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridWeek from '@fullcalendar/timegrid';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Breadcrumbs, Link as MuiLink, Card } from '@mui/material';

const VehicleAvailability = () => {
  const [events, setEvents] = useState([
    {
      title: 'Truck A - Booked',
      start: '2025-02-10T10:00:00',
      end: '2025-02-10T16:00:00',
      backgroundColor: 'red', 
      textColor: 'white',
    },
    {
      title: 'Bus B - Maintenance',
      start: '2025-02-12',
      end: '2025-02-14',
      backgroundColor: '#ffc107', 
      textColor: 'white',
    },
    {
      title: 'Van C - Available',
      start: '2025-02-15',
      end: '2025-02-15',
      backgroundColor: '#30aa4c',
      textColor: 'white',
    },
  ]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 0,
          m: 0,
        }}
      >
        <Typography variant="h3" sx={{ m: 0 }}>
          Vehicle Calendar
        </Typography>
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
          plugins={[dayGridPlugin, timeGridWeek, interactionPlugin]}
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
            <div
              style={{
                backgroundColor: eventInfo.event.backgroundColor,
                color: eventInfo.event.textColor,
                padding: '5px',
                borderRadius: '5px',
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
