import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/my-bookings');
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>My Past Bookings</h2>
      <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
        {bookings.length === 0 ? (
          <p>You have no recent bookings.</p>
        ) : (
          bookings.map(b => (
            <div key={b.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4>Booking #{b.id}</h4>
                <p>Status: <strong style={{ color: b.status === 'CONFIRMED' ? 'var(--primary-color)' : '#bd9d00' }}>{b.status}</strong></p>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                  {new Date(b.createdAt).toLocaleDateString()} - {b.slot.startTime} to {b.slot.endTime}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold' }}>₹{b.totalAmount}</p>
                {b.pdfUrl && (
                  <a href={`http://localhost:8080${b.pdfUrl}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}>⬇ Download PDF</a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyBookings;
