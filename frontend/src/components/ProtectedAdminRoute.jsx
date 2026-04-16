import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const roles = JSON.parse(localStorage.getItem('roles') || '[]');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedAdminRoute;
