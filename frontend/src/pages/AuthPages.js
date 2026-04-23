import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await login(email, password);
            const roles = data.roles || [];
            
            if (roles.includes('ROLE_ADMIN')) {
                navigate('/admin');
            } else if (roles.includes('ROLE_GATEKEEPER')) {
                navigate('/staff/gatekeeper');
            } else if (roles.some(r => ['ROLE_SLOTS', 'ROLE_PRICING', 'ROLE_BOOKINGS', 'ROLE_ANALYTICS'].includes(r))) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background text-on-surface min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <img alt="The Civic Naturalist Conservatory" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzQ_snZZH_tX2lKuKgS_YY_a7CZ54uZTsaiXy4NjhN2LQ7bM2iUKIJn4DGBGxtGa-eFIqvl3gkeQzDQn8DgUWSR1MzDAAJF5cfK9pb1oomznirLz938OVi-wgfmNP_sJ8P9WARzfyuR5_tA5fPt1tPP0PlLoCgpiJegV5k9QcFTiflOmi-7BT4yMTuml8HWYdd5jlVQqQ1x9TfzekoBv1CVGU3Og0rMgVfj4HHF89ltv-emIOZU93LvO6EVEYEUyDFtdVgeDw8sqU" />
                <div className="absolute inset-0 bg-gradient-to-tr from-on-background/40 to-transparent"></div>
            </div>

            {/* Main Login Container */}
            <main className="z-10 w-full max-w-lg px-6">
                {/* Branding Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-extrabold tracking-tighter text-white drop-shadow-md">
                        The Civic Naturalist
                    </h1>
                    <p className="text-white/90 font-medium mt-2 uppercase text-xs tracking-widest">
                        Botanical Institution & Archive
                    </p>
                </div>

                {/* Login Card */}
                <div className="glass-card surface-container-lowest ambient-shadow rounded-xl p-10 flex flex-col gap-8 border border-white/20">
                    <header>
                        <h2 className="text-2xl font-bold tracking-tight text-on-surface">Sign In</h2>
                        <p className="text-on-surface-variant text-sm mt-1">Access your naturalist portal and collections.</p>
                        {error && <div className="text-error text-xs font-bold mt-2 bg-error-container/20 p-2 rounded">{error}</div>}
                    </header>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Email Field */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
                            <div className="relative">
                                <input
                                    className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-200"
                                    placeholder="naturalist@institution.org"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
                                <Link className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary-dim transition-colors" to="/forgot-password">Forgot Password?</Link>
                            </div>
                            <div className="relative">
                                <input
                                    className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary focus:bg-surface-container-highest transition-all duration-200"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Primary Action */}
                        <button type="submit" disabled={loading} className="mt-4 w-full bg-primary text-on-primary font-semibold py-4 rounded-lg shadow-sm hover:bg-primary-dim active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">login</span>
                            {loading ? 'Signing in...' : 'Continue to Portal'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-outline-variant/30"></div>
                        <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">or connect with</span>
                        <div className="flex-grow border-t border-outline-variant/30"></div>
                    </div>

                    {/* Social Logins */}
                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" className="flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-surface-container border border-outline-variant/10 hover:bg-surface-container-high transition-colors active:scale-95 duration-150">
                            <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY7vrIxuZwyuALPbPGL1R7mWTTOTKtZuJmt2d9Mp7fnNC5J7pHKzrULZRjj6wuLow4mrUIrcOXzbBzJJoekgUS21Qvf7ips2DO--g_JbE8c8xmBPfQpM3AmWmo3i1UPrNR8RF9oraXGqXgJo-17TAnDTVkVHW6kAk5NefjwCzznnXXKKjVT_WPAz7nHMHiSoFpyXw6LaSu1ZOlZvy2yLWu6UxZt9ocDwNIe5wz_bdIc0ETilxiGZbEGCUprw7Tt-JGy-J85KJuFhM" />
                            <span className="text-sm font-semibold text-on-secondary-fixed">Google</span>
                        </button>
                        <button type="button" className="flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-surface-container border border-outline-variant/10 hover:bg-surface-container-high transition-colors active:scale-95 duration-150">
                            <span className="material-symbols-outlined text-on-secondary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>ios</span>
                            <span className="text-sm font-semibold text-on-secondary-fixed">Apple</span>
                        </button>
                    </div>

                    {/* Footer Link */}
                    <footer className="text-center">
                        <p className="text-sm text-on-surface-variant">
                            New to the institution?{' '}
                            <Link className="text-primary font-bold hover:underline underline-offset-4 decoration-2" to="/signup">Create an account</Link>
                        </p>
                    </footer>
                </div>

                {/* System Status Bar */}
                <div className="mt-8 flex justify-center gap-6 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Systems Operational
                    </div>
                    <a className="hover:text-white transition-colors" href="#">Security Protocol</a>
                    <a className="hover:text-white transition-colors" href="#">Help Center</a>
                </div>
            </main>

            {/* Global Footer */}
            <footer className="fixed bottom-0 w-full px-12 py-6 flex flex-col md:flex-row justify-between items-center z-10">
                <p className="font-public-sans text-[10px] uppercase tracking-widest text-white/50">
                    © 2024 The Civic Naturalist Botanical Institution. All rights reserved.
                </p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a className="font-public-sans text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors" href="#">Privacy Policy</a>
                    <a className="font-public-sans text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors" href="#">Terms of Service</a>
                    <a className="font-public-sans text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors" href="#">Accessibility</a>
                </div>
            </footer>
        </div>
    );
};

