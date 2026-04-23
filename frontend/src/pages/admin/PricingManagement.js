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

    const handleAddonChange = (idOrIndex, field, value) => {
        setAddons(addons.map((a, idx) => (a.id === idOrIndex || `new-${idx}` === idOrIndex) ? { ...a, [field]: value } : a));
    };

    const handlePricingChange = (id, field, value) => {
        setSlotPricing(slotPricing.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const addNewAddon = () => {
        setAddons([...addons, { name: 'New Service', type: 'ADDON', price: 0, isActive: true, isNew: true }]);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Separate new addons from existing ones
            const newAddons = addons.filter(a => a.isNew);
            const existingAddons = addons.filter(a => !a.isNew);

            // Save settings, tickets, addons, and slot overrides
            await Promise.all([
                ...tickets.map(t => api.put(`/admin/tickets/${t.id}`, t)),
                ...existingAddons.map(a => api.put(`/admin/addons/${a.id}`, a)),
                ...newAddons.map(a => api.post('/admin/addons', { name: a.name, type: a.type, price: a.price, description: a.description, imageUrl: a.imageUrl, isActive: a.isActive })),
                api.put('/admin/settings', { settingKey: 'dynamic_pricing_enabled', settingValue: String(dynamicPricing) }),
                api.put('/admin/settings', { settingKey: 'manual_overrides_enabled', settingValue: String(manualPricing) }),
                api.put('/admin/settings', { settingKey: 'surge_threshold_percent', settingValue: String(threshold) })
            ]);
            alert('Pricing, Add-Ons, and Dynamic Rules saved successfully!');
            fetchData(); // Refresh to get real IDs for new addons
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
                {/* Base Ticket Prices Section */}
                <div className="col-span-12 lg:col-span-12">
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-surface-container bg-surface-container-low/50 flex justify-between items-center">
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
                </div>

                {/* Add-On Master Section */}
                <div className="col-span-12 space-y-8">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-on-surface tracking-tighter">Add-On Services Master</h3>
                                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Define extra services like Safari, Camera, or Meals</p>
                            </div>
                            <button 
                                className="bg-secondary text-on-secondary px-4 py-2 rounded-lg font-bold text-sm hover:secondary-dim transition-all shadow-md active:scale-95 flex items-center gap-2" 
                                onClick={addNewAddon}>
                                <span className="material-symbols-outlined text-sm">add_circle</span>
                                Add New Service
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {addons.map((addon, index) => (
                                <div key={addon.id || `new-${index}`} className="group bg-surface-container-lowest p-0 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all overflow-hidden flex flex-col">
                                    {/* Image Section */}
                                    <div className="h-40 bg-surface-container relative">
                                        {addon.imageUrl ? (
                                            <img src={addon.imageUrl} alt={addon.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant opacity-30">
                                                <span className="material-symbols-outlined text-4xl mb-2">image_not_supported</span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest">No Image Provided</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button 
                                                onClick={async () => {
                                                    if (window.confirm(`Delete add-on "${addon.name}"?`)) {
                                                        try {
                                                            if (addon.id) {
                                                                await api.delete(`/admin/addons/${addon.id}`);
                                                            }
                                                            setAddons(addons.filter((a, idx) => a.id ? a.id !== addon.id : idx !== index));
                                                        } catch (error) {
                                                            alert('Failed to delete add-on');
                                                        }
                                                    }
                                                }}
                                                className="w-8 h-8 bg-error/90 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error shadow-lg"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                            <input 
                                                className="bg-white/10 hover:bg-white/20 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-md border border-white/20 w-full focus:ring-1 focus:ring-white outline-none placeholder:text-white/50"
                                                value={addon.imageUrl || ''}
                                                onChange={e => handleAddonChange(addon.id || `new-${index}`, 'imageUrl', e.target.value)}
                                                placeholder="Image URL (direct link)"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col gap-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <input 
                                                    className="font-bold text-lg text-on-surface bg-transparent border-none p-0 focus:ring-0 w-full placeholder:text-on-surface-variant/30"
                                                    value={addon.name}
                                                    onChange={e => handleAddonChange(addon.id || `new-${index}`, 'name', e.target.value)}
                                                    placeholder="Service Name"
                                                />
                                                <select 
                                                    className="text-[10px] uppercase tracking-widest font-black text-primary bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                                                    value={addon.type}
                                                    onChange={e => handleAddonChange(addon.id || `new-${index}`, 'type', e.target.value)}
                                                >
                                                    <option value="PER_BOOKING">Per Booking</option>
                                                    <option value="PER_PERSON">Per Person</option>
                                                </select>
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-primary font-bold text-sm">₹</span>
                                                <input 
                                                    className="w-24 bg-primary/5 border-none rounded-xl py-2 pl-7 pr-3 font-black text-primary focus:ring-2 focus:ring-primary text-right" 
                                                    type="number" 
                                                    value={addon.price} 
                                                    onChange={e => handleAddonChange(addon.id || `new-${index}`, 'price', parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                        </div>

                                        <textarea 
                                            className="text-xs text-on-surface-variant bg-surface-container-low/30 border border-outline-variant/10 rounded-xl p-3 focus:ring-1 focus:ring-primary outline-none min-h-[80px] resize-none leading-relaxed"
                                            value={addon.description || ''}
                                            onChange={e => handleAddonChange(addon.id || `new-${index}`, 'description', e.target.value)}
                                            placeholder="Detailed description of the service..."
                                        />
                                        
                                        <div className="pt-2 flex items-center gap-2">
                                            <label className="relative inline-flex items-center cursor-pointer scale-75 origin-left">
                                                <input type="checkbox" className="sr-only peer" checked={addon.isActive} onChange={e => handleAddonChange(addon.id || `new-${index}`, 'isActive', e.target.checked)} />
                                                <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                                            </label>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Available for Booking</span>
                                        </div>
                                    </div>
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
