import React, { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';
import ProtectedRoute from 'common/authHelper.jsx';

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
const ViewVehiclePage = Loadable(lazy(() => import('views/ViewVehicle')));
const ViewBookingsPage = Loadable(lazy(() => import('views/ViewBookings')));
const Invoice = Loadable(lazy(() => import('views/BookingInvoice')));
const Profile = Loadable(lazy(() => import('views/Profile')));
const AddUser = Loadable(lazy(() => import('views/ViewUser')));
const Unauthorized = Loadable(lazy(() => import('views/Unauthorized')));
const ViewCustomer = Loadable(lazy(() => import('views/ViewCustomer')));
const ViewDriver = Loadable(lazy(() => import('views/ViewDriver')));
const DriverAlert = Loadable(lazy(() => import('views/DriverAlert')));
const VehicleBreakdown = Loadable(lazy(() => import('views/VehicleBreakdown')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: (
        <ProtectedRoute requiredPermission="DASHBOARD_READ">
          <DashboardDefault />
        </ProtectedRoute>
      )
    },
    {
      path: '/dashboard/default',
      element: (
        <ProtectedRoute requiredPermission="DASHBOARD_READ">
          <DashboardDefault />
        </ProtectedRoute>
      )
    },
    {
      path: '/vehicleavailability',
      element: (
        <ProtectedRoute requiredPermission="AVAILABILITY_READ">
          <VehicleAvailability />
        </ProtectedRoute>
      )
    },
    {
      path: '/vehicles',
      element: (
        <ProtectedRoute requiredPermission="VEHICLES_READ">
          <Vehicles />
        </ProtectedRoute>
      )
    },
    {
      path: '/vehiclegroup',
      element: (
        <ProtectedRoute requiredPermission="VEHICLES_READ">
          <VehicleGroup />
        </ProtectedRoute>
      )
    },
    {
      path: '/add-vehicle',
      element: (
        <ProtectedRoute requiredPermission="VEHICLES_WRITE">
          <AddVehicle />
        </ProtectedRoute>
      )
    },
    {
      path: '/add-vehicle/:id',
      element: (
        <ProtectedRoute requiredRole="ADMIN">
          <AddVehicle />
        </ProtectedRoute>
      )
    },
    {
      path: '/view-vehicle/:id',
      element: (
        <ProtectedRoute requiredRole="ADMIN">
          <ViewVehiclePage />
        </ProtectedRoute>
      )
    },
    {
      path: '/drivers',
      element: (
        <ProtectedRoute requiredPermission="DRIVERS_READ">
          <Drivers />
        </ProtectedRoute>
      )
    },
    {
      path: '/add-driver',
      element: (
        <ProtectedRoute requiredPermission="DRIVERS_WRITE">
          <AddDriver />
        </ProtectedRoute>
      )
    },
    {
      path: '/add-driver/:id',
      element: (
        <ProtectedRoute requiredRole="ADMIN">
          <AddDriver />
        </ProtectedRoute>
      )
    },
    {
      path: '/view-driver/:id',
      element: (
        <ProtectedRoute requiredRole="ADMIN">
          <ViewDriver />
        </ProtectedRoute>
      )
    },
    {
      path: '/booking',
      element: (
        <ProtectedRoute requiredPermission="BOOKINGS_READ">
          <Bookings />
        </ProtectedRoute>
      )
    },
    {
      path: '/add-booking',
      element: (
        <ProtectedRoute requiredPermission="BOOKINGS_WRITE">
          <AddBooking />
        </ProtectedRoute>
      )
    },
    {
      path: '/add-booking/:id',
      element: (
        <ProtectedRoute requiredRole="ADMIN">
          <AddBooking />
        </ProtectedRoute>
      )
    },
    {
      path: '/view-booking/:id',
      element: (
        <ProtectedRoute requiredRole="ADMIN">
          <ViewBookingsPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/invoice/:id',
      element: (
        <ProtectedRoute requiredRole="ADMIN">
          <Invoice />
        </ProtectedRoute>
      )
    },
    {
      path: '/customer',
      element: (
        <ProtectedRoute requiredPermission="CUSTOMER_READ">
          <Customer />
        </ProtectedRoute>
      )
    },
    {
      path: '/view-customer/:id',
      element: (
        <ProtectedRoute requiredRole="ADMIN">
          <ViewCustomer />
        </ProtectedRoute>
      )
    },
    {
      path: '/partsinventory',
      element: (
        <ProtectedRoute requiredPermission="PARTS_READ">
          <PartsInventory />
        </ProtectedRoute>
      )
    },
    {
      path: '/maintenance',
      element: (
        <ProtectedRoute requiredPermission="MAINTENANCE_READ">
          <Maintenance />
        </ProtectedRoute>
      )
    },
    {
      path: '/add-maintenance',
      element: (
        <ProtectedRoute requiredPermission="MAINTENANCE_WRITE">
          <AddMaintenance />
        </ProtectedRoute>
      )
    },
    {
      path: '/fuel',
      element: (
        <ProtectedRoute requiredPermission="FUEL_READ">
          <Fuel />
        </ProtectedRoute>
      )
    },
    {
      path: '/add-fuel',
      element: (
        <ProtectedRoute requiredPermission="FUEL_WRITE">
          <AddFuel />
        </ProtectedRoute>
      )
    },
    {
      path: '/add-fuel/:id',
      element: (
        <ProtectedRoute requiredRole="ADMIN">
          <AddFuel />
        </ProtectedRoute>
      )
    },
    {
      path: '/reminder',
      element: (
        <ProtectedRoute requiredPermission="REMINDER_READ">
          <Reminder />
        </ProtectedRoute>
      )
    },
    {
      path: '/finance',
      element: (
        <ProtectedRoute requiredPermission="FINANCE_READ">
          <Finance />
        </ProtectedRoute>
      )
    },
    {
      path: '/reports',
      element: (
        <ProtectedRoute requiredPermission="REPORTS_READ">
          <Reports />
        </ProtectedRoute>
      )
    },
    {
      path: '/users',
      element: (
        <ProtectedRoute requiredRole="ADMIN">
          <UserManagement />
        </ProtectedRoute>
      )
    },
    {
      path: '/view-user/:id',
      element: (
        <ProtectedRoute requiredRole="ADMIN">
          <AddUser />
        </ProtectedRoute>
      )
    },
    {
      path: '/profile',
      element: <Profile />
    },
    {
      path: '/unauthorized',
      element: <Unauthorized />
    },
    {
      path: '/driver-alert',
      element: (
        <ProtectedRoute requiredRole="ADMIN">
          <DriverAlert />
        </ProtectedRoute>
      )
    },
    {
      path: '/breakdown',
      element: (
        <ProtectedRoute requiredRole="ADMIN">
          <VehicleBreakdown />
        </ProtectedRoute>
      )
    }
  ]
};

export default MainRoutes;
