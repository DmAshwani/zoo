import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import BookingFlow from './pages/BookingFlow';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import Header from './components/Header';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import './index.css';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/book" element={<BookingFlow />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
