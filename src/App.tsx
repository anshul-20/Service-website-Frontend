import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from './components/Loading';
import { useAuth } from './contexts/auth.context';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Main from './layouts/Main';
import Protected from './layouts/Protected';
import CreateOrderPage from './pages/CreateOrderPage';
import WorkerRoutes from './layouts/WorkerRoutes';
import ActiveOrdersPage from './pages/ActiveOrdersPage';
import Order from './pages/Order';

const ErrorHandler = () => {
  return <div>Something went wrong</div>;
};

function App() {
  const auth = useAuth();
  if (auth?.loading) {
    return <Loading />;
  }
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary FallbackComponent={ErrorHandler}>
        <Routes>
          <Route path="/" element={<Protected user={auth?.user} />}>
            <Route path="/" element={<Main />}>
              <Route index element={<Dashboard />} />
              <Route path="/order/create" element={<CreateOrderPage />} />
              <Route
                path="/worker"
                element={<WorkerRoutes user={auth?.user} />}
              >
                <Route path="order/:orderId" element={<Order />} />
                <Route
                  path="order/active"
                  element={
                    <ActiveOrdersPage
                      status={'ACTIVE'}
                      workerId={auth?.user?.id}
                    />
                  }
                />
                <Route
                  path="order/processing"
                  element={<ActiveOrdersPage status={'PROCESSING'} />}
                />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
          <Route path="/auth">
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/auth/login" />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;
