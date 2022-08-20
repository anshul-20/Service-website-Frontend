import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const WorkerRoutes = ({ user }: { user: any }) => {
  if (user.role !== 'WORKER') {
    return (
      <Navigate
        to="/auth/register?error=not authorized to access this content to access this content register as a worker"
        replace
      />
    );
  }

  return <Outlet />;
};

export default WorkerRoutes;
