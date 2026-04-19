import React, { useState, useEffect } from 'react';
import { FiSearch, FiUserPlus, FiEye, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
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
                alert('Staff updated successfully!');
            } else {
                await api.post('/admin/staff', staffData);
                alert('Staff created successfully!');
            }
            setShowModal(false);
            setEditingId(null);
            setStaffData({ fullName: '', email: '', mobileNumber: '', password: '', roles: ['ROLE_STAFF'] });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to process request');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await api.delete(`/admin/staff/${id}`);
                fetchUsers();
            } catch (err) {
                alert('Failed to delete staff');
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await api.patch(`/admin/staff/${id}/toggle`);
            fetchUsers();
        } catch (err) {
            alert('Failed to toggle status');
        }
    };

    const startEdit = (user) => {
        setEditingId(user.id);
        setStaffData({
            fullName: user.fullName,
            email: user.email,
            mobileNumber: user.mobileNumber || '',
            password: '', // Keep empty for no change
            roles: user.roles.map(r => r.name)
        });
        setShowModal(true);
    };

    const filtered = users.filter(u => {
        const hasRole = (roleName) => u.roles?.some(r => r.name === roleName);
        
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
        if (u.roles?.some(r => ['ROLE_STAFF', 'ROLE_SLOTS', 'ROLE_PRICING', 'ROLE_BOOKINGS', 'ROLE_ANALYTICS'].includes(r.name))) return 'Staff Member';
        return 'General User';
    };

    const getRoleClass = (u) => {
        if (u.roles?.some(r => r.name === 'ROLE_ADMIN')) return 'bg-primary/10 border-primary/20 text-primary';
        if (u.roles?.some(r => r.name === 'ROLE_GATEKEEPER')) return 'bg-blue-50 border-blue-100 text-blue-700';
        if (u.roles?.some(r => ['ROLE_STAFF', 'ROLE_SLOTS', 'ROLE_PRICING', 'ROLE_BOOKINGS', 'ROLE_ANALYTICS'].includes(r.name))) return 'bg-amber-50 border-amber-100 text-amber-700';
        return 'bg-stone-50 border-stone-100 text-stone-500';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="font-public-sans w-full animate-in fade-in duration-500">
            {/* Hero Header Section */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-5xl font-extrabold text-primary tracking-tighter">User Management</h1>
                    <p className="text-on-surface-variant mt-2 font-medium">Control system access and view directory profiles.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-primary-dim transition-all shadow-xl shadow-primary/20 transform hover:-translate-y-1"
                >
                    <FiUserPlus size={20} strokeWidth={3} />
                    Manage Staff
                </button>
            </div>

            {/* Staff Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-stone-900">{editingId ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
                            <button onClick={() => { setShowModal(false); setEditingId(null); }} className="text-stone-400 hover:text-stone-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreateOrUpdateStaff} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-stone-400 mb-2">Full Name</label>
                                    <input 
                                        required
                                        className="w-full bg-stone-50 border-none rounded-xl py-3 px-4 font-bold"
                                        placeholder="Staff Name"
                                        value={staffData.fullName}
                                        onChange={e => setStaffData({...staffData, fullName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-stone-400 mb-2">Email Address</label>
                                    <input 
                                        type="email" required
                                        className="w-full bg-stone-50 border-none rounded-xl py-3 px-4 font-bold"
                                        placeholder="email@zoo.com"
                                        value={staffData.email}
                                        onChange={e => setStaffData({...staffData, email: e.target.value})}
                                    />
                                </div>
                            </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-stone-400 mb-2">Mobile Number</label>
                                        <input 
                                            className="w-full bg-stone-50 border-none rounded-xl py-3 px-4 font-bold"
                                            placeholder="+91..."
                                            value={staffData.mobileNumber}
                                            onChange={e => setStaffData({...staffData, mobileNumber: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-stone-400 mb-2">
                                            {editingId ? 'New Password (Leave blank to keep current)' : 'Password'}
                                        </label>
                                        <input 
                                            type="password"
                                            required={!editingId}
                                            className="w-full bg-stone-50 border-none rounded-xl py-3 px-4 font-bold"
                                            placeholder="********"
                                            value={staffData.password}
                                            onChange={e => setStaffData({...staffData, password: e.target.value})}
                                        />
                                    </div>
                                </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-stone-400 mb-2">Primary System Role</label>
                                    <select 
                                        className="w-full bg-stone-50 border-none rounded-xl py-3 px-4 font-bold appearance-none cursor-pointer"
                                        value={staffData.roles.find(r => ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_GATEKEEPER'].includes(r)) || 'ROLE_STAFF'}
                                        onChange={e => {
                                            const primaryRoles = ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_GATEKEEPER'];
                                            const otherRoles = staffData.roles.filter(r => !primaryRoles.includes(r));
                                            setStaffData({...staffData, roles: [e.target.value, ...otherRoles]});
                                        }}
                                    >
                                        <option value="ROLE_STAFF">Regular Staff</option>
                                        <option value="ROLE_GATEKEEPER">Gatekeeper</option>
                                        <option value="ROLE_ADMIN">Administrator</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-stone-400 mb-2">Status</label>
                                    <div className="bg-stone-50 py-3 px-4 rounded-xl flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                        <span className="text-xs font-black text-stone-900 uppercase">Awaiting Activation</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-stone-400 mb-2">Functional Menu Permissions (Rigets)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { role: 'ROLE_SLOTS', label: 'Manage Slots', icon: 'schedule' },
                                        { role: 'ROLE_PRICING', label: 'Manage Pricing', icon: 'payments' },
                                        { role: 'ROLE_BOOKINGS', label: 'View Bookings', icon: 'confirmation_number' },
                                        { role: 'ROLE_ANALYTICS', label: 'Dashboard Stats', icon: 'analytics' }
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
                                            className={`px-4 py-3 rounded-xl font-bold text-[11px] border text-left flex items-center gap-3 transition-all ${staffData.roles.includes(item.role) ? 'bg-primary/5 text-primary border-primary shadow-sm' : 'bg-white text-stone-500 border-stone-100 hover:border-stone-300'}`}
                                        >
                                            <span className="material-symbols-outlined text-[18px] opacity-60">{item.icon}</span>
                                            <span className="flex-1">{item.label}</span>
                                            {staffData.roles.includes(item.role) && <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="submit" className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-black hover:bg-stone-800 transition-all shadow-xl">
                                    {editingId ? 'Update Permissions' : 'Grant Access'}
                                </button>
                                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); }} className="flex-1 bg-stone-100 text-stone-600 py-4 rounded-2xl font-black hover:bg-stone-200 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-6 mb-10 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/10 shadow-sm">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-outline" size={18} />
                    <input 
                        className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-14 pr-6 font-bold focus:ring-2 focus:ring-primary text-on-surface placeholder-on-surface-variant/40 shadow-inner" 
                        placeholder="Search profiles..."
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                    />
                </div>
                <div className="flex gap-2 bg-surface-container-low p-1.5 rounded-xl">
                    {['all', 'user', 'staff'].map(r => (
                        <button 
                            key={r} 
                            onClick={() => setRoleFilter(r)}
                            className={`px-8 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${roleFilter === r ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant/10 shadow-xl overflow-hidden mb-12">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low/50 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] border-b border-surface-container">
                                <th className="px-10 py-8">User Identity</th>
                                <th className="px-10 py-8">Contact Information</th>
                                <th className="px-10 py-8">Access Level</th>
                                <th className="px-10 py-8">Account Matrix</th>
                                <th className="px-10 py-8 text-right">Profile Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container">
                            {filtered.map(u => (
                                <tr key={u.id} className="hover:bg-primary-container/5 transition-all group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center text-xl font-black shadow-lg shadow-primary/10 group-hover:rotate-6 transition-transform">
                                                {u.fullName?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-base font-black text-on-surface tracking-tight">{u.fullName}</div>
                                                <div className="text-xs text-on-surface-variant/70 font-medium">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="text-sm font-bold text-on-surface-variant">{u.mobileNumber || 'N/A'}</div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-full border ${getRoleClass(u)}`}>
                                            {getRoleLabel(u)}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {u.roles?.map(r => {
                                                const isPrimary = ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_GATEKEEPER'].includes(r.name);
                                                return (
                                                    <span key={r.name} className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-tighter border ${
                                                        isPrimary 
                                                        ? 'bg-primary/5 text-primary border-primary/20' 
                                                        : 'bg-stone-100 text-stone-500 border-stone-200'
                                                    }`}>
                                                        {r.name.replace('ROLE_', '')}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full ${u.isActive !== false ? 'bg-secondary' : 'bg-stone-300'}`}></span>
                                            <span className={`text-sm font-black ${u.isActive !== false ? 'text-on-surface' : 'text-stone-400'}`}>
                                                {u.isActive !== false ? 'Active' : 'Deactivated'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button 
                                                onClick={() => handleToggleStatus(u.id)}
                                                className={`w-10 h-10 inline-flex items-center justify-center rounded-xl transition-all ${u.isActive !== false ? 'text-secondary hover:bg-secondary/10' : 'text-stone-400 hover:bg-stone-100'}`}
                                                title={u.isActive !== false ? 'Deactivate' : 'Activate'}
                                            >
                                                {u.isActive !== false ? <FiToggleRight size={22} strokeWidth={2.5} /> : <FiToggleLeft size={22} strokeWidth={2.5} />}
                                            </button>
                                            <button 
                                                onClick={() => startEdit(u)}
                                                className="w-10 h-10 inline-flex items-center justify-center text-on-surface-variant hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
                                                title="Edit Profile"
                                            >
                                                <FiEdit2 size={18} strokeWidth={2.5} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(u.id)}
                                                className="w-10 h-10 inline-flex items-center justify-center text-error/60 hover:bg-error/10 hover:text-error rounded-xl transition-all"
                                                title="Delete Profile"
                                            >
                                                <FiTrash2 size={18} strokeWidth={2.5} />
                                            </button>
                                        </div>
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

export default UserManagement;
