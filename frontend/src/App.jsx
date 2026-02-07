import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, PublicRoute } from './components/common/RouteGuards';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/dashboard/UserDashboard';
import ApplyLoan from './pages/dashboard/ApplyLoan';
import EditLoan from './pages/dashboard/EditLoan';
import LoanDetails from './pages/dashboard/LoanDetails';
import LoanPrediction from './pages/dashboard/LoanPrediction';

import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLoanDetails from './pages/admin/AdminLoanDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Landing Page (Public) */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Routes - Login/Register */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute roles={['user', 'admin']} />}>
            {/* User Dashboard moving to /dashboard */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/apply-loan" element={<ApplyLoan />} />
            <Route path="/edit-loan/:id" element={<EditLoan />} />
            <Route path="/predict-loan" element={<LoanPrediction />} />
            <Route path="/loan/:id" element={<LoanDetails />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<PrivateRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/loan/:id" element={<AdminLoanDetails />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
