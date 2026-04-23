import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const dailyRevenue = [
  { day: 'Apr 10', revenue: 18500 }, { day: 'Apr 11', revenue: 22300 },
  { day: 'Apr 12', revenue: 19800 }, { day: 'Apr 13', revenue: 28400 },
  { day: 'Apr 14', revenue: 35200 }, { day: 'Apr 15', revenue: 42100 },
  { day: 'Apr 16', revenue: 38500 },
];

const ticketTypes = [
  { name: 'Adults', value: 62, color: '#3a5947' }, /* using our primary-dim mapping */
  { name: 'Children', value: 28, color: '#98c27b' },
  { name: 'Add-ons', value: 10, color: '#e7f0c4' }, /* tertiary-container mapping */
];

const bookingsBySlot = [
  { slot: '09:00', bookings: 78 },
  { slot: '11:00', bookings: 42 },
  { slot: '14:00', bookings: 65 },
  { slot: '16:00', bookings: 80 },
];

const topDays = [
  { date: 'Apr 12, 2026', bookings: 198, revenue: 42100, occupancy: '92%' },
  { date: 'Apr 11, 2026', bookings: 176, revenue: 38500, occupancy: '88%' },
  { date: 'Apr 10, 2026', bookings: 156, revenue: 35200, occupancy: '78%' },
  { date: 'Apr 09, 2026', bookings: 134, revenue: 28400, occupancy: '72%' },
];

const RevenueAnalytics = () => {
    const [range, setRange] = useState('7d');

    return (
        <div className="font-public-sans w-full">
            {/* Hero Header Section */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-5xl font-extrabold text-primary tracking-tighter">Revenue Analytics</h1>
                    <p className="text-on-surface-variant mt-2 font-medium">Deep dive into financial performance and capacity metrics.</p>
                </div>
                <div className="flex gap-2 bg-surface-container-low p-2 rounded-xl">
                    {[{ k: '7d', l: '7 Days' }, { k: '30d', l: '30 Days' }, { k: '90d', l: '90 Days' }].map(r => (
                        <button 
                            key={r.k} 
                            onClick={() => setRange(r.k)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${range === r.k ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                        >
                            {r.l}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Total Revenue', value: '₹12,45,000', trend: '+18.2%' },
                    { label: 'Total Bookings', value: '1,234', trend: '+12.5%' },
                    { label: 'Avg Per Booking', value: '₹1,009', trend: '+5.3%' },
                    { label: 'Growth Rate', value: '+12.5%', trend: '+2.1%' },
                ].map((s, i) => (
                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm" key={i}>
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">{s.label}</p>
                            <span className="text-on-secondary-container bg-secondary-container px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight">{s.trend}</span>
                        </div>
                        <h3 className="text-3xl font-black text-on-surface">{s.value}</h3>
                    </div>
                ))}
            </div>

            {/* Revenue Trend Area Chart */}
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm mb-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h4 className="text-xl font-bold text-on-surface tracking-tight">Revenue Trend</h4>
                        <p className="text-on-surface-variant text-sm">Income generated over selected period</p>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#466553" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#466553" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#73796c' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#73796c' }} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                                itemStyle={{ color: '#173901', fontWeight: 800 }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#466553" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Grid for Pie Chart and Bar Chart */}
            <div className="grid grid-cols-12 gap-8 mb-8">
                {/* Pie Chart: Ticket Type Distribution */}
                <div className="col-span-12 lg:col-span-5 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-on-surface tracking-tight mb-6">Distribution Map</h3>
                    <div className="flex items-center gap-6">
                        <div className="w-1/2 h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={ticketTypes} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" stroke="none" paddingAngle={2}>
                                        {ticketTypes.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 space-y-4">
                            {ticketTypes.map(t => (
                                <div key={t.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                                        <span className="text-sm font-bold text-on-surface">{t.name}</span>
                                    </div>
                                    <span className="text-sm font-medium text-on-surface-variant">{t.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bar Chart: Bookings by Slot */}
                <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm">
                    <h3 className="text-lg font-bold text-on-surface tracking-tight mb-6">Bookings by Time Slot</h3>
                    <div className="h-[200px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={bookingsBySlot} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis dataKey="slot" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#73796c' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#73796c' }} />
                                <Tooltip cursor={{fill: 'rgba(0,0,0,0.03)'}} contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                                <Bar dataKey="bookings" fill="#a8d38a" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Days Table */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-surface-container bg-surface-container-low/50">
                    <h3 className="text-lg font-bold text-on-surface tracking-tight">Top Performing Days</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container text-surface-variant">
                                <th className="px-8 py-4">Date</th>
                                <th className="px-8 py-4">Bookings</th>
                                <th className="px-8 py-4">Revenue</th>
                                <th className="px-8 py-4 text-right">Occupancy</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container">
                            {topDays.map(d => (
                                <tr key={d.date} className="hover:bg-surface-container-low transition-colors group">
                                    <td className="px-8 py-4 text-sm font-bold text-on-surface">{d.date}</td>
                                    <td className="px-8 py-4 text-sm font-medium text-on-surface-variant">{d.bookings} entries</td>
                                    <td className="px-8 py-4 text-sm font-bold text-primary">₹{d.revenue.toLocaleString()}</td>
                                    <td className="px-8 py-4 text-right">
                                        <span className="px-3 py-1 bg-secondary-container/30 text-on-secondary-container text-[10px] font-black uppercase tracking-tighter rounded-full">{d.occupancy}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RevenueAnalytics;