export const SignupPage = () => {
    const [form, setForm] = useState({ fullName: '', email: '', password: '', mobileNumber: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signup(form.fullName, form.email, form.password, form.mobileNumber);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background text-on-surface min-h-screen flex flex-col items-center justify-center relative overflow-hidden pb-12">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <img alt="The Civic Naturalist Conservatory" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzQ_snZZH_tX2lKuKgS_YY_a7CZ54uZTsaiXy4NjhN2LQ7bM2iUKIJn4DGBGxtGa-eFIqvl3gkeQzDQn8DgUWSR1MzDAAJF5cfK9pb1oomznirLz938OVi-wgfmNP_sJ8P9WARzfyuR5_tA5fPt1tPP0PlLoCgpiJegV5k9QcFTiflOmi-7BT4yMTuml8HWYdd5jlVQqQ1x9TfzekoBv1CVGU3Og0rMgVfj4HHF89ltv-emIOZU93LvO6EVEYEUyDFtdVgeDw8sqU" />
                <div className="absolute inset-0 bg-gradient-to-tr from-on-background/40 to-transparent"></div>
            </div>

            <main className="z-10 w-full max-w-lg px-6 pt-12">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold tracking-tighter text-white drop-shadow-md">
                        The Civic Naturalist
                    </h1>
                </div>

                <div className="glass-card surface-container-lowest ambient-shadow rounded-xl p-8 flex flex-col gap-6 border border-white/20">
                    <header>
                        <h2 className="text-2xl font-bold tracking-tight text-on-surface">Create Account</h2>
                        <p className="text-on-surface-variant text-sm mt-1">Join the Civic Naturalist community.</p>
                        {error && <div className="text-error text-xs font-bold mt-2 bg-error-container/20 p-2 rounded">{error}</div>}
                    </header>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                            <input className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary" placeholder="John Doe" type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
                            <input className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary" placeholder="name@example.com" type="email" name="email" value={form.email} onChange={handleChange} required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Mobile Number</label>
                            <input className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary" placeholder="+91-9876543210" type="tel" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Password</label>
                            <input className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary" placeholder="Min 6 characters" type="password" name="password" minLength={6} value={form.password} onChange={handleChange} required />
                        </div>

                        <button type="submit" disabled={loading} className="mt-4 w-full bg-primary text-on-primary font-semibold py-4 rounded-lg shadow-sm hover:bg-primary-dim active:scale-[0.98] transition-all flex items-center justify-center">
                            {loading ? 'Creating...' : 'Create Account'}
                        </button>
                    </form>

                    <footer className="text-center mt-2">
                        <p className="text-sm text-on-surface-variant">
                            Already have an account?{' '}
                            <Link className="text-primary font-bold hover:underline underline-offset-4 decoration-2" to="/login">Sign in</Link>
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};
