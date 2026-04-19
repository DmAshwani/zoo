import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './BookingFlow.css';

const TicketSelectionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { date, slot } = location.state || {};

    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(1);
    const [addons, setAddons] = useState({ camera: false, safari: false });
    const [prices, setPrices] = useState({ ADULT: 800, CHILD: 500 });
    const [addonPrices, setAddonPrices] = useState({ Camera: 300, Safari: 1000 });

    useEffect(() => {
        // Fetch Ticket Prices
        api.get('/public/pricing/tickets', { params: { slotId: slot?.id } })
            .then(res => setPrices(res.data))
            .catch(err => console.error('Error fetching ticket prices:', err));

        // Fetch Add-on Prices
        api.get('/public/pricing/addons')
            .then(res => {
                const map = {};
                res.data.forEach(a => map[a.name] = a.price);
                setAddonPrices(map);
            })
            .catch(err => console.error('Error fetching add-on prices:', err));
    }, []);

    const adultPrice = prices.ADULT || 800;
    const childPrice = prices.CHILD || 500;
    const cameraPrice = addonPrices.Camera || 300;
    const safariPrice = addonPrices.Safari || 1000;

    const totalPersons = adults + children;
    const subtotal = (adults * adultPrice) + (children * childPrice);
    const addonTotal = (addons.camera ? cameraPrice : 0) + (addons.safari ? safariPrice * totalPersons : 0);
    const total = subtotal + addonTotal;

    const formatAmPm = (timeStr) => {
        if (!timeStr) return '';
        let [h, m] = timeStr.split(':');
        h = parseInt(h);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hh = h % 12 || 12;
        return `${String(hh).padStart(2, '0')}:${m} ${ampm}`;
    };

    const handleContinue = () => {
        navigate('/book/details', {
            state: { 
                date, 
                slot, 
                adults, 
                children, 
                addons, 
                total,
                adultPrice: prices.ADULT,
                childPrice: prices.CHILD
            }
        });
    };

    const displayDate = date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select a date';

    return (
        <div className="bg-background text-on-surface min-h-screen flex flex-col">
            {/* TopNavBar */}
            <nav className="fixed top-0 w-full z-50 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md shadow-[0px_12px_32px_rgba(44,52,51,0.06)] flex justify-between items-center px-12 py-4 max-w-full mx-auto font-public-sans tracking-tight text-on-surface">
                <Link to="/" className="text-2xl font-bold tracking-tighter text-emerald-900 dark:text-emerald-50">
                    Civic Naturalist Zoo
                </Link>
                <div className="hidden md:flex items-center space-x-8">
                    <a className="text-stone-600 dark:text-stone-400 hover:text-emerald-700 transition-colors" href="#">Exhibits</a>
                    <a className="text-stone-600 dark:text-stone-400 hover:text-emerald-700 transition-colors" href="#">Conservation</a>
                    <a className="text-emerald-800 dark:text-emerald-400 font-semibold border-b-2 border-emerald-800" href="#">Tickets</a>
                    <a className="text-stone-600 dark:text-stone-400 hover:text-emerald-700 transition-colors" href="#">Visit</a>
                </div>
                <div className="flex items-center space-x-6">
                    <Link to="/login" className="text-stone-600 dark:text-stone-400 hover:text-emerald-700 transition-colors">Sign In</Link>
                    <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-semibold hover:bg-primary-dim transition-all scale-95 duration-200 ease-in-out">Support Us</button>
                </div>
            </nav>

            <main className="min-h-screen px-6 lg:px-12 pt-32 pb-12 flex-grow">
                {/* Progress Indicator */}
                <div className="max-w-7xl mx-auto mb-16">
                    <div className="flex items-center justify-between max-w-xl mx-auto">
                        <div className="flex flex-col items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">1</span>
                            <span className="text-[0.625rem] uppercase tracking-widest text-on-surface-variant font-medium">Date</span>
                        </div>
                        <div className="h-[2px] flex-grow bg-primary-container mx-4"></div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">2</span>
                            <span className="text-[0.625rem] uppercase tracking-widest text-primary font-bold">Tickets</span>
                        </div>
                        <div className="h-[2px] flex-grow bg-surface-container-high mx-4"></div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-sm">3</span>
                            <span className="text-[0.625rem] uppercase tracking-widest text-on-surface-variant font-medium">Payment</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Selection Content */}
                    <div className="lg:col-span-8 space-y-12">
                        <section>
                            <h1 className="text-4xl font-bold tracking-tighter text-on-surface mb-2">Select Your Tickets</h1>
                            <p className="text-on-surface-variant max-w-2xl">Step 2: Choose the admission types for your party. All tickets include access to our conservation exhibits and botanical walk.</p>
                        </section>

                        {/* Ticket Counters */}
                        <div className="space-y-4">
                            <div className="p-8 bg-surface-container-low flex justify-between items-center group transition-colors hover:bg-surface-container rounded-xl">
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight text-on-surface">Adult</h3>
                                    <p className="text-sm text-on-surface-variant">Ages 13 and above</p>
                                    <p className="mt-2 font-bold text-primary">₹{adultPrice}.00</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary-container hover:border-primary-container transition-all text-on-surface">
                                        <span className="material-symbols-outlined">remove</span>
                                    </button>
                                    <span className="text-2xl font-bold w-6 text-center">{adults}</span>
                                    <button onClick={() => setAdults(Math.min(10, adults + 1))} className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary-container hover:border-primary-container transition-all text-on-surface">
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                            </div>
                            <div className="p-8 bg-surface-container-low flex justify-between items-center group transition-colors hover:bg-surface-container rounded-xl">
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight text-on-surface">Child</h3>
                                    <p className="text-sm text-on-surface-variant">Ages 3 to 12. Under 3 are free.</p>
                                    <p className="mt-2 font-bold text-primary">₹{childPrice}.00</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary-container hover:border-primary-container transition-all text-on-surface">
                                        <span className="material-symbols-outlined">remove</span>
                                    </button>
                                    <span className="text-2xl font-bold w-6 text-center">{children}</span>
                                    <button onClick={() => setChildren(Math.min(10, children + 1))} className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary-container hover:border-primary-container transition-all text-on-surface">
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Enhancements Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold tracking-tight text-on-surface">Enhance Your Visit</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Safari Access Card */}
                                <div className="bg-surface-container-lowest overflow-hidden group rounded-xl shadow-sm border border-outline-variant/20 hover:border-primary transition-all cursor-pointer" onClick={() => setAddons({ ...addons, safari: !addons.safari })}>
                                    <div className="h-48 w-full relative overflow-hidden">
                                        <img alt="Safari Jeep" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjomdQcQyjIBVoi9JW3oQEBmukgQWoMOMt_sKMPAYs8Td-qyhtNBtYb0J1pxTl9BIuIbyN33cHTHLIJ4a4yW1LoW5S7YOJFVrrKpxC8kxqLkbZ5uIlUb7rCBj9DmrE6HrUirBso8pxEaXUXsiXcJ3kAp1IgdgduhOUZBx06Yt5Vzr7QfGEuqZIm3T1TO6QHSCfiwDYoXZ6rH3M5G2q6NZKVttqqnjfH3IbjU7aMqucLXVm9NQBDiVMMJ4z9cwzP1bCghABiMYyb3A" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 text-white font-bold text-lg">Safari Access</div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <p className="text-sm text-on-surface-variant">Premium guided truck tour through the open habitat zones. 90 minutes.</p>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-tertiary">+₹{safariPrice}.00 / person</span>
                                            {addons.safari ? (
                                                <button className="px-4 py-2 bg-primary text-on-primary text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                                                    Added
                                                </button>
                                            ) : (
                                                <button className="px-4 py-2 bg-tertiary-container text-on-tertiary-container text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-tertiary hover:text-on-tertiary transition-colors">Add</button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Camera Permit Card */}
                                <div className="bg-surface-container-lowest overflow-hidden group rounded-xl shadow-sm border border-outline-variant/20 hover:border-primary transition-all cursor-pointer" onClick={() => setAddons({ ...addons, camera: !addons.camera })}>
                                    <div className="h-48 w-full relative overflow-hidden">
                                        <img alt="Camera Kit" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCf6sn6eW31lg44EBe8fpMVDtk9xiwSVZ-uYxxHmC-YhwS892BPSe7xwnw8ShiLiBqxLGxqg94knR7nOqZiv0mzMPZFFbnEmtZh2CR6P_tHXHv1XmHqHuwgwYXn2EgPh-TIKeTAWHw9iN6Lo3b1pdpI635_mEYCwCFAKP4E9aSWAn2BGQ20DLjE5NmEwSxThJEpMK_AdkazJkNrhxTyTwtopEgmPT1U7WGvZ8oaP21yDkj5j8G25gmwbFGGo-j6mXsD7v6oKEQXT3c" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 text-white font-bold text-lg">Camera Permit</div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <p className="text-sm text-on-surface-variant">Professional gear access for photography enthusiasts. Includes tripod clearance.</p>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-tertiary">+₹{cameraPrice}.00 / group</span>
                                            {addons.camera ? (
                                                <button className="px-4 py-2 bg-primary text-on-primary text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                                                    Added
                                                </button>
                                            ) : (
                                                <button className="px-4 py-2 bg-tertiary-container text-on-tertiary-container text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-tertiary hover:text-on-tertiary transition-colors">Add</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sidebar Booking Summary */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-24 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(44,52,51,0.06)] space-y-8 border border-outline-variant/10">
                            <div>
                                <h2 className="text-xs uppercase tracking-[0.15em] text-on-surface-variant font-bold mb-6">Booking Summary</h2>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-on-surface">General Admission</p>
                                            <p className="text-xs text-on-surface-variant">{displayDate} • {formatAmPm(slot?.startTime)}</p>
                                        </div>
                                        <button className="text-primary hover:underline text-xs font-bold uppercase" onClick={() => navigate(-1)}>Change</button>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-surface-container-high">
                                        {adults > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-on-surface-variant">Adult (x{adults})</span>
                                                <span className="font-medium text-on-surface">₹{adults * adultPrice}.00</span>
                                            </div>
                                        )}
                                        {children > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-on-surface-variant">Child (x{children})</span>
                                                <span className="font-medium text-on-surface">₹{children * childPrice}.00</span>
                                            </div>
                                        )}
                                        {addons.safari && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-on-surface-variant">Safari Access (x{totalPersons})</span>
                                                <span className="font-medium text-on-surface">₹{safariPrice * totalPersons}.00</span>
                                            </div>
                                        )}
                                        {addons.camera && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-on-surface-variant">Camera Permit</span>
                                                <span className="font-medium text-on-surface">₹{cameraPrice}.00</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-surface-container-high space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-on-surface">Total</span>
                                            <span className="text-3xl font-extrabold tracking-tighter text-primary">₹{total}.00</span>
                                        </div>
                                        <p className="text-[0.625rem] text-on-surface-variant text-center leading-relaxed">
                                            Prices include all local taxes and conservation levies. Non-refundable but transferable.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleContinue} className="w-full py-5 bg-primary text-on-primary font-bold rounded-lg flex items-center justify-center gap-3 group transition-all hover:bg-primary-dim">
                                Continue
                                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </button>
                            <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-lg justify-center">
                                <span className="material-symbols-outlined text-primary">verified_user</span>
                                <span className="text-[0.625rem] text-on-surface-variant font-medium uppercase tracking-wider">Secure SSL Checkout</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Footer Component Mapping from JSON */}
            <footer className="bg-stone-100 dark:bg-stone-900 w-full border-t border-stone-200/50 dark:border-stone-800/50">
                <div className="flex flex-col md:flex-row justify-between items-center px-12 py-8 w-full">
                    <div className="mb-4 md:mb-0">
                        <span className="text-lg font-bold text-emerald-900 font-headline tracking-tighter">Civic Naturalist Zoo</span>
                    </div>
                    <div className="flex gap-8 mb-4 md:mb-0">
                        <a className="font-public-sans text-sm uppercase tracking-widest text-stone-500 dark:text-stone-400 hover:text-emerald-600 transition-all opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
                        <a className="font-public-sans text-sm uppercase tracking-widest text-stone-500 dark:text-stone-400 hover:text-emerald-600 transition-all opacity-80 hover:opacity-100" href="#">Accessibility</a>
                        <a className="font-public-sans text-sm uppercase tracking-widest text-stone-500 dark:text-stone-400 hover:text-emerald-600 transition-all opacity-80 hover:opacity-100" href="#">Terms of Service</a>
                        <a className="font-public-sans text-sm uppercase tracking-widest text-stone-500 dark:text-stone-400 hover:text-emerald-600 transition-all opacity-80 hover:opacity-100" href="#">Contact Us</a>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-400">
                        © 2024 Civic Naturalist Botanical Gardens & Zoo. A Sanctuary for Biodiversity.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default TicketSelectionPage;
