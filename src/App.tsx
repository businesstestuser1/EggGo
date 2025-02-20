import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider } from '@/components/providers/store-provider';
import { AuthProvider } from '@/components/auth/auth-provider';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import AuthPage from '@/pages/auth';
import DashboardPage from '@/pages/dashboard';

function App() {
  return (
    <StoreProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </StoreProvider>
  );
}

export default App;