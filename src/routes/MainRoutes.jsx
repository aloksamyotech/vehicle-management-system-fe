import React, { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';
import ProtectedRoute from 'common/protectedRoute.jsx';
import { FEATURE, PERMISSION } from 'common/permissionHelper.jsx';

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

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <ProtectedRoute element={<DashboardDefault />} featureId={FEATURE.DASHBOARD} permissionId={PERMISSION.READ} />
    },
    {
      path: '/dashboard/default',
      element: <ProtectedRoute element={<DashboardDefault />} featureId={FEATURE.DASHBOARD} permissionId={PERMISSION.READ} />
    },
    {
      path: '/vehicleavailability',
      element: <ProtectedRoute element={<VehicleAvailability />} featureId={FEATURE.AVAILABILITY} permissionId={PERMISSION.READ} />
    },
    {
      path: '/vehicles',
      element: <ProtectedRoute element={<Vehicles />} featureId={FEATURE.VEHICLES} permissionId={PERMISSION.READ} />
    },
    {
      path: '/vehiclegroup',
      element: <ProtectedRoute element={<VehicleGroup />} featureId={FEATURE.VEHICLE_GROUP} permissionId={PERMISSION.READ} />
    },
    {
      path: '/add-vehicle',
      element: <ProtectedRoute element={<AddVehicle />} featureId={FEATURE.VEHICLES} permissionId={PERMISSION.WRITE} />
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
      element: <ProtectedRoute element={<Drivers />} featureId={FEATURE.DRIVERS} permissionId={PERMISSION.READ} />
    },
    {
      path: '/add-driver',
      element: <ProtectedRoute element={<AddDriver />} featureId={FEATURE.DRIVERS} permissionId={PERMISSION.WRITE} />
    },
    {
      path: '/add-driver/:id',
      element: <AddDriver />
    },
    {
      path: '/booking',
      element: <ProtectedRoute element={<Bookings />} featureId={FEATURE.BOOKING} permissionId={PERMISSION.READ} />
    },
    {
      path: '/add-booking',
      element: <ProtectedRoute element={<AddBooking />} featureId={FEATURE.BOOKING} permissionId={PERMISSION.WRITE} />
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
      path: '/invoice/:id',
      element: <Invoice />
    },
    {
      path: '/customer',
      element: <ProtectedRoute element={<Customer />} featureId={FEATURE.CUSTOMER} permissionId={PERMISSION.READ} />
    },
    {
      path: '/partsinventory',
      element: <ProtectedRoute element={<PartsInventory />} featureId={FEATURE.PARTS} permissionId={PERMISSION.READ} />
    },
    {
      path: '/maintenance',
      element: <ProtectedRoute element={<Maintenance />} featureId={FEATURE.MAINTENANCE} permissionId={PERMISSION.READ} />
    },
    {
      path: '/add-maintenance',
      element: <ProtectedRoute element={<AddMaintenance />} featureId={FEATURE.MAINTENANCE} permissionId={PERMISSION.WRITE} />
    },
    {
      path: '/fuel',
      element: <ProtectedRoute element={<Fuel />} featureId={FEATURE.FUEL} permissionId={PERMISSION.READ} />
    },
    {
      path: '/add-fuel',
      element: <ProtectedRoute element={<AddFuel />} featureId={FEATURE.FUEL} permissionId={PERMISSION.WRITE} />
    },
    {
      path: '/add-fuel/:id',
      element: <AddFuel />
    },
    {
      path: '/reminder',
      element: <ProtectedRoute element={<Reminder />} featureId={FEATURE.REMINDER} permissionId={PERMISSION.READ} />
    },
    {
      path: '/finance',
      element: <ProtectedRoute element={<Finance />} featureId={FEATURE.FINANCE} permissionId={PERMISSION.READ} />
    },
    {
      path: '/reports',
      element: <ProtectedRoute element={<Reports />} featureId={FEATURE.REPORTS} permissionId={PERMISSION.READ} />
    },
    {
      path: '/users',
      element: <UserManagement />
    },
    {
      path: '/view-user/:id',
      element: <AddUser />
    },
    {
      path: '/profile',
      element: <Profile />
    }
  ]
};

export default MainRoutes;
