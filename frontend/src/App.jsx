import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, PublicRoute } from './components/common/RouteGuards';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/dashboard/UserDashboard';
import ApplyLoan from './pages/dashboard/ApplyLoan';
import LoanDetails from './pages/dashboard/LoanDetails';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLoanDetails from './pages/admin/AdminLoanDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute roles={['user', 'admin']} />}>
            {/* Note: 'admin' might also look at user dashboard to see how it looks? 
                Usually admin has their own VIEW. 
                But for now let's strict check roles or allow admin to access "/" if generic.
                Let's stick to plan: "/" is User Dashboard.
            */}
            <Route path="/" element={<UserDashboard />} />
            <Route path="/apply-loan" element={<ApplyLoan />} />
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
