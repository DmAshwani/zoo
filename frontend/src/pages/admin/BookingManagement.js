import React, { useState, useEffect } from 'react';
import { FiSearch, FiDownload, FiEye } from 'react-icons/fi';
import api from '../../services/api';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings/all');
                setBookings(res.data);
            } catch (err) {
                console.error("Error fetching bookings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const filtered = bookings.filter(b => {
        const statusMatch = statusFilter === 'all' || b.status?.toLowerCase() === statusFilter;
        const searchMatch = !search || 
            b.id.toString().includes(search) || 
            b.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            b.user?.email?.toLowerCase().includes(search.toLowerCase());
        return statusMatch && searchMatch;
    });

    const statusCounts = {
        all: bookings.length,
        confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
        pending: bookings.filter(b => b.status === 'PENDING').length,
        failed: bookings.filter(b => ['FAILED', 'EXPIRED'].includes(b.status)).length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="font-public-sans w-full animate-in slide-in-from-bottom-4 duration-500">
            {/* Hero Header Section */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-5xl font-extrabold text-primary tracking-tighter">Booking Management</h1>
                    <p className="text-on-surface-variant mt-2 font-medium">Manage and view all customer reservations and ticket sales.</p>
                </div>
                <button className="bg-surface-container-high text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-surface-container-highest transition-colors shadow-sm">
                    <FiDownload size={18} />
                    Export CSV
                </button>
            </div>

            {/* KPI Stats Row (Filters) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'All Bookings', value: statusCounts.all, key: 'all' },
                    { label: 'Confirmed', value: statusCounts.confirmed, key: 'confirmed' },
                    { label: 'Pending', value: statusCounts.pending, key: 'pending' },
                    { label: 'Failed / Expired', value: statusCounts.failed, key: 'failed' },
                ].map(s => (
                    <div 
                        key={s.key}
                        onClick={() => setStatusFilter(s.key)}
                        className={`p-6 rounded-xl border shadow-sm cursor-pointer transition-all transform hover:scale-[1.02] ${statusFilter === s.key ? 'bg-primary-container text-on-primary-container border-primary ring-2 ring-primary/20' : 'bg-surface-container-lowest border-outline-variant/10 hover:border-primary/50'}`}
                    >
                        <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${statusFilter === s.key ? 'text-on-primary-container/80' : 'text-on-surface-variant'}`}>{s.label}</p>
                        <h3 className={`text-3xl font-black ${statusFilter === s.key ? 'text-on-primary-container' : 'text-on-surface'}`}>{s.value}</h3>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="flex gap-4 mb-8">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                    <input 
                        className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 font-medium focus:ring-2 focus:ring-primary text-on-surface placeholder-on-surface-variant/60 shadow-inner" 
                        placeholder="Search by ID, name or email..."
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                    />
                </div>
                <input 
                    type="date" 
                    className="w-[200px] bg-surface-container-low border-none rounded-xl py-4 px-4 font-medium focus:ring-2 focus:ring-primary text-on-surface shadow-inner" 
                />
            </div>

            {/* Bookings Table */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-xl shadow-surface-container/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low/50 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container">
                                <th className="px-8 py-6">Booking ID</th>
                                <th className="px-8 py-6">Visitor</th>
                                <th className="px-8 py-6">Visit Date</th>
                                <th className="px-8 py-6">Tickets</th>
                                <th className="px-8 py-6">Add-ons</th>
                                <th className="px-8 py-6">Amount</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container">
                            {filtered.length > 0 ? filtered.map((b) => (
                                <tr key={b.id} className="hover:bg-primary-container/5 transition-colors group">
                                    <td className="px-8 py-5 text-sm font-mono text-on-surface-variant font-medium">#{b.id.toString().padStart(6, '0')}</td>
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-bold text-on-surface line-clamp-1">{b.user?.fullName || 'Guest'}</div>
                                        <div className="text-[11px] text-on-surface-variant/70 mt-0.5 line-clamp-1">{b.user?.email || 'No email'}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-sm text-on-surface font-medium">{b.slot?.slotDate || 'N/A'}</div>
                                        <div className="text-[11px] text-on-surface-variant mt-0.5 uppercase font-bold tracking-tight">{b.slot?.startTime?.substring(0, 5) || 'N/A'}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex gap-2 text-sm font-black text-on-surface">
                                            {b.adultTickets > 0 && <span>{b.adultTickets}A</span>}
                                            {b.childTickets > 0 && <span className="text-on-surface-variant font-medium">{b.childTickets}C</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm">
                                        <div className="flex gap-1">
                                            {b.addOnSafari > 0 && <span title="Safari" className="grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100">🦒</span>}
                                            {b.addOnCamera > 0 && <span title="Camera" className="grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100">📷</span>}
                                            {(!b.addOnSafari && !b.addOnCamera) && <span className="text-outline/40">—</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-black text-primary">₹{b.totalAmount}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${
                                            b.status === 'CONFIRMED' ? 'bg-secondary-container/40 text-on-secondary-container' : 
                                            b.status === 'PENDING' ? 'bg-amber-100/60 text-amber-800' : 'bg-error-container/40 text-error'
                                        }`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-primary-container text-primary rounded-xl transition-all" title="View Details">
                                                <FiEye size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-secondary-container text-secondary rounded-xl transition-all" title="Download PDF">
                                                <FiDownload size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center opacity-40">
                                            <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
                                            <p className="text-xl font-bold tracking-tight text-on-surface">No bookings found</p>
                                            <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="p-6 bg-surface-container-low/30 border-t border-surface-container flex justify-between items-center px-10">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Showing {filtered.length} of {bookings.length} reservations</p>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/20">1</button>
                        <button className="w-10 h-10 rounded-xl text-on-surface-variant hover:bg-surface-container flex items-center justify-center font-bold text-sm transition-all">2</button>
                        <button className="w-10 h-10 rounded-xl text-on-surface-variant hover:bg-surface-container flex items-center justify-center font-bold text-sm transition-all">3</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingManagement;
