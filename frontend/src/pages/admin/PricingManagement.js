import React, { useState, useEffect } from 'react';
import { FiSave, FiEdit2, FiRefreshCw } from 'react-icons/fi';
import api from '../../services/api';

const PricingManagement = () => {
    const [tickets, setTickets] = useState([]);
    const [addons, setAddons] = useState([]);
    const [slotPricing, setSlotPricing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dynamicPricing, setDynamicPricing] = useState(true);
    const [manualPricing, setManualPricing] = useState(true);
    const [threshold, setThreshold] = useState(90);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ticketRes, addonRes, pricingRes, settingsRes] = await Promise.all([
                api.get('/admin/tickets'),
                api.get('/admin/addons'),
                api.get('/admin/pricing'),
                api.get('/admin/settings')
            ]);
            setTickets(ticketRes.data);
            setAddons(addonRes.data);
            setSlotPricing(pricingRes.data);
            
            // Map settings
            const settingsMap = settingsRes.data.reduce((acc, s) => {
                acc[s.settingKey] = s.settingValue;
                return acc;
            }, {});
            
            if (settingsMap.dynamic_pricing_enabled) {
                setDynamicPricing(settingsMap.dynamic_pricing_enabled === 'true');
            }
            if (settingsMap.manual_overrides_enabled) {
                setManualPricing(settingsMap.manual_overrides_enabled === 'true');
            }
            if (settingsMap.surge_threshold_percent) {
                setThreshold(parseInt(settingsMap.surge_threshold_percent));
            }
        } catch (error) {
            console.error('Error fetching pricing data:', error);
            alert('Failed to load pricing data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTicketChange = (id, field, value) => {
        setTickets(tickets.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const handleAddonChange = (id, field, value) => {
        setAddons(addons.map(a => a.id === id ? { ...a, [field]: value } : a));
    };

    const handlePricingChange = (id, field, value) => {
        setSlotPricing(slotPricing.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Save settings, tickets, addons, and slot overrides
            await Promise.all([
                ...tickets.map(t => api.put(`/admin/tickets/${t.id}`, t)),
                ...addons.map(a => api.put(`/admin/addons/${a.id}`, a)),
                ...slotPricing.map(p => api.put('/admin/pricing', p)),
                api.put('/admin/settings', { settingKey: 'dynamic_pricing_enabled', settingValue: String(dynamicPricing) }),
                api.put('/admin/settings', { settingKey: 'manual_overrides_enabled', settingValue: String(manualPricing) }),
                api.put('/admin/settings', { settingKey: 'surge_threshold_percent', settingValue: String(threshold) })
            ]);
            alert('Pricing, Add-Ons, and Dynamic Rules saved successfully!');
        } catch (error) {
            console.error('Error saving pricing:', error);
            alert('Failed to save changes. Some updates might have failed.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin text-primary"><FiRefreshCw size={48} /></div>
                <p className="text-on-surface-variant font-medium">Synchronizing Pricing Master...</p>
            </div>
        );
    }

    return (
        <div className="font-public-sans w-full">
            {/* Hero Header Section */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-5xl font-extrabold text-primary tracking-tighter">Pricing Management</h1>
                    <p className="text-on-surface-variant mt-2 font-medium">Configure ticket tiers, add-on services, and dynamic pricing rules.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20 disabled:opacity-50">
                    <FiSave size={18} className={saving ? 'animate-pulse' : ''} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Base Ticket Prices & Slot-Specific */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    {/* Base Ticket Prices */}
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-surface-container bg-surface-container-low/50">
                            <h3 className="text-lg font-bold text-on-surface tracking-tight">Base Ticket Prices</h3>
                        </div>
                        <div className="p-6">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container">
                                        <th className="pb-4">Ticket Type</th>
                                        <th className="pb-4">Current Price (₹)</th>
                                        <th className="pb-4">Description</th>
                                        <th className="pb-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map(ticket => (
                                        <tr key={ticket.id} className="border-b border-surface-container/50 last:border-0 font-public-sans">
                                            <td className="py-4 font-bold text-on-surface">{ticket.name}</td>
                                            <td className="py-4">
                                                <input 
                                                    className="w-24 bg-surface-container-low border-none rounded-lg py-2 px-3 font-bold text-primary focus:ring-2 focus:ring-primary" 
                                                    type="number" 
                                                    value={ticket.defaultPrice} 
                                                    onChange={e => handleTicketChange(ticket.id, 'defaultPrice', parseFloat(e.target.value))}
                                                />
                                            </td>
                                            <td className="py-4 text-sm text-on-surface-variant">{ticket.description || 'Standard entry'}</td>
                                            <td className="py-4 text-right">
                                                <span className={`px-3 py-1 bg-secondary-container/30 text-on-secondary-container text-[10px] font-black uppercase tracking-tighter rounded-full ${!ticket.isActive && 'opacity-30 grayscale'}`}>
                                                    {ticket.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Slot-Specific Pricing */}
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-surface-container bg-surface-container-low/50">
                            <h3 className="text-lg font-bold text-on-surface tracking-tight">Slot-Specific Pricing Surge</h3>
                        </div>
                        <div className="p-6">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container">
                                        <th className="pb-4">Slot Time</th>
                                        <th className="pb-4">Ticket Type</th>
                                        <th className="pb-4">Override (₹)</th>
                                        <th className="pb-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {slotPricing.length > 0 ? slotPricing.map((s) => (
                                        <tr key={s.id} className="border-b border-surface-container/50 last:border-0">
                                            <td className="py-4 text-sm font-bold text-on-surface">Slot #{s.slotId}</td>
                                            <td className="py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">{s.ticketType}</td>
                                            <td className="py-4">
                                                <input 
                                                    className="w-24 bg-surface-container-low border-none rounded-lg py-2 px-3 font-bold text-primary focus:ring-2 focus:ring-primary" 
                                                    type="number" 
                                                    value={s.price} 
                                                    onChange={e => handlePricingChange(s.id, 'price', parseFloat(e.target.value))}
                                                />
                                            </td>
                                            <td className="py-4 text-right">
                                                <button className="p-2 hover:bg-surface-container text-on-surface-variant rounded-lg transition-colors">
                                                    <FiEdit2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-on-surface-variant italic">No slot-specific pricing defined.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Automation & Add-ons Sidebar */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    {/* Smart Pricing Controls */}
                    <div className="bg-primary-container p-6 rounded-xl text-black shadow-xl shadow-primary/20">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight mb-1">Pricing Controls</h3>
                                <p className="text-xs font-bold uppercase tracking-widest text-black/80">Global Rule Sets</p>
                            </div>
                        </div>

                        {/* Toggle 1: Manual Overrides */}
                        <div className="flex items-center justify-between mb-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest">Manual Slot Overrides</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={manualPricing} onChange={e => setManualPricing(e.target.checked)} />
                                <div className="w-11 h-6 bg-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        {/* Toggle 2: Automatic Surge */}
                        <div className="flex items-center justify-between mb-6 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest">Automatic Surge</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={dynamicPricing} onChange={e => setDynamicPricing(e.target.checked)} />
                                <div className="w-11 h-6 bg-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        
                        {dynamicPricing && (
                            <div className="mt-6 pt-6 border-t border-white/20">
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold uppercase tracking-widest">Occupancy Threshold</span>
                                    <span className="text-sm font-black">{threshold}%</span>
                                </div>
                                <input 
                                    type="range" min="50" max="100" value={threshold} onChange={e => setThreshold(e.target.value)}
                                    className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer mb-4" 
                                />
                                <p className="text-xs font-medium leading-relaxed bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                    When slot reaches <strong className="font-black text-white">{threshold}% occupancy</strong>, the system triggers a <strong className="font-black text-white">+50% price surge</strong> automatically.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Add-On Services */}
                    <div>
                        <h3 className="text-lg font-bold text-on-surface tracking-tight mb-4">Add-On Services</h3>
                        <div className="space-y-4">
                            {addons.map((addon) => (
                                <div key={addon.id} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">{addon.name.toLowerCase().includes('camera') ? 'photo_camera' : addon.name.toLowerCase().includes('safari') ? 'explore' : 'restaurant'}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-on-surface">{addon.name}</h4>
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2">{addon.type}</p>
                                    </div>
                                    <input 
                                        className="w-20 bg-surface-container-low border-none rounded-lg py-2 px-3 font-bold text-primary focus:ring-2 focus:ring-primary text-right" 
                                        type="number" 
                                        value={addon.price} 
                                        onChange={e => handleAddonChange(addon.id, 'price', parseFloat(e.target.value))}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingManagement;
