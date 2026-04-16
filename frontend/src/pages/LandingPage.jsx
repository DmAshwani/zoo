import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="bg-background text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container">
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[707px] min-h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover grayscale-[0.2] contrast-110" 
                 alt="cinematic wide shot of lush tropical greenhouse" 
                 src="https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=2000&auto=format&fit=crop" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
            <div className="max-w-2xl">
              <span className="inline-block text-primary font-bold tracking-widest uppercase text-xs mb-4">Official Botanical Garden & Zoo</span>
              <h2 className="text-6xl md:text-7xl font-bold text-on-surface tracking-tighter leading-[0.9] mb-6">
                  Where Nature <br/>
                  <span className="text-primary italic">Architecture</span> Meets.
              </h2>
              <p className="text-lg text-on-surface-variant mb-10 leading-relaxed font-medium max-w-md">
                  Experience the harmony of conservation and civic design. Our sanctuary hosts over 400 species within architecturally significant habitats.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book">
                  <button className="bg-primary text-on-primary px-10 py-4 rounded-lg text-lg font-semibold shadow-lg hover:bg-primary-dim transition-all">
                      Book Tickets
                  </button>
                </Link>
                <button className="flex items-center gap-2 px-8 py-4 text-on-surface font-semibold hover:bg-surface-container-low rounded-lg transition-colors border border-outline-variant/30">
                  <span className="material-symbols-outlined" data-icon="explore">explore</span>
                  View Map
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Information Bento Grid */}
        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Planning Card */}
              <div className="md:col-span-4 bg-surface-container-low p-8 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-primary text-4xl mb-6" data-icon="schedule">schedule</span>
                  <h3 className="text-2xl font-bold text-on-surface mb-2">Opening Hours</h3>
                  <p className="text-on-surface-variant">Daily sanctuary access and exhibit walkthroughs.</p>
                </div>
                <div className="mt-8">
                  <div className="text-4xl font-bold text-primary">9 AM - 6 PM</div>
                  <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mt-2">Monday through Sunday</p>
                </div>
              </div>
              
              {/* Pricing Card */}
              <div className="md:col-span-8 bg-surface-container-highest p-8 rounded-xl relative overflow-hidden flex flex-col justify-center">
                <div className="relative z-10 grid md:grid-cols-2 gap-8 h-full">
                  <div>
                    <h3 className="text-2xl font-bold text-on-surface mb-6">Access Pricing</h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
                        <div>
                          <span className="block font-bold text-lg">Adults</span>
                          <span className="text-sm text-on-surface-variant">Ages 13 and above</span>
                        </div>
                        <span className="text-3xl font-bold text-primary">₹80</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
                        <div>
                          <span className="block font-bold text-lg">Children</span>
                          <span className="text-sm text-on-surface-variant">Ages 3 to 12</span>
                        </div>
                        <span className="text-3xl font-bold text-primary">₹40</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest/50 backdrop-blur p-6 rounded-lg self-center">
                    <p className="text-sm italic text-on-surface-variant mb-4">"Proceeds directly support our local wildlife rehabilitation and international reforestation programs."</p>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <span className="material-symbols-outlined text-sm" data-icon="verified" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                      Verified Conservation Partner
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Process */}
              <div className="md:col-span-12 bg-white p-12 rounded-xl shadow-[0px_12px_32px_rgba(44,52,51,0.06)] mt-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                  <div>
                    <h3 className="text-3xl font-bold text-on-surface tracking-tight">How to Book</h3>
                    <p className="text-on-surface-variant mt-1">A simple three-step process for secure entry.</p>
                  </div>
                  <Link to="/book">
                    <button className="bg-tertiary-container text-on-tertiary-container px-8 py-3 rounded-lg font-bold hover:bg-tertiary-fixed-dim transition-colors">
                        Start Reservation
                    </button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-12">
                  <div className="relative">
                    <div className="text-8xl font-black text-surface-container-high absolute -top-8 -left-4 z-0 opacity-50">1</div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold text-on-surface mb-3">Select date</h4>
                      <p className="text-on-surface-variant leading-relaxed">Choose your preferred visit date from our availability calendar.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="text-8xl font-black text-surface-container-high absolute -top-8 -left-4 z-0 opacity-50">2</div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold text-on-surface mb-3">Choose tickets</h4>
                      <p className="text-on-surface-variant leading-relaxed">Specify the number of adult and child passes for your party.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="text-8xl font-black text-surface-container-high absolute -top-8 -left-4 z-0 opacity-50">3</div>
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold text-on-surface mb-3">Pay securely</h4>
                      <p className="text-on-surface-variant leading-relaxed">Complete your transaction via our encrypted payment portal.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Asymmetric Detail Section */}
        <section className="py-24 bg-surface-container-low overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <img className="w-full aspect-[4/5] object-cover rounded-xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700" 
                   alt="close-up of a majestic green iguana resting on a mossy branch" 
                   src="https://images.unsplash.com/photo-1574870111867-089730e5a72b?q=80&w=1000&auto=format&fit=crop"/>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <span className="text-tertiary font-bold uppercase tracking-[0.2em] text-xs">The Experience</span>
              <h2 className="text-5xl font-bold text-on-surface mt-4 mb-8 tracking-tight">Preserving nature through architectural intent.</h2>
              <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">
                  Our facilities are designed to minimize human footprint while maximizing animal welfare. Every enclosure is a bespoke ecosystem tailored to the specific needs of its inhabitants.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-on-surface font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  40+ Endangered Species Breeding Programs
                </li>
                <li className="flex items-center gap-4 text-on-surface font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Zero-Waste Botanical Education Center
                </li>
                <li className="flex items-center gap-4 text-on-surface font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Award-winning "Lichen" Glass Pavilions
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-100 dark:bg-stone-900 w-full border-t-0">
        <div className="max-w-7xl mx-auto px-12 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-900 dark:text-emerald-500" data-icon="park">park</span>
              <h4 className="font-bold uppercase tracking-widest text-emerald-950 text-lg">The Civic Naturalist</h4>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm font-public-sans tracking-normal max-w-xs">
                © 2024 The Civic Naturalist Botanical Gardens & Zoo. Preserving nature through architectural intent.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h5 className="font-bold text-on-surface mb-4 uppercase text-xs tracking-widest">Sitemap</h5>
              <ul className="space-y-2">
                <li><a className="text-stone-500 dark:text-stone-400 text-sm hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors" href="#">Conservation</a></li>
                <li><a className="text-stone-500 dark:text-stone-400 text-sm hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors" href="#">Education</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-on-surface mb-4 uppercase text-xs tracking-widest">Legal & Help</h5>
              <ul className="space-y-2">
                <li><a className="text-stone-500 dark:text-stone-400 text-sm hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors" href="#">Privacy Policy</a></li>
                <li><a className="text-stone-500 dark:text-stone-400 text-sm hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors" href="#">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
