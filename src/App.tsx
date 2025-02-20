import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from '@/components/providers/store-provider';
import { AuthProvider } from '@/components/auth/auth-provider';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AdminLayout } from '@/components/admin/admin-layout';
import AuthPage from '@/pages/auth';
import DashboardPage from '@/pages/dashboard';
import MaintenancePage from '@/pages/maintenance';
import UsersPage from '@/pages/admin/users';
import CondominiumsPage from '@/pages/admin/condominiums';
import DeliveryWindowsPage from '@/pages/admin/delivery-windows';
import PaymentMethodsPage from '@/pages/admin/payment-methods';
import EggSizesPage from '@/pages/admin/egg-sizes';

function App() {
  return (
    <StoreProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/maintenance/*" element={<MaintenancePage />} />
            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              }
            />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="users" element={<UsersPage />} />
              <Route path="condominiums" element={<CondominiumsPage />} />
              <Route path="delivery-windows" element={<DeliveryWindowsPage />} />
              <Route path="payment-methods" element={<PaymentMethodsPage />} />
              <Route path="egg-sizes" element={<EggSizesPage />} />
            </Route>
            {/* Catch any unmatched routes and redirect to maintenance */}
            <Route path="/admin/*" element={<Navigate to="/maintenance" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </StoreProvider>
  );
}

export default App;