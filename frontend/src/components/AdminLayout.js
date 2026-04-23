import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
    return (
        <div className="bg-background text-on-surface antialiased flex min-h-screen font-public-sans">
            <AdminSidebar />
            
            {/* Main Canvas */}
            <main className="ml-64 flex-1 min-h-screen relative pb-12">
                {/* TopNavBar Component */}
                <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-[0_12px_32px_-4px_rgba(26,28,25,0.06)] flex justify-between items-center px-12 h-20">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-on-surface-variant/60 tracking-widest flex items-center gap-2">
                            REPORTS <span className="material-symbols-outlined text-[12px]">chevron_right</span> DASHBOARD
                        </span>
                        <h2 className="text-lg font-black text-primary dark:text-[#FAFAF5]">Civic Naturalist Zoo</h2>
                    </div>
                    
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex gap-6">
                            <a href="#" className="text-primary dark:text-[#B9F395] border-b-2 border-primary-container text-sm uppercase tracking-widest font-semibold py-7">Overview</a>
                            <a href="#" className="text-on-surface-variant dark:text-stone-400 text-sm uppercase tracking-widest font-semibold py-7 hover:text-primary transition-all">Reports</a>
                            <a href="#" className="text-on-surface-variant dark:text-stone-400 text-sm uppercase tracking-widest font-semibold py-7 hover:text-primary transition-all">Archive</a>
                        </div>
                        
                        <div className="flex items-center gap-4 border-l border-outline-variant/20 pl-8">
                            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all">search</button>
                            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all relative">
                                notifications
                                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
                            </button>
                            <img 
                                alt="Admin" 
                                className="w-10 h-10 rounded-full border-2 border-primary-container object-cover" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAMkixDGM0EO1ayQBFELIxkvjQyQoRdI-AezKfYeEJKvKhbSaCt3GkbhAKE1jzf007LF4XUGQM1E3xfEOoUfEfi1AS-n289tFgNPPbOPC19SwZitjsD4GsWt4GAY8UfbdvCvrE-EBiaXc6_7uBhN6e2LLr-aEnC83oIE42E9lAzJh2JEjJb0RvGA05fxH5Vc80ok9RoT88eN9NgYzgmP8Tq5cY5S6NxNw5RkPLybwnzeIAwmu4PqRrW0Oq3UHup7t-7Cy5NsWRSOx7"
                            />
                        </div>
                    </div>
                </header>

                <div className="pt-32 px-12 max-w-7xl mx-auto space-y-10">
                    <Outlet />
                </div>
                
                {/* Contextual FAB - Suppression Logic: Only for Dashboard */}
                <button className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-on-primary rounded-full shadow-[0_12px_32px_-4px_rgba(26,28,25,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
                    <span className="material-symbols-outlined text-3xl">chat_bubble</span>
                </button>
            </main>
        </div>
    );
};

export default AdminLayout;
