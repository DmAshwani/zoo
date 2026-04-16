import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('slots');
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [slotData, setSlotData] = useState({ slotDate: '', startTime: '', endTime: '', totalCapacity: 0 });

  useEffect(() => {
    if (activeTab === 'slots') fetchSlots();
    else if (activeTab === 'bookings') fetchBookings();
    else if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const fetchSlots = async () => {
    try {
      const res = await api.get('/slots/');
      setSlots(res.data);
    } catch (error) {
      alert('Error fetching slots');
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/all');
      setBookings(res.data);
    } catch (error) {
      alert('Error fetching bookings');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/');
      setUsers(res.data);
    } catch (error) {
      alert('Error fetching users');
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      await api.post('/slots/', slotData);
      alert('Slot created successfully!');
      setSlotData({ slotDate: '', startTime: '', endTime: '', totalCapacity: 0 });
      fetchSlots();
    } catch (error) {
      alert('Error creating slot');
    }
  };

  const toggleSlotStatus = async (id, isActive) => {
    try {
      await api.put(`/slots/${id}`, { isActive: !isActive });
      fetchSlots();
    } catch (error) {
      alert('Error updating slot');
    }
  };

  return (
    <div style={{ margin: '30px auto', maxWidth: '1200px' }}>
      <h1>🛠️ Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('slots')} style={{ padding: '10px', background: activeTab === 'slots' ? '#466553' : '#ccc', color: 'white', border: 'none', borderRadius: '5px' }}>Manage Slots</button>
        <button onClick={() => setActiveTab('bookings')} style={{ padding: '10px', background: activeTab === 'bookings' ? '#466553' : '#ccc', color: 'white', border: 'none', borderRadius: '5px' }}>View Bookings</button>
        <button onClick={() => setActiveTab('users')} style={{ padding: '10px', background: activeTab === 'users' ? '#466553' : '#ccc', color: 'white', border: 'none', borderRadius: '5px' }}>View Users</button>
      </div>

      {activeTab === 'slots' && (
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <h2>Create New Slot</h2>
            <form onSubmit={handleCreateSlot} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <div>
                <label>Date</label>
                <input type="date" required value={slotData.slotDate} onChange={e => setSlotData({...slotData, slotDate: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label>Start Time (HH:mm)</label>
                  <input type="time" required value={slotData.startTime} onChange={e => setSlotData({...slotData, startTime: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label>End Time (HH:mm)</label>
                  <input type="time" required value={slotData.endTime} onChange={e => setSlotData({...slotData, endTime: e.target.value})} />
                </div>
              </div>
              <div>
                <label>Total Capacity (e.g. 500)</label>
                <input type="number" required value={slotData.totalCapacity} onChange={e => setSlotData({...slotData, totalCapacity: e.target.value})} />
              </div>
              <button type="submit">Create Ticket Slot</button>
            </form>
          </div>

          <div className="card">
            <h2>Existing Slots</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Start Time</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>End Time</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Total Capacity</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Available</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Active</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map(slot => (
                  <tr key={slot.id}>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{slot.slotDate}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{slot.startTime}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{slot.endTime}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{slot.totalCapacity}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{slot.availableCapacity}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{slot.isActive ? 'Yes' : 'No'}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                      <button onClick={() => toggleSlotStatus(slot.id, slot.isActive)}>
                        {slot.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="card">
          <h2>All Bookings</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>User</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Slot</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Adults</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Children</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{booking.id}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{booking.user?.email}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{booking.slot?.startTime} - {booking.slot?.endTime}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{booking.adultTickets}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{booking.childTickets}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <h2>All Users</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Full Name</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Mobile</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Roles</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.id}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.fullName}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.email}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.mobileNumber}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.roles?.map(r => r.name).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
