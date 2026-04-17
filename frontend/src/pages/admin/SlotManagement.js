import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiPower, FiX } from 'react-icons/fi';
import api from '../../services/api';

const SlotManagement = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Form state
    const [formData, setFormData] = useState({
        slotDate: selectedDate,
        startTime: '',
        endTime: '',
        totalCapacity: 100,
        isActive: true
    });

    useEffect(() => {
        fetchSlots();
    }, [selectedDate]);

    const fetchSlots = async () => {
        try {
            setLoading(true);
            // Use the available slots endpoint for now, or the admin all slots endpoint
            const res = await api.get('/slots/');
            const allSlots = res.data;
            const dateFiltered = allSlots.filter(s => s.slotDate === selectedDate);
            setSlots(dateFiltered);
        } catch (err) {
            console.error("Error fetching slots:", err);
            // Fallback: set empty array if error
            setSlots([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSlot = async (e) => {
        e.preventDefault();
        try {
            await api.post('/slots/', {
                ...formData,
                availableCapacity: formData.totalCapacity
            });
            setShowModal(false);
            fetchSlots();
        } catch (err) {
            console.error("Error creating slot:", err);
            alert("Failed to create slot. Check console for details.");
        }
    };

    const toggleSlotStatus = async (id, currentStatus) => {
        try {
            const slot = slots.find(s => s.id === id);
            await api.put(`/slots/${id}`, { ...slot, isActive: !currentStatus });
            fetchSlots();
        } catch (err) {
            console.error("Error toggling slot:", err);
        }
    };

    const filtered = filter === 'all' ? slots : filter === 'active' ? slots.filter(s => s.isActive) : slots.filter(s => !s.isActive);

    return (
        <div className="font-public-sans w-full animate-in fade-in duration-500">
            {/* Hero Header Section */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-5xl font-extrabold text-primary tracking-tighter">Slot Management</h1>
                    <p className="text-on-surface-variant mt-2 font-medium">Configure daily operational hours and capacity limits.</p>
                </div>
                <button 
                    onClick={() => {
                        setFormData({...formData, slotDate: selectedDate});
                        setShowModal(true);
                    }}
                    className="bg-primary-container text-on-primary px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-primary transition-all shadow-xl shadow-primary/20 transform hover:-translate-y-1"
                >
                    <FiPlus size={20} strokeWidth={3} />
                    Create New Slot
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-6 mb-10 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/10 shadow-sm">
                <div className="flex gap-2 bg-surface-container-low p-1.5 rounded-xl">
                    {['all', 'active', 'inactive'].map(f => (
                        <button 
                            key={f} 
                            onClick={() => setFilter(f)}
                            className={`px-8 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                
                <div className="md:ml-auto flex items-center gap-4">
                    <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Viewing Date:</span>
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-[220px] bg-primary-container/10 border-none rounded-xl py-3 px-6 font-bold focus:ring-2 focus:ring-primary text-primary shadow-inner" 
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.length > 0 ? filtered.map(slot => {
                        const pct = Math.round(((slot.totalCapacity - slot.availableCapacity) / slot.totalCapacity) * 100);
                        return (
                            <div key={slot.id} className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border-b-4 border-b-transparent hover:border-b-primary">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 block">Daily Slot</span>
                                        <h3 className="text-2xl font-black text-on-surface tracking-tighter">{slot.startTime.substring(0, 5)} — {slot.endTime.substring(0, 5)}</h3>
                                    </div>
                                    <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm ${slot.isActive ? 'bg-secondary-container/40 text-on-secondary-container' : 'bg-surface-dim/20 text-on-surface-variant/60'}`}>
                                        {slot.isActive ? 'Operating' : 'Disabled'}
                                    </span>
                                </div>
                                
                                <div className="mb-10 bg-surface-container-low/50 p-5 rounded-2xl">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Live Occupancy</span>
                                        <span className="text-xs font-black text-on-surface">{slot.totalCapacity - slot.availableCapacity} / {slot.totalCapacity}</span>
                                    </div>
                                    <div className="w-full bg-white h-2.5 rounded-full overflow-hidden shadow-inner p-0.5">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${pct >= 100 ? 'bg-error' : pct > 80 ? 'bg-amber-500' : 'bg-primary'}`} 
                                            style={{ width: `${pct}%` }} 
                                        />
                                    </div>
                                    <p className="text-[10px] text-on-surface-variant/60 mt-3 font-medium italic">
                                        {slot.availableCapacity} tickets remaining for this window
                                    </p>
                                </div>

                                <div className="flex gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <button className="flex-1 bg-surface-container-high hover:bg-primary hover:text-on-primary py-3 rounded-xl text-xs font-black uppercase tracking-widest text-on-surface transition-all">
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => toggleSlotStatus(slot.id, slot.isActive)}
                                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${slot.isActive ? 'bg-error-container/20 text-error hover:bg-error hover:text-white' : 'bg-secondary-container/20 text-secondary hover:bg-secondary hover:text-on-secondary'}`}
                                    >
                                        {slot.isActive ? 'Disable' : 'Enable'}
                                    </button>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="col-span-full py-20 px-8 bg-surface-container-low/20 rounded-3xl border-2 border-dashed border-outline-variant/20 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">event_busy</span>
                            </div>
                            <h3 className="text-xl font-black text-on-surface tracking-tight">No Slots Configured</h3>
                            <p className="text-on-surface-variant max-w-xs mt-2 font-medium">There are no time slots defined for {new Date(selectedDate).toLocaleDateString(undefined, { dateStyle: 'long' })}.</p>
                            <button 
                                onClick={() => setShowModal(true)}
                                className="mt-8 text-primary font-black uppercase tracking-widest text-xs hover:underline"
                            >
                                + Initialize Day Schedule
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300" onClick={() => setShowModal(false)}>
                    <div className="bg-surface-container-lowest w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                        <button 
                            onClick={() => setShowModal(false)}
                            className="absolute top-8 right-8 text-on-surface-variant hover:text-on-surface transition-colors"
                        >
                            <FiX size={24} />
                        </button>

                        <h2 className="text-3xl font-black text-on-surface mb-2 tracking-tighter">New Slot Definition</h2>
                        <p className="text-on-surface-variant mb-10 font-medium">Set operational parameters for the botanical tour.</p>
                        
                        <form onSubmit={handleCreateSlot} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Observation Date</label>
                                <input 
                                    type="date" 
                                    required
                                    value={formData.slotDate}
                                    onChange={e => setFormData({...formData, slotDate: e.target.value})}
                                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-primary text-on-surface shadow-inner" 
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Window Open</label>
                                    <input 
                                        type="time" 
                                        required
                                        value={formData.startTime}
                                        onChange={e => setFormData({...formData, startTime: e.target.value})}
                                        className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-primary text-on-surface shadow-inner" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Window Close</label>
                                    <input 
                                        type="time" 
                                        required
                                        value={formData.endTime}
                                        onChange={e => setFormData({...formData, endTime: e.target.value})}
                                        className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-primary text-on-surface shadow-inner" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Max Visitor Capacity</label>
                                <input 
                                    type="number" 
                                    required
                                    value={formData.totalCapacity}
                                    onChange={e => setFormData({...formData, totalCapacity: parseInt(e.target.value)})}
                                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 font-bold focus:ring-2 focus:ring-primary text-on-surface shadow-inner" 
                                />
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button type="submit" className="flex-[2] bg-primary text-on-primary py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-primary-dim transition-all shadow-xl shadow-primary/30">
                                    Authorize Slot
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-surface-container-high py-5 rounded-2xl font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-highest transition-all"
                                >
                                    Abort
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SlotManagement;
