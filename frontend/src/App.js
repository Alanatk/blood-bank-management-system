import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DonorDirectoryPage from './pages/DonorDirectoryPage';
import InventoryPage from './pages/InventoryPage';

const LegacyDashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'donor') return <Navigate to="/donor-dashboard" replace />;
  if (user.role === 'hospital') return <Navigate to="/hospital-dashboard" replace />;
  if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-rose-500 selection:text-white">
          {/* Main Top Navigation Bar */}
          <Navbar />

          {/* Main View Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/donors" element={<DonorDirectoryPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Legacy dashboard fallback */}
              <Route path="/dashboard" element={<LegacyDashboardRedirect />} />
              <Route path="/request" element={<Navigate to="/register?role=hospital" replace />} />
              <Route path="/approval" element={<Navigate to="/admin-dashboard" replace />} />

              {/* Protected Role-Based Routes */}
              <Route
                path="/donor-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/hospital-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['hospital']}>
                    <HospitalDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Clean Healthcare Footer */}
          <footer className="bg-white border-t border-slate-200/80 py-8 text-center text-xs text-slate-500 space-y-2">
            <div className="flex justify-center space-x-6 font-medium text-slate-600 mb-2">
              <a href="/" className="hover:text-rose-600 transition-colors">Home</a>
              <a href="/inventory" className="hover:text-rose-600 transition-colors">Blood Availability</a>
              <a href="/donors" className="hover:text-rose-600 transition-colors">Donor Directory</a>
              <a href="/login" className="hover:text-rose-600 transition-colors">Sign In</a>
            </div>
            <p className="text-slate-400">
              © {new Date().getFullYear()} Blood Bank Management System. All rights reserved. Built for College Project Presentation.
            </p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
