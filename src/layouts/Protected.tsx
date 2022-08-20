import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Protected = ({ user }: { user: any }) => {
  if (user) {
    return <Outlet />;
  }

  return (
    <Navigate to="/auth/login?error='unauthenticated please login '" replace />
  );
};

export default Protected;
