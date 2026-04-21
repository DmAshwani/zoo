import React, { useState, useEffect } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        todayBookings: 0,
        totalRevenue: 0,
        occupancyRate: 0,
        activeSlots: 0,
        totalUsers: 0,
        totalStaff: 0
    });
    const [bookings, setBookings] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const { hasRole } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                let allBookings = [];
                let allSlots = [];
                let summaryData = { totalUsers: 0, totalStaff: 0 };

                // 1. Fetch Summary (Total Users/Staff)
                try {
                    const sumRes = await api.get('/admin/summary');
                    summaryData = sumRes.data;
                } catch (e) { console.error("Summary fetch failed", e); }
                
                // 2. Fetch Bookings (Only if authorized)
                if (hasRole('ROLE_ADMIN') || hasRole('ROLE_BOOKINGS')) {
                    try {
                        const bookingsRes = await api.get('/bookings/all');
                        allBookings = bookingsRes.data;
                    } catch (e) { console.error("Bookings fetch failed", e); }
                }
                
                // 3. Fetch Slots (Only if authorized)
                if (hasRole('ROLE_ADMIN') || hasRole('ROLE_SLOTS')) {
                    try {
                        const slotsRes = await api.get('/slots/');
                        allSlots = slotsRes.data;
                    } catch (e) { console.error("Slots fetch failed", e); }
                }

                // Calculate Stats
                const todayBookingsArr = allBookings.filter(b => b.createdAt && b.createdAt.startsWith(today));
                const totalRev = allBookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
                
                const activeCount = allSlots.filter(s => s.isActive).length;
                
                const todaySlots = allSlots.filter(s => s.slotDate === today);
                let totalCap = 0;
                let usedCap = 0;
                todaySlots.forEach(s => {
                    totalCap += s.totalCapacity;
                    usedCap += (s.totalCapacity - s.availableCapacity);
                });
                const occupancy = totalCap > 0 ? Math.round((usedCap / totalCap) * 100) : 0;

                setStats({
                    todayBookings: summaryData.todayBookings || todayBookingsArr.length,
                    todayRevenue: summaryData.todayRevenue || totalRev,
                    occupancyRate: summaryData.occupancyRate || occupancy,
                    activeSlots: summaryData.activeSlots || activeCount,
                    totalUsers: summaryData.totalUsers,
                    totalStaff: summaryData.totalStaff
                });

                const sortedBookings = [...allBookings].sort((a,b) => b.id - a.id).slice(0, 5);
                setBookings(sortedBookings);
                setSlots(todaySlots);
                
            } catch (error) {
                console.error("Critical error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [hasRole]);

    // Revenue data for the chart (Mocked for now since we don't have a trend API, but using real total)
    const revenueTrend = [
        { day: 'Mon', revenue: 18500 }, { day: 'Tue', revenue: 22300 },
        { day: 'Wed', revenue: 19800 }, { day: 'Thu', revenue: 28400 },
        { day: 'Fri', revenue: 35200 }, { day: 'Sat', revenue: 42100 },
        { day: 'Sun', revenue: stats.totalRevenue > 200000 ? 55000 : stats.totalRevenue / 7 },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="font-public-sans w-full animate-in fade-in duration-700">
            {/* Hero Header Section */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-5xl font-extrabold text-primary tracking-tighter">Dashboard</h1>
                    <p className="text-on-surface-variant mt-2 font-medium">Welcome back, Curator. Here is the botanical status for today.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => window.location.href='/staff/gatekeeper'} className="bg-stone-100 text-stone-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-stone-200 transition-colors border border-stone-200">
                        <span className="material-symbols-outlined text-[20px]">door_open</span>
                        Gatekeeper Portal
                    </button>
                    <button className="bg-primary-container text-on-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary transition-colors shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        New Booking
                    </button>
                </div>
            </div>

            {/* KPI Stats Row (Tonal Layering) */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-1">Total Visitors</p>
                    <h3 className="text-2xl font-black text-on-surface">{stats.totalUsers}</h3>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-1">Total Staff</p>
                    <h3 className="text-2xl font-black text-on-surface">{stats.totalStaff}</h3>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-1">Today's Bookings</p>
                    <h3 className="text-2xl font-black text-on-surface">{stats.todayBookings}</h3>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-1">Total Revenue</p>
                    <h3 className="text-2xl font-black text-on-surface">₹{stats.totalRevenue.toLocaleString()}</h3>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-1">Occupancy</p>
                    <h3 className="text-2xl font-black text-on-surface">{stats.occupancyRate}%</h3>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-1">Active Slots</p>
                    <h3 className="text-2xl font-black text-on-surface">{stats.activeSlots}</h3>
                </div>
            </div>

            {/* Bento Layout Content */}
            <div className="grid grid-cols-12 gap-6">
                
                {/* Revenue Trend Card */}
                <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h4 className="text-xl font-bold text-on-surface tracking-tight">Revenue Analytics</h4>
                            <p className="text-on-surface-variant text-sm">Financial trend for the past 7 days</p>
                        </div>
                        <select className="bg-surface-container-low border-none rounded-lg text-xs font-bold py-2 pl-4 pr-8 focus:ring-primary">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    
                    <div className="h-64 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#43682b" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#43682b" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#73796c' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#73796c' }} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                                itemStyle={{ color: '#173901', fontWeight: 800 }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#43682b" strokeWidth={3} fillOpacity={1} fill="url(#primaryGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Upcoming Slots Card */}
                <div className="col-span-12 lg:col-span-4 bg-[#c4efa3] p-8 rounded-xl text-[#0a2100] shadow-xl shadow-[#c4efa3]/20">
                    <h4 className="text-xl font-bold tracking-tight mb-2">Upcoming Slots</h4>
                    <p className="text-[#2c4f15] text-sm mb-8">Capacity indicators for afternoon tours</p>
                    <div className="space-y-6">
                        {slots.length > 0 ? slots.map(s => {
                            const occupancy = Math.round(((s.totalCapacity - s.availableCapacity) / s.totalCapacity) * 100);
                            return (
                                <div key={s.id} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                        <span>{s.startTime.substring(0,5)} - Slot</span>
                                        <span>{occupancy}% Full</span>
                                    </div>
                                    <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-[#396a1e] h-full rounded-full transition-all duration-1000" style={{ width: `${occupancy}%` }}></div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <p className="text-sm opacity-60">No slots available for today.</p>
                        )}
                    </div>
                    
                    <div className="mt-12 p-4 bg-white/20 rounded-xl border border-white/30 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#225105]">info</span>
                            <p className="text-xs font-medium leading-relaxed">System prediction suggests high traffic for the evening 'Sundown Safari' slot.</p>
                        </div>
                    </div>
                </div>

                {/* Recent Bookings Table */}
                <div className="col-span-12 bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-surface-container">
                        <h4 className="text-xl font-bold text-on-surface tracking-tight">Recent Bookings</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-surface-container-low text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                                    <th className="px-8 py-4">Booking ID</th>
                                    <th className="px-8 py-4">Visitor Name</th>
                                    <th className="px-8 py-4">Date</th>
                                    <th className="px-8 py-4">Time Slot</th>
                                    <th className="px-8 py-4">Tickets</th>
                                    <th className="px-8 py-4">Amount</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container">
                                {bookings.map((b) => (
                                    <tr key={b.id} className="hover:bg-surface-container-low transition-colors group">
                                        <td className="px-8 py-5 text-sm font-mono text-on-surface-variant font-medium">#{b.id.toString().padStart(4, '0')}</td>
                                        <td className="px-8 py-5 text-sm font-bold text-on-surface">{b.user?.fullName || 'Guest'}</td>
                                        <td className="px-8 py-5 text-sm text-on-surface-variant">{new Date(b.createdAt).toLocaleDateString()}</td>
                                        <td className="px-8 py-5 text-sm text-on-surface-variant">{b.slot?.startTime?.substring(0, 5) || 'N/A'}</td>
                                        <td className="px-8 py-5 text-sm font-bold">{b.adultTickets + b.childTickets}</td>
                                        <td className="px-8 py-5 text-sm font-bold">₹{b.totalAmount}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-full ${
                                                b.status === 'CONFIRMED' ? 'bg-secondary-container/30 text-on-secondary-container' : 
                                                b.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-error-container text-error'
                                            }`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">more_vert</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 bg-surface-container-low flex justify-center">
                        <button className="text-primary font-bold text-sm hover:underline">View All Historical Bookings</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
