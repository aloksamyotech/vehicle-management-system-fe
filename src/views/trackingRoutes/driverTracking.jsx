// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import { getApi } from 'common/apiClient';
// import { urls } from 'common/urls';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-routing-machine/dist/leaflet-routing-machine.css?inline';
// import Routing from './mapline';

// const currentIcon = new L.Icon({
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//   shadowSize: [41, 41]
// });

// const startIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//   shadowSize: [41, 41]
// });

// const endIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//   shadowSize: [41, 41]
// });

// // Force map resize on render
// const ResizeMap = () => {
//   const map = useMap();
//   useEffect(() => {
//     setTimeout(() => map.invalidateSize(), 100);
//   }, [map]);
//   return null;
// };

// const LiveMap = () => {
//   const { bookingId } = useParams();
//   const [position, setPosition] = useState(null);
//   const [address, setAddress] = useState('');
//   const [startTripLocation, setStartTripLocation] = useState(null);
//   const [endTripLocation, setEndTripLocation] = useState(null);

//   useEffect(() => {
//     const fetchLocation = async () => {
//       try {
//         const res = await getApi(`${urls?.location?.getById}/${bookingId}`);
//         const data = res.data;
//         if (!data) return;

//         const { latitude, longitude } = data;

//         const startTrip = { latitude: 22.735204, longitude: 75.830985 };
//         const endTrip = { latitude: 21.8306425, longitude: 76.3112148};

//         if (latitude && longitude) {
//           setPosition({ lat: latitude, lng: longitude });
//           const rev = await getApi(`${urls.location.reverse}/${latitude}/${longitude}`);
//           if (rev?.data) setAddress(rev.data.display_name || '');
//         }

//         if (startTrip.latitude && startTrip.longitude)
//           setStartTripLocation({ lat: startTrip.latitude, lng: startTrip.longitude });

//         if (endTrip.latitude && endTrip.longitude)
//           setEndTripLocation({ lat: endTrip.latitude, lng: endTrip.longitude });
//       } catch (err) {
//         console.error('Location fetch error:', err);
//       }
//     };

//     fetchLocation();
//     const id = setInterval(fetchLocation, 5000);
//     return () => clearInterval(id);
//   }, [bookingId]);

//   if (!position) return <p>Loading live location...</p>;

//   return (
//     <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
//       <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
//         <ResizeMap />
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="&copy; OpenStreetMap contributors"
//         />

//         {/* Current live marker */}
//         <Marker position={[position.lat, position.lng]} icon={currentIcon}>
//           <Popup>
//             <strong>Current Location:</strong><br />
//             {address || 'Fetching address...'}
//           </Popup>
//         </Marker>

//         {/* Start Trip Marker */}
//         {startTripLocation && (
//           <Marker position={[startTripLocation.lat, startTripLocation.lng]} icon={startIcon}>
//             <Popup>Start Trip</Popup>
//           </Marker>
//         )}

//         {/* End Trip Marker */}
//         {endTripLocation && (
//           <Marker position={[endTripLocation.lat, endTripLocation.lng]} icon={endIcon}>
//             <Popup>End Trip</Popup>
//           </Marker>
//         )}
//           {/* {startTripLocation && endTripLocation && (
//           <Routing start={startTripLocation} end={endTripLocation} />
//         )} */}
//       </MapContainer>
//     </div>
//   );
// };

// export default LiveMap;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css?inline';
import Routing from './mapline';

const currentIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const ResizeMap = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
};

const LiveMap = () => {
  const { bookingId } = useParams();
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [startTripLocation, setStartTripLocation] = useState(null);
  const [endTripLocation, setEndTripLocation] = useState(null);
  useEffect(() => {
    const fetchTripLocations = async () => {
      try {
        const res = await getApi(`${urls?.location?.tripByBookingId}/${bookingId}`);
        const data = res.data;
        if (!data) return;

        const { tripStartLoc, tripEndLoc } = data;
        if (tripStartLoc) {
          const geoRes = await getApi(`${urls.location.forward}/${encodeURIComponent(tripStartLoc)}`);

          if (geoRes?.data) {
            setStartTripLocation({
              lat: parseFloat(geoRes?.data?.lat),
              lng: parseFloat(geoRes.data?.lon)
            });
          }
        }

        if (tripEndLoc) {
          const geoRes = await getApi(`${urls.location.forward}/${encodeURIComponent(tripEndLoc)}`);
          if (geoRes?.data) {
            setEndTripLocation({
              lat: parseFloat(geoRes?.data?.lat),
              lng: parseFloat(geoRes?.data?.lon)
            });
          }
        }
      } catch (err) {
        console.error('Trip location fetch error:', err);
      }
    };

    fetchTripLocations();
  }, [bookingId]);

  useEffect(() => {
    const fetchLiveLocation = async () => {
      try {
        const res = await getApi(`${urls?.location?.getById}/${bookingId}`);
        const data = res.data;
        if (!data) return;

        const { latitude, longitude } = data;

        if (latitude && longitude) {
          setPosition({ lat: latitude, lng: longitude });

          const rev = await getApi(`${urls.location.reverse}/${latitude}/${longitude}`);
          if (rev?.data) setAddress(rev.data.display_name || '');
        }
      } catch (err) {
        console.error('Live location fetch error:', err);
      }
    };

    fetchLiveLocation();
    const id = setInterval(fetchLiveLocation, 5000);
    return () => clearInterval(id);
  }, [bookingId]);

  if (!position) return <p>Driver location not found try to loading live location  ...</p>;

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <ResizeMap />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

        {/* Current live marker */}
        <Marker position={[position.lat, position.lng]} icon={currentIcon}>
          <Popup>
            <strong>Current Location:</strong>
            <br />
            {address || 'Fetching address...'}
          </Popup>
        </Marker>

        {/* Start Trip Marker */}
        {startTripLocation && (
          <Marker position={[startTripLocation.lat, startTripLocation.lng]} icon={startIcon}>
            <Popup>Start Trip</Popup>
          </Marker>
        )}

        {/* End Trip Marker */}
        {endTripLocation && (
          <Marker position={[endTripLocation.lat, endTripLocation.lng]} icon={endIcon}>
            <Popup>End Trip</Popup>
          </Marker>
        )}
        {startTripLocation && endTripLocation && <Routing start={startTripLocation} current={position} end={endTripLocation} />}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
