import React, { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';

const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const VehicleAvailability = Loadable(lazy(() => import('views/Vehicle Calendar')));
const Vehicles = Loadable(lazy(() => import('views/Vehicles')));
const Drivers = Loadable(lazy(() => import('views/Drivers')));
const Bookings = Loadable(lazy(() => import('views/Bookings')));
const Customer = Loadable(lazy(() => import('views/Customer')));
const Maintenance = Loadable(lazy(() => import('views/Maintenance')));
const Fuel = Loadable(lazy(() => import('views/FuelManagement')));
const Reminder = Loadable(lazy(() => import('views/Reminder')));
const Finance = Loadable(lazy(() => import('views/IncomeExpense')));
const UserManagement = Loadable(lazy(() => import('views/UserManagement')));
const PartsInventory = Loadable(lazy(() => import('views/PartsInventory')));
const Reports = Loadable(lazy(() => import('views/Reports')));
const VehicleGroup = Loadable(lazy(() => import('views/Vehicle Group')));
const AddVehicle = Loadable(lazy(() => import('views/AddVehicle')));
const AddDriver = Loadable(lazy(() => import('views/AddDriver')));
const AddBooking = Loadable(lazy(() => import('views/AddBooking')));
const AddFuel = Loadable(lazy(() => import('views/AddFuel')));
const AddMaintenance = Loadable(lazy(() => import('views/AddMaintenance')));
const ViewVehiclePage = Loadable(lazy(() => import ('views/ViewVehicle')));
const ViewBookingsPage = Loadable(lazy(() => import('views/ViewBookings')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/dashboard/default',
      element: <DashboardDefault />
    },
    {
      path: '/vehicleavailability',
      element: <VehicleAvailability />
    },
    {
      path: '/vehicles',
      element: <Vehicles />
    },
    {
      path: '/vehiclegroup',
      element: <VehicleGroup />
    },
    {
      path: '/add-vehicle',
      element: <AddVehicle />
    },
    {
      path: '/add-vehicle/:id',
      element: <AddVehicle />
    },
    {
      path: '/view-vehicle/:id',
      element: <ViewVehiclePage />
    },
    {
      path: '/drivers',
      element: <Drivers />
    },
    {
      path: '/add-driver',
      element: <AddDriver />
    },
    {
      path: '/add-driver/:id',
      element: <AddDriver />
    },
    {
      path: '/booking',
      element: <Bookings />
    },
    {
      path: '/add-booking',
      element: <AddBooking />
    },
    {
      path: '/add-booking/:id',
      element: <AddBooking />
    },
    {
      path: '/view-booking/:id',
      element: <ViewBookingsPage />
    },
    {
      path: '/customer',
      element: <Customer />
    },
    {
      path: '/partsinventory',
      element: <PartsInventory />
    },
    {
      path: '/maintenance',
      element: <Maintenance />
    },
    {
      path: '/add-maintenance',
      element: <AddMaintenance />
    },
    {
      path: '/fuel',
      element: <Fuel />
    },
    {
      path: '/add-fuel',
      element: <AddFuel/>
    },
    {
      path: '/add-fuel/:id',
      element: <AddFuel/>
    },
    {
      path: '/reminder',
      element: <Reminder />
    },
    {
      path: '/finance',
      element: <Finance />
    },
    {
      path: '/reports',
      element: <Reports />
    },
    {
      path: '/users',
      element: <UserManagement />
    },
  ]
};

export default MainRoutes;
