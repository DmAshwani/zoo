import React, { useState, useEffect } from 'react';
import { FiSearch, FiUserPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiMail, FiPhone, FiShield, FiCheckCircle } from 'react-icons/fi';
import api from '../../services/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    
    // Staff Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [staffData, setStaffData] = useState({
        fullName: '', email: '', mobileNumber: '', password: '', roles: ['ROLE_STAFF']
    });

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users/all');
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateOrUpdateStaff = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/admin/staff/${editingId}`, staffData);
            } else {
                await api.post('/admin/staff', staffData);
            }
            setShowModal(false);
            setEditingId(null);
            setStaffData({ fullName: '', email: '', mobileNumber: '', password: '', roles: ['ROLE_STAFF'] });
            fetchUsers();
        } catch (err) {
            console.error("Error saving staff:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await api.delete(`/admin/staff/${id}`);
                fetchUsers();
            } catch (err) {
                console.error('Failed to delete staff:', err);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await api.patch(`/admin/staff/${id}/toggle`);
            fetchUsers();
        } catch (err) {
            console.error('Failed to toggle status:', err);
        }
    };

    const startEdit = (user) => {
        setEditingId(user.id);
        setStaffData({
            fullName: user.fullName,
            email: user.email,
            mobileNumber: user.mobileNumber || '',
            password: '', 
            roles: user.roles.map(r => r.name)
        });
        setShowModal(true);
    };

    const filtered = users.filter(u => {
        const isStaff = u.roles?.some(r => r.name !== 'ROLE_USER');
        const role = isStaff ? 'staff' : 'user';
        
        const matchRole = roleFilter === 'all' || role === roleFilter;
        const matchSearch = !search || 
            u.fullName?.toLowerCase().includes(search.toLowerCase()) || 
            u.email?.toLowerCase().includes(search.toLowerCase());
        return matchRole && matchSearch;
    });

    const getRoleLabel = (u) => {
        if (u.roles?.some(r => r.name === 'ROLE_ADMIN')) return 'Administrator';
        if (u.roles?.some(r => r.name === 'ROLE_GATEKEEPER')) return 'Gatekeeper';
        if (u.roles?.some(r => ['ROLE_STAFF', 'ROLE_SLOTS', 'ROLE_PRICING', 'ROLE_BOOKINGS', 'ROLE_ANALYTICS'].includes(r.name))) return 'Internal Staff';
        return 'Standard User';
    };

    const getRoleColors = (u) => {
        if (u.roles?.some(r => r.name === 'ROLE_ADMIN')) return 'bg-rose-50 text-rose-700 border-rose-100';
        if (u.roles?.some(r => r.name === 'ROLE_GATEKEEPER')) return 'bg-indigo-50 text-indigo-700 border-indigo-100';
        if (u.roles?.some(r => ['ROLE_STAFF', 'ROLE_SLOTS', 'ROLE_PRICING', 'ROLE_BOOKINGS', 'ROLE_ANALYTICS'].includes(r.name))) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        return 'bg-slate-50 text-slate-600 border-slate-100';
    };

    const getAvatarColor = (name) => {
        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500'];
        const charCode = name?.charCodeAt(0) || 0;
        return colors[charCode % colors.length];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">User Directory</h1>
                    <p className="text-on-surface-variant font-medium">Manage system access levels and monitor user engagement across the platform.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="group bg-primary text-on-primary px-6 py-3.5 rounded-xl font-bold flex items-center gap-3 hover:bg-primary-dim transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                >
                    <FiUserPlus className="text-lg group-hover:rotate-12 transition-transform" />
                    Add Staff Member
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="glass-panel p-3 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                    <input 
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-12 pr-6 font-semibold focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40 transition-all text-on-surface" 
                        placeholder="Search by name or email..."
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                    />
                </div>
                <div className="flex bg-surface-container p-1 rounded-xl">
                    {['all', 'user', 'staff'].map(r => (
                        <button 
                            key={r} 
                            onClick={() => setRoleFilter(r)}
                            className={`px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${roleFilter === r ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                        >
                            {r}s
                        </button>
                    ))}
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse responsive-table">
                        <thead>
                            <tr className="bg-surface-container-low/50 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.15em] border-b border-outline-variant/10">
                                <th className="px-8 py-5">Profile Identity</th>
                                <th className="px-8 py-5">Security Role</th>
                                <th className="px-8 py-5">System Status</th>
                                <th className="px-8 py-5 text-right whitespace-nowrap">Profile Controls</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5">
                            {filtered.map(u => (
                                <tr key={u.id} className="hover:bg-surface-container-low/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="avatar-container">
                                                <div className={`w-12 h-12 rounded-xl ${getAvatarColor(u.fullName)} text-white flex items-center justify-center font-bold text-lg shadow-sm transform group-hover:scale-110 transition-transform`}>
                                                    {u.fullName?.charAt(0)}
                                                </div>
                                                <div className={`avatar-status ${u.isActive !== false ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-on-surface leading-tight">{u.fullName}</div>
                                                <div className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-1">
                                                    <FiMail className="opacity-60" /> {u.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-2">
                                            <span className={`w-fit px-3 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getRoleColors(u)}`}>
                                                {getRoleLabel(u)}
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {u.roles?.filter(r => !['ROLE_USER', 'ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_GATEKEEPER'].includes(r.name)).map(r => (
                                                    <span key={r.name} className="px-2 py-0.5 bg-secondary/5 text-secondary border border-secondary/10 rounded text-[9px] font-bold uppercase">
                                                        {r.name.replace('ROLE_', '')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`status-badge ${u.isActive !== false ? 'status-badge--active' : 'status-badge--inactive'}`}>
                                            <div className={`status-indicator ${u.isActive !== false ? 'status-indicator--active' : 'status-indicator--inactive'}`}></div>
                                            {u.isActive !== false ? 'Access Granted' : 'Suspended'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-1 px-4 opacity-0 group-hover:opacity-100 transition-all transform scale-95 group-hover:scale-100">
                                            <button 
                                                onClick={() => handleToggleStatus(u.id)}
                                                className={`p-2 rounded-lg transition-colors ${u.isActive !== false ? 'text-on-surface-variant hover:bg-rose-50 hover:text-rose-600' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                                title={u.isActive !== false ? 'Disable Access' : 'Enable Access'}
                                            >
                                                {u.isActive !== false ? <FiToggleRight size={22} /> : <FiToggleLeft size={22} />}
                                            </button>
                                            <button 
                                                onClick={() => startEdit(u)}
                                                className="p-2 text-on-surface-variant hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
                                                title="Edit Details"
                                            >
                                                <FiEdit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(u.id)}
                                                className="p-2 text-rose-300 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all"
                                                title="Delete Profile"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="py-20 flex flex-col items-center text-on-surface-variant/40">
                            <span className="material-symbols-outlined text-6xl mb-4 opacity-10">person_off</span>
                            <p className="font-bold">No matching profiles found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Staff Management Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-black/5">
                        <div className="px-10 py-8 bg-gradient-to-br from-stone-50 to-white border-b border-stone-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-stone-900 leading-tight">{editingId ? 'Refine Profile Access' : 'Initialize Staff Profile'}</h2>
                                <p className="text-sm text-stone-400 mt-1 font-medium">Provision system credentials and functional permissions.</p>
                            </div>
                            <button onClick={() => { setShowModal(false); setEditingId(null); }} className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateOrUpdateStaff} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* Personal Details Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-primary">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <FiUserPlus className="text-sm" />
                                    </div>
                                    <h3 className="font-black uppercase tracking-[0.1em] text-[11px]">Identity & Credentials</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Full Name</label>
                                        <input 
                                            required
                                            className="w-full bg-stone-50 border border-stone-100 rounded-xl py-3.5 px-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all focus:bg-white"
                                            placeholder="e.g. John Doe"
                                            value={staffData.fullName}
                                            onChange={e => setStaffData({...staffData, fullName: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Email Address</label>
                                        <input 
                                            type="email" required
                                            className="w-full bg-stone-50 border border-stone-100 rounded-xl py-3.5 px-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all focus:bg-white"
                                            placeholder="john@zoodomain.com"
                                            value={staffData.email}
                                            onChange={e => setStaffData({...staffData, email: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Mobile Contact</label>
                                        <div className="relative">
                                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                                            <input 
                                                className="w-full bg-stone-50 border border-stone-100 rounded-xl py-3.5 pl-12 pr-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all focus:bg-white"
                                                placeholder="+91 XXXXX XXXXX"
                                                value={staffData.mobileNumber}
                                                onChange={e => setStaffData({...staffData, mobileNumber: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-stone-400 ml-1">
                                            {editingId ? 'Update Credentials' : 'Access Password'}
                                        </label>
                                        <input 
                                            type="password"
                                            required={!editingId}
                                            className="w-full bg-stone-50 border border-stone-100 rounded-xl py-3.5 px-4 font-bold focus:ring-2 focus:ring-primary/20 transition-all focus:bg-white"
                                            placeholder={editingId ? "••••••••" : "Min. 8 characters"}
                                            value={staffData.password}
                                            onChange={e => setStaffData({...staffData, password: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Access Control section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-secondary">
                                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                                        <FiShield className="text-sm" />
                                    </div>
                                    <h3 className="font-black uppercase tracking-[0.1em] text-[11px]">System Role & Permissions</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-1 bg-stone-50 rounded-2xl flex gap-1">
                                        {[
                                            { id: 'ROLE_STAFF', label: 'Internal Staff' },
                                            { id: 'ROLE_GATEKEEPER', label: 'Gatekeeper' },
                                            { id: 'ROLE_ADMIN', label: 'Super Administrator' }
                                        ].map(item => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => {
                                                    const primaryRoles = ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_GATEKEEPER'];
                                                    const otherRoles = staffData.roles.filter(r => !primaryRoles.includes(r));
                                                    setStaffData({...staffData, roles: [item.id, ...otherRoles]});
                                                }}
                                                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all ${staffData.roles.includes(item.id) ? 'bg-white text-stone-900 shadow-sm border border-stone-200' : 'text-stone-400 hover:text-stone-600'}`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-stone-400 ml-1">Functional Module Permissions</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { role: 'ROLE_SLOTS', label: 'Inventory Management', desc: 'Manage time slots & capacity' },
                                                { role: 'ROLE_PRICING', label: 'Pricing Authority', desc: 'Control ticket & addon prices' },
                                                { role: 'ROLE_BOOKINGS', label: 'Revenue Monitoring', desc: 'View and refund bookings' },
                                                { role: 'ROLE_ANALYTICS', label: 'Data Intelligence', desc: 'Access comprehensive reports' }
                                            ].map(item => (
                                                <button
                                                    key={item.role}
                                                    type="button"
                                                    onClick={() => {
                                                        const roles = staffData.roles.includes(item.role) 
                                                            ? staffData.roles.filter(r => r !== item.role)
                                                            : [...staffData.roles, item.role];
                                                        setStaffData({...staffData, roles});
                                                    }}
                                                    className={`p-4 rounded-2xl border text-left flex items-start gap-4 transition-all group/btn ${staffData.roles.includes(item.role) ? 'bg-emerald-50/50 border-emerald-500 shadow-[0_8px_30px_rgb(16,185,129,0.08)]' : 'bg-white border-stone-100 hover:border-stone-300'}`}
                                                >
                                                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${staffData.roles.includes(item.role) ? 'border-emerald-500 bg-emerald-500' : 'border-stone-200 group-hover/btn:border-stone-400'}`}>
                                                        {staffData.roles.includes(item.role) && <FiCheckCircle className="text-white text-[10px]" />}
                                                    </div>
                                                    <div>
                                                        <div className={`text-[11px] font-black uppercase tracking-wide leading-none ${staffData.roles.includes(item.role) ? 'text-emerald-700' : 'text-stone-700'}`}>{item.label}</div>
                                                        <div className="text-[10px] text-stone-400 font-medium mt-1.5">{item.desc}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-8 flex gap-4">
                                <button type="submit" className="flex-[1.5] bg-stone-900 text-white py-4 rounded-2xl font-black hover:bg-stone-850 hover:shadow-2xl hover:shadow-stone-900/20 transition-all flex items-center justify-center gap-2">
                                    {editingId ? 'Synchronize Profiles' : 'Provision User Access'}
                                </button>
                                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); }} className="flex-1 bg-stone-50 text-stone-600 py-4 rounded-2xl font-black hover:bg-stone-100 transition-all">
                                    Dismiss
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
