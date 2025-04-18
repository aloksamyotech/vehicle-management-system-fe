import { Navigate } from 'react-router-dom';
import { hasPermission } from './permissionHelper';

const ProtectedRoute = ({ element, featureId, permissionId }) => {
  
  const user = JSON.parse(localStorage.getItem('user'));

  if (user?.role === 'ADMIN') {
    return element;
  }

  if (hasPermission(featureId, permissionId)) {
    return element;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
