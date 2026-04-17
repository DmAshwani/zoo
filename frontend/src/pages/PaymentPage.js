import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './BookingFlow.css';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingState = location.state || {};
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    // Calculate total including the conservation levy
    const finalTotal = (bookingState.total || 0) + 100;

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Numeric only
        if (value.length > 16) value = value.slice(0, 16);
        
        // Format with spaces: 0000 0000 0000 0000
        const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
        setCardData({ ...cardData, number: formatted });
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Numeric only
        if (value.length > 4) value = value.slice(0, 4);
        
        // Format as MM/YY
        if (value.length >= 3) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        setCardData({ ...cardData, expiry: value });
    };

    const handleCVCChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Numeric only
        if (value.length > 4) value = value.slice(0, 4);
        setCardData({ ...cardData, cvc: value });
    };

    const handlePayment = async () => {
        setProcessing(true);
        setError(null);
        console.group('[PaymentPage] Initiating Booking Process');
        console.log('Booking State:', bookingState);
        console.log('Payment Method:', paymentMethod);

        try {
            // 1. Initiate Booking
            const addOns = [];
            if (bookingState.addons?.camera) {
                addOns.push({ addOnId: 1, quantity: 1 });
            }
            if (bookingState.addons?.safari) {
                addOns.push({ addOnId: 2, quantity: bookingState.adults + bookingState.children });
            }

            const initiatePayload = {
                slotId: bookingState.slot?.id,
                adultTickets: bookingState.adults || 0,
                childTickets: bookingState.children || 0,
                addOns: addOns,
                // Guest information for unauthenticated bookings
                guestFullName: bookingState.userDetails?.fullName,
                guestEmail: bookingState.userDetails?.email,
                guestMobileNumber: bookingState.userDetails?.mobileNumber
            };

            console.log('[PaymentPage] Step 1: Calling /api/bookings/initiate', initiatePayload);
            const initiateRes = await api.post('/bookings/initiate', initiatePayload);
            const bookingId = initiateRes.data.id;
            console.log('[PaymentPage] Booking initiated successfully. ID:', bookingId);

            // 2. Mock payment confirmation (In a real app, this would be Razorpay/Stripe)
            console.log('[PaymentPage] Step 2: Simulating payment confirmation...');
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockPaymentId = 'pay_test_' + Math.random().toString(36).substring(7);

            // 3. Confirm Booking
            console.log('[PaymentPage] Step 3: Calling /api/bookings/confirm/', bookingId);
            const confirmRes = await api.post(`/bookings/confirm/${bookingId}?paymentId=${mockPaymentId}`);
            console.log('[PaymentPage] Booking confirmed successfully:', confirmRes.data);

            console.groupEnd();
            navigate('/booking/confirmation', { state: { ...bookingState, bookingId: confirmRes.data.id, pdfUrl: confirmRes.data.pdfUrl } });
        } catch (err) {
            console.error('[PaymentPage] Checkout failed:', err);
            setError(err.response?.data?.message || err.response?.data || 'Payment processing failed. Please ensure you are logged in and the slot has capacity.');
            console.groupEnd();
        } finally {
            setProcessing(false);
        }
    };

    const formatAmPm = (timeStr) => {
        if (!timeStr) return '';
        let [h, m] = timeStr.split(':');
        h = parseInt(h);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hh = h % 12 || 12;
        return `${String(hh).padStart(2, '0')}:${m} ${ampm}`;
    };

    const displayDate = bookingState.date ? new Date(bookingState.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

    return (
        <div className="bg-background text-on-surface min-h-screen font-public-sans">
            {/* TopNavBar */}
            <header className="fixed top-0 w-full z-50 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md shadow-[0px_12px_32px_rgba(44,52,51,0.06)]">
                <div className="flex justify-between items-center px-12 py-4 max-w-full mx-auto">
                    <Link to="/" className="text-2xl font-bold tracking-tighter text-emerald-900 dark:text-emerald-50">Civic Naturalist Zoo</Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <a className="text-stone-600 dark:text-stone-400 hover:text-emerald-700 tracking-tight transition-colors" href="#">Exhibits</a>
                        <a className="text-stone-600 dark:text-stone-400 hover:text-emerald-700 tracking-tight transition-colors" href="#">Conservation</a>
                        <a className="text-emerald-800 dark:text-emerald-400 font-semibold border-b-2 border-emerald-800 tracking-tight" href="#">Tickets</a>
                        <a className="text-stone-600 dark:text-stone-400 hover:text-emerald-700 tracking-tight transition-colors" href="#">Visit</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-5 py-2 text-emerald-900 font-medium hover:bg-emerald-50/50 transition-colors">Sign In</Link>
                        <button className="px-5 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-all">Support Us</button>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
                {error && (
                    <div className="mb-8 p-6 bg-error-container/20 border-2 border-error/20 rounded-xl flex items-start gap-4 animate-in slide-in-from-top duration-300">
                        <span className="material-symbols-outlined text-error">warning</span>
                        <div className="flex-1">
                            <h4 className="font-bold text-error uppercase tracking-widest text-[10px] mb-1">Transaction Execution Failed</h4>
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                        <button onClick={() => setError(null)} className="text-error/60 hover:text-error transition-colors">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Checkout Actions */}
                    <div className="lg:col-span-7 space-y-12">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-2">Complete Your Booking</h1>
                            <p className="text-on-surface-variant max-w-md">Secure your passage to the sanctuary. Your contribution directly supports global biodiversity conservation efforts.</p>
                        </div>

                        {/* Payment Methods */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold tracking-tight">Payment Method</h2>
                                <div className="flex items-center gap-2 text-emerald-800 bg-primary-container/30 px-3 py-1 rounded-full">
                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                                    <span className="text-xs font-bold uppercase tracking-widest">SSL Secured</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Credit/Debit Option */}
                                <div
                                    className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'card' ? 'bg-surface-container-lowest border-primary-container ring-2 ring-primary/5 shadow-sm' : 'bg-surface-container border-transparent hover:bg-surface-container-high'}`}
                                    onClick={() => setPaymentMethod('card')}
                                >
                                    <label className="flex items-start gap-4 cursor-pointer w-full">
                                        <div className="mt-1">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-outline'}`}>
                                                {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-bold text-lg">Credit / Debit Card</span>
                                                <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
                                            </div>
                                            {paymentMethod === 'card' && (
                                                <div className="space-y-6 pt-4 border-t border-outline-variant/10">
                                                    <div className="space-y-1.5">
                                                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                                                            Card Holder Name
                                                        </label>
                                                        <input 
                                                            className="w-full bg-surface-container border-2 border-transparent focus:border-primary/20 rounded-lg px-4 py-3.5 focus:bg-surface-container-highest transition-all outline-none font-medium text-sm" 
                                                            placeholder="NAME ON CARD" 
                                                            type="text" 
                                                            value={cardData.name}
                                                            onChange={(e) => setCardData({...cardData, name: e.target.value})}
                                                        />
                                                    </div>
                                                    
                                                    <div className="space-y-1.5">
                                                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                                                            Card Number
                                                            <span className="flex gap-1.5 opacity-40">
                                                                <span className="material-symbols-outlined text-[16px]">credit_card</span>
                                                                <span className="material-symbols-outlined text-[16px]">lock_person</span>
                                                            </span>
                                                        </label>
                                                        <input 
                                                            className="w-full bg-surface-container border-2 border-transparent focus:border-primary/20 rounded-lg px-4 py-3.5 focus:bg-surface-container-highest transition-all outline-none font-mono text-base tracking-widest" 
                                                            placeholder="0000 0000 0000 0000" 
                                                            type="tel" 
                                                            inputMode="numeric"
                                                            value={cardData.number}
                                                            onChange={handleCardNumberChange}
                                                            maxLength={19}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div className="space-y-1.5">
                                                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Expiry Date</label>
                                                            <input 
                                                                className="w-full bg-surface-container border-2 border-transparent focus:border-primary/20 rounded-lg px-4 py-3.5 focus:bg-surface-container-highest transition-all outline-none text-sm font-medium" 
                                                                placeholder="MM / YY" 
                                                                type="tel" 
                                                                inputMode="numeric"
                                                                value={cardData.expiry}
                                                                onChange={handleExpiryChange}
                                                                maxLength={5}
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">CVC / CVV</label>
                                                            <input 
                                                                className="w-full bg-surface-container border-2 border-transparent focus:border-primary/20 rounded-lg px-4 py-3.5 focus:bg-surface-container-highest transition-all outline-none text-sm font-medium" 
                                                                placeholder="***" 
                                                                type="password" 
                                                                inputMode="numeric"
                                                                value={cardData.cvc}
                                                                onChange={handleCVCChange}
                                                                maxLength={4}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>

                                {/* UPI Option */}
                                <div
                                    className={`p-6 rounded-xl border-2 transition-all cursor-pointer group ${paymentMethod === 'upi' ? 'bg-surface-container-lowest border-primary-container ring-2 ring-primary/5 shadow-sm' : 'bg-surface-container border-transparent hover:bg-surface-container-high'}`}
                                    onClick={() => setPaymentMethod('upi')}
                                >
                                    <label className="flex items-center justify-between cursor-pointer w-full">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-primary' : 'border-outline'}`}>
                                                {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-bold text-lg">UPI Payment</span>
                                                {paymentMethod === 'upi' && (
                                                    <div className="mt-4">
                                                        <input className="w-full bg-surface-container-high border-none outline-none rounded-lg p-3 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all" placeholder="yourname@upi" type="text" onClick={(e) => e.stopPropagation()} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`material-symbols-outlined transition-colors ${paymentMethod === 'upi' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>account_balance_wallet</span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* Cancellation Policy */}
                        <section className="bg-surface-container-low p-8 rounded-xl space-y-4">
                            <div className="flex items-center gap-3 text-tertiary">
                                <span className="material-symbols-outlined">info</span>
                                <h3 className="font-bold uppercase tracking-widest text-sm">Cancellation Policy</h3>
                            </div>
                            <p className="text-on-surface-variant text-sm leading-relaxed">
                                Full refunds are available for cancellations made at least 48 hours prior to the scheduled visit. Cancellations within 48 hours are eligible for a 50% credit toward a future visit. As a civic institution, processing fees support our local ecology programs.
                            </p>
                        </section>
                    </div>

                    {/* Right Column: Booking Summary Card */}
                    <div className="lg:col-span-5 sticky top-32">
                        <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_12px_32px_rgba(44,52,51,0.06)] flex flex-col border border-outline-variant/10">
                            <div className="relative h-48 w-full overflow-hidden">
                                <img alt="Lush botanical garden" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvegZDwppW59gYj60y5upwV9h6a2DdyGRhN-hbG9Mgi_hzxJQ2Xzkk19tFGRR_pVa_0G65aGueTKI1qKv_I7RoIeWf9rYoRJXgA7tm-5EmrKUDLbWa48G1x6QYEHqY1Oq_QSmphBuu7zbpWcVTo6H2EDH5rz_gsoJ_vIoYDD_IaKZmGFvj3E2gYg_dFvsCNOGU65fMsp0fC8DwHBX1YEgZB-q3qhtry9jSCScHiYpKZtnocoPwxlpC9doKVCiTa5Z-Hk8v_8_2DB4" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Premium Access</span>
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight mb-1">Explorer Day Pass</h3>
                                    <p className="text-on-surface-variant text-sm flex items-center gap-2">
                                        <span className="material-symbols-outlined text-xs">calendar_today</span>
                                        {displayDate} • {formatAmPm(bookingState.slot?.startTime)}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-on-surface-variant">Adult Tickets (x{bookingState.adults || 0})</span>
                                        <span className="font-medium">₹{(bookingState.adults || 0) * 800}.00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-on-surface-variant">Children Tickets (x{bookingState.children || 0})</span>
                                        <span className="font-medium">₹{(bookingState.children || 0) * 500}.00</span>
                                    </div>

                                    {/* Additional Addons */}
                                    {bookingState.addons?.safari && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-on-surface-variant">Safari Access</span>
                                            <span className="font-medium">₹{(bookingState.adults + bookingState.children) * 1000}.00</span>
                                        </div>
                                    )}
                                    {bookingState.addons?.camera && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-on-surface-variant">Camera Permit</span>
                                            <span className="font-medium">₹300.00</span>
                                        </div>
                                    )}


                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-on-surface-variant">Conservation Levy</span>
                                        <span className="font-medium">₹100.00</span>
                                    </div>

                                    <div className="pt-4 border-t border-surface-container-high flex justify-between items-end">
                                        <div>
                                            <span className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Total Amount</span>
                                            <span className="text-3xl font-extrabold tracking-tighter text-emerald-900">₹{finalTotal}.00</span>
                                        </div>
                                        <span className="text-xs text-on-surface-variant pb-1">Tax included</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={processing}
                                    className={`w-full bg-primary text-on-primary py-4 rounded-lg font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[0.98] transition-all flex items-center justify-center gap-3 ${processing ? 'opacity-80' : ''}`}>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{processing ? 'hourglass_top' : 'verified_user'}</span>
                                    {processing ? 'Processing Execution...' : `Authenticate & Pay ₹${finalTotal}.00`}
                                </button>
                                <div className="flex justify-center items-center gap-6 opacity-40">
                                    <span className="material-symbols-outlined text-3xl">brand_family</span>
                                    <span className="material-symbols-outlined text-3xl">garden_cart</span>
                                    <span className="material-symbols-outlined text-3xl">payments</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-start gap-4 p-4 text-xs text-on-surface-variant leading-tight">
                            <span className="material-symbols-outlined text-emerald-700">shield</span>
                            <p>Your payment information is encrypted and never stored on our servers. Transactions are handled via world-class PCI-compliant financial partners.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-stone-200/50 dark:border-stone-800/50 bg-stone-100 dark:bg-stone-900 mt-auto">
                <div className="flex flex-col md:flex-row justify-between items-center px-12 py-8 w-full max-w-7xl mx-auto">
                    <div className="text-lg font-bold text-emerald-900 mb-4 md:mb-0">Civic Naturalist</div>
                    <div className="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
                        <a className="font-public-sans text-sm uppercase tracking-widest text-stone-500 hover:text-emerald-600 transition-all font-semibold" href="#">Privacy Policy</a>
                        <a className="font-public-sans text-sm uppercase tracking-widest text-stone-500 hover:text-emerald-600 transition-all font-semibold" href="#">Accessibility</a>
                        <a className="font-public-sans text-sm uppercase tracking-widest text-stone-500 hover:text-emerald-600 transition-all font-semibold" href="#">Terms of Service</a>
                        <a className="font-public-sans text-sm uppercase tracking-widest text-stone-500 hover:text-emerald-600 transition-all font-semibold" href="#">Contact Us</a>
                    </div>
                    <p className="font-public-sans text-xs uppercase tracking-widest text-stone-400 text-center md:text-right">
                        © 2024 Civic Naturalist Botanical Gardens &amp; Zoo.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PaymentPage;
