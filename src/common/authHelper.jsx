import React from 'react';
import { Navigate } from 'react-router-dom';

export const FEATURE = {
  DASHBOARD: 1,
  AVAILABILITY: 2,
  VEHICLES: 3,
  DRIVERS: 4,
  BOOKINGS: 5,
  CUSTOMER: 6,
  MAINTENANCE: 7,
  PARTS_INVENTORY: 8,
  FUEL: 9,
  REMINDER: 10,
  INCOME_EXPENSE: 11,
  REPORTS: 12
};

export const PERMISSION = {
  READ: 1,
  WRITE: 2
};

export const FEATURE_PERMISSIONS = {
  [FEATURE.DASHBOARD]: [PERMISSION.READ],
  [FEATURE.AVAILABILITY]: [PERMISSION.READ],
  [FEATURE.VEHICLES]: [PERMISSION.READ, PERMISSION.WRITE],
  [FEATURE.DRIVERS]: [PERMISSION.READ, PERMISSION.WRITE],
  [FEATURE.BOOKINGS]: [PERMISSION.READ, PERMISSION.WRITE],
  [FEATURE.CUSTOMER]: [PERMISSION.READ, PERMISSION.WRITE],
  [FEATURE.MAINTENANCE]: [PERMISSION.READ, PERMISSION.WRITE],
  [FEATURE.PARTS_INVENTORY]: [PERMISSION.READ, PERMISSION.WRITE],
  [FEATURE.FUEL]: [PERMISSION.READ, PERMISSION.WRITE],
  [FEATURE.INCOME_EXPENSE]: [PERMISSION.READ, PERMISSION.WRITE],
  [FEATURE.REMINDER]: [PERMISSION.READ, PERMISSION.WRITE],
  [FEATURE.REPORTS]: [PERMISSION.READ]
};

const ProtectedRoute = ({ requiredPermission, requiredRole, children }) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const userPermissions = JSON.parse(localStorage.getItem('permissions')) || [];

  if (requiredRole && userData.role !== requiredRole) {
    return <ClearStorageAndRedirect />;
  }

  if (userData?.role === 'ADMIN') {
    return children;
  }

  if (userData?.role === 'USER') {
    if (!requiredPermission || userPermissions.includes(requiredPermission)) {
      return children;
    } else {
      return <ClearStorageAndRedirect />;
    }
  }

  return <ClearStorageAndRedirect />;
};

const ClearStorageAndRedirect = () => {
  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;
