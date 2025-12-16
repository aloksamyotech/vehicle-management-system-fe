// import { useEffect } from "react";
// import { useMap } from "react-leaflet";
// import L from "leaflet";
// import "leaflet-routing-machine";

// const Routing = ({ start, end }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (!map || !start || !end) return;

//     // Clear previous routing control
//     map.eachLayer((layer) => {
//       if (layer.options && layer.options.waypoints) {
//         map.removeControl(layer);
//       }
//     });

//     const routingControl = L.Routing.control({
//       waypoints: [
//         L.latLng(start.lat, start.lng),
//         L.latLng(end.lat, end.lng),
//       ],
//       routeWhileDragging: false,
//       addWaypoints: false,
//       draggableWaypoints: false,
//       fitSelectedRoutes: true,
//       showAlternatives: false,
//       lineOptions: {
//         styles: [{ color: "blue", weight: 4 }]
//       }
//     }).addTo(map);

//     return () => {
//       map.removeControl(routingControl);
//     };
//   }, [map, start, end]);

//   return null;
// };

// export default Routing;
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

const Routing = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !start || !end) return;

    // Remove previous routing
    map.eachLayer((layer) => {
      if (layer.options && layer.options.waypoints) {
        map.removeControl(layer);
      }
    });

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: "blue", weight: 5 }]
      },
      createMarker: function(i, waypoint) {
        let iconUrl;
        if (i === 0) {
          // Start (Green)
          iconUrl = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png";
        } else {
          // End (Red)
          iconUrl = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png";
        }

        return L.marker(waypoint.latLng, {
          icon: new L.Icon({
            iconUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            shadowSize: [41, 41],
          })
        });
      }
    });

    // Hide summary panel
    routingControl.on("routesfound", function() {
      const container = routingControl.getContainer();
      if (container) container.style.display = "none";
    });

    routingControl.addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end]);

  return null;
};

export default Routing;
