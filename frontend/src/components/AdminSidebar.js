import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { path: '/admin', icon: 'dashboard', label: 'Dashboard', exact: true },
  { path: '/admin/slots', icon: 'calendar_view_day', label: 'Slots' },
  { path: '/admin/bookings', icon: 'event_available', label: 'Bookings' },
  { path: '/admin/analytics', icon: 'monitoring', label: 'Analytics' },
  { path: '/admin/pricing', icon: 'payments', label: 'Pricing' },
  { path: '/admin/users', icon: 'group', label: 'Users' },
];

const AdminSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 border-r-0 bg-[#FAFAF5] dark:bg-stone-950 flex flex-col py-8 z-50">
            {/* Brand Header */}
            <div className="px-8 mb-12 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>park</span>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-primary dark:text-[#B9F395] tracking-tighter">Botanical Archive</h1>
                    <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest">Zoo Administration</p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center text-primary font-bold bg-surface-container-high dark:bg-stone-800 rounded-r-full px-6 py-3 transition-colors duration-200"
                                : "flex items-center text-on-surface-variant dark:text-stone-400 font-medium px-6 py-3 hover:bg-surface-container-high dark:hover:bg-stone-800 transition-colors duration-200 rounded-r-full"
                        }
                    >
                        <span className="material-symbols-outlined mr-4">{item.icon}</span>
                        <span className="font-public-sans text-sm tracking-tight">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer Actions */}
            <div className="mt-auto px-2 space-y-1">
                <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center text-on-surface-variant dark:text-stone-400 font-medium px-6 py-3 hover:bg-surface-container-high dark:hover:bg-stone-800 rounded-r-full transition-colors duration-200"
                >
                    <span className="material-symbols-outlined mr-4">arrow_back</span>
                    <span className="font-public-sans text-sm tracking-tight">Back to Site</span>
                </button>
                <button
                    onClick={() => {
                        logout();
                        navigate('/');
                    }}
                    className="w-full flex items-center text-on-surface-variant dark:text-stone-400 font-medium px-6 py-3 hover:bg-surface-container-high dark:hover:bg-stone-800 rounded-r-full transition-colors duration-200"
                >
                    <span className="material-symbols-outlined mr-4">logout</span>
                    <span className="font-public-sans text-sm tracking-tight">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
