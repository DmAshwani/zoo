import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Customer Pages
import LandingPage from './pages/LandingPage';
import { LoginPage, SignupPage } from './pages/AuthPages';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DateTimePage from './pages/DateTimePage';
import TicketSelectionPage from './pages/TicketSelectionPage';
import UserDetailsPage from './pages/UserDetailsPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import SlotManagement from './pages/admin/SlotManagement';
import BookingManagement from './pages/admin/BookingManagement';
import RevenueAnalytics from './pages/admin/RevenueAnalytics';
import PricingManagement from './pages/admin/PricingManagement';
import UserManagement from './pages/admin/UserManagement';

// Staff Pages
import GatekeeperDashboard from './pages/staff/GatekeeperDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Booking Flow */}
          <Route path="/book/date" element={<DateTimePage />} />
          <Route path="/book/tickets" element={<TicketSelectionPage />} />
          <Route path="/book/details" element={<UserDetailsPage />} />
          <Route path="/book/payment" element={<PaymentPage />} />
          <Route path="/booking/confirmation" element={<ConfirmationPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_SLOTS', 'ROLE_PRICING', 'ROLE_BOOKINGS', 'ROLE_ANALYTICS']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="slots" element={<SlotManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="analytics" element={<RevenueAnalytics />} />
            <Route path="pricing" element={<PricingManagement />} />
            <Route path="users" element={<UserManagement />} />
          </Route>

          {/* Staff/Gatekeeper Routes */}
          <Route path="/staff/gatekeeper" element={
            <ProtectedRoute requiredRoles={['ROLE_GATEKEEPER', 'ROLE_ADMIN']}>
              <GatekeeperDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
