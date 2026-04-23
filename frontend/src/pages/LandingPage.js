import React from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const LandingPage = () => {
  const [adultPrice, setAdultPrice] = React.useState(800);

  React.useEffect(() => {
    api.get('/public/pricing/tickets')
      .then(res => {
        if (res.data.ADULT) setAdultPrice(res.data.ADULT);
      })
      .catch(err => console.error('Error fetching landing prices:', err));
  }, []);

  return (
    <div className="bg-background text-on-surface">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 glass-nav shadow-[0px_12px_32px_rgba(44,52,51,0.06)] px-12 py-4 flex justify-between items-center max-w-full mx-auto">
        <div className="text-2xl font-bold tracking-tighter text-emerald-900 dark:text-emerald-50">Civic Naturalist Zoo</div>
        <div className="hidden md:flex items-center space-x-8 font-public-sans tracking-tight text-on-surface">
          <a className="text-stone-600 dark:text-stone-400 hover:text-emerald-700 hover:bg-emerald-50/50 transition-colors" href="#">Exhibits</a>
          <a className="text-stone-600 dark:text-stone-400 hover:text-emerald-700 hover:bg-emerald-50/50 transition-colors" href="#">Conservation</a>
          <a className="text-stone-600 dark:text-stone-400 hover:text-emerald-700 hover:bg-emerald-50/50 transition-colors" href="#">Tickets</a>
          <a className="text-stone-600 dark:text-stone-400 hover:text-emerald-700 hover:bg-emerald-50/50 transition-colors" href="#">Visit</a>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-6 py-2 text-stone-600 dark:text-stone-400 font-medium hover:text-emerald-700 transition-colors">Support Us</button>
          <Link to="/login" className="px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold scale-95 duration-200 ease-in-out hover:bg-primary-dim inline-block">Sign In</Link>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover grayscale-[20%] opacity-90" alt="Cinematic wide shot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCAHBPR6rg9ww7zCvQDEbJ-U6i18e3dIxocjsUE-NVkMrakrUYkXTA8goTxwHffkoIQLu5YW5_O6aPsvNt4WtIcDhWti6RMIQGLGJtVIzs0PXj-nfvK1qaZMGO69x6QMA55smXlbdXSez2ZOCPGc3YjgmAsjs9Oz-TNWpJEv8dr1CFtoM5Z1wHdG_lVudbhEHQaAnQBD9Jva0x7SfZFUSc6wEtpNyxS2kEkCDcgIyooo5ItH-LVifRqh1tOmOGm_aYne940qC4PU0"/>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent"></div>
        </div>
        <div className="container mx-auto px-12 relative z-10 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7">
            <span className="inline-block px-4 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-sm font-bold tracking-widest uppercase mb-6">Established 1894</span>
            <h1 className="text-7xl font-extrabold tracking-tighter text-on-primary mb-8 leading-[0.95]">Architecting <br/>the Natural World.</h1>
            <p className="text-xl text-on-primary/90 max-w-xl mb-12 font-light leading-relaxed">Experience a sanctuary where civic duty meets biological wonder. Our botanical gardens and zoo are curated to foster deep connection with our planet's most vital species.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/book/date" className="px-10 py-5 bg-surface-container-lowest text-primary text-lg font-bold rounded-xl shadow-xl hover:bg-primary-container transition-all">Book Tickets</Link>
              <button className="px-10 py-5 border-2 border-on-primary/30 text-on-primary text-lg font-bold rounded-xl backdrop-blur-md hover:bg-on-primary/10 transition-all">Explore Exhibits</button>
            </div>
          </div>
        </div>
      </section>
      {/* Utility & Info Clusters (Bento) */}
      <section className="py-24 px-12 bg-surface">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Opening Hours */}
            <div className="md:col-span-1 bg-surface-container-low p-8 rounded-xl flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-primary text-4xl mb-4" data-icon="schedule">schedule</span>
                <h3 className="text-2xl font-bold tracking-tight mb-4">Opening Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant uppercase tracking-wider">Weekday</span>
                    <span className="font-bold">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant uppercase tracking-wider">Weekend</span>
                    <span className="font-bold">08:00 - 20:00</span>
                  </div>
                  <div className="pt-4 mt-4 border-t border-outline-variant/20">
                    <p className="text-xs text-on-surface-variant leading-relaxed">Last entry strictly 60 minutes before closing time.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Pricing Overview */}
            <div className="md:col-span-2 bg-surface-container-high p-8 rounded-xl relative overflow-hidden group">
              <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-3xl font-extrabold tracking-tighter mb-6">Access &amp; Support</h3>
                <div className="grid grid-cols-2 gap-8 flex-grow">
                  <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm">
                    <h4 className="font-bold text-lg mb-1">Standard Adult</h4>
                    <p className="text-primary font-black text-3xl mb-4">₹{adultPrice}.00</p>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Includes Conservatories</p>
                  </div>
                  <div className="bg-primary text-on-primary p-6 rounded-lg shadow-sm">
                    <h4 className="font-bold text-lg mb-1">Annual Member</h4>
                    <p className="text-on-primary font-black text-3xl mb-4">₹1800.00</p>
                    <p className="text-xs text-on-primary/70 uppercase tracking-widest font-bold">Unlimited Access</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <span className="material-symbols-outlined text-[12rem]" data-icon="park">park</span>
              </div>
            </div>
            {/* Live Updates */}
            <div className="md:col-span-1 bg-tertiary-container p-8 rounded-xl flex flex-col justify-center">
              <span className="material-symbols-outlined text-on-tertiary-container text-4xl mb-4" data-icon="eco">eco</span>
              <h3 className="text-xl font-bold text-on-tertiary-container mb-2">Botanical Update</h3>
              <p className="text-on-tertiary-container/80 text-sm italic">"The Titan Arum is currently in early bloom phase. Visit Pavilion 4 for viewing."</p>
            </div>
          </div>
        </div>
      </section>
      {/* Asymmetric Gallery/Exhibit Section */}
      <section className="py-24 bg-surface-container-low overflow-hidden">
        <div className="container mx-auto px-12">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-5/12">
              <h2 className="text-5xl font-black tracking-tighter mb-8 leading-none">Curated <br/>Ecosystems.</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">Each exhibit at The Civic Naturalist is a masterclass in architectural ecology. We don't just display nature; we reconstruct the atmospheric and geological conditions required for life to flourish.</p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-sm" data-icon="check">check</span>
                  </span>
                  <div>
                    <h4 className="font-bold text-on-surface uppercase tracking-widest text-xs mb-1">Cloud Forest Pavilion</h4>
                    <p className="text-sm text-on-surface-variant">Automated misting and temperature control at 1,500m simulation.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-sm" data-icon="check">check</span>
                  </span>
                  <div>
                    <h4 className="font-bold text-on-surface uppercase tracking-widest text-xs mb-1">Arid Garden Spire</h4>
                    <p className="text-sm text-on-surface-variant">Housing 400+ rare succulent species in a geodesic structure.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-7/12 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <img className="w-full h-[300px] object-cover rounded-xl shadow-xl" alt="Tropical leaf" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmxWtc8HRbX88K6cAyR9DNIl85XUuh0c8cDJnYemzSe3MYDjDg358g8Pwp-zfaZ-EuVxncKbSz_K4xDjTHHO_GSPLIh0m1WNSbd4dedrXcaocdHWFwfO8JVlgz4YMoZvC9JA0ywLvUqRuSol2_zJBbGMnHizcBTqUpKpzE_pPL_hGyVx5bQsd6gsH7YROmHeVyGaHj8vC6e_uk39A96ydKyQmpE3Lmk3wpkr_QGGfiFeJjs9tPgSt5vvX9x48RuCcDLG0Ac7YaAkk" />
                  <img className="w-full h-[400px] object-cover rounded-xl shadow-xl" alt="Tiger" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjyO-fWW17XnnPCOT5ooNBwDwl0sA9hu_pCaAY9TMkMa70F5NKYujeT7dJ1SOT4BlvYiMDnMyU-PsJGu0Y83aQCvP0GumKO752A3SIeMtzFO-Vq6QfBYV4cB_Mo7xucbVeGCeeZCV5G-Hi0U7xhqgIZXBm_ybdIHMyOgU_7liT-tfKxk9gb9G9aweCUl_jSxO8CxMJgCaAsxXtobRkR2G6az8nh1YOy2L--qI5OyTiXRXuytkVizU0-K0Vu9T7uoKnuWorWNJdRqE" />
                </div>
                <div className="space-y-4">
                  <img className="w-full h-[400px] object-cover rounded-xl shadow-xl" alt="Botanical garden" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX9NwdYHOhPytmo7vNdaFCfOUI2K8PPI_kdT0QL8G0sSIh3aqyKHv-sVF16dqoZ8AmTXbxH6DCDbgfeQ1XVku-foqbb7ugW1_7yD4PmDm5R56wwc3iQUeFtCEWdl1ltBDcDtzl-cClwAOjLcV8LEtGmftYHfFwq8CxON9aLa9R8WoB8UwfmNMQ2PRYrsDlT-PIGcELPsEPgElVepnHhai60ox37Hvj2g5L5iW7DzJxwZdLZYlz6epf03AsEqY3e5kiAl6sR3VKvNQ" />
                  <img className="w-full h-[300px] object-cover rounded-xl shadow-xl" alt="Elephant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeSzTXImPVlejr5cws04f7qXF71goDSTECQe5jR1LL_x5N5m_UlTDs9TFl78QeysGBgpldCStrQ6I1UrgXoCT-lXJwPRtxIZmGJPZ0RNRkw8JddPNHmj0AsHGrmbFk-jCPUo8T5qOOrmBdXRSgSg68YlzBbXA5sx5Oc9-Zwf5vl6gf5XO1-wx8GpWx7HGr2ovi_GXRtE92615krm4mqVevMe8DUM_9dtxeRK46joNAIKnJPZ9eEJuK0cvtdcPqfDZR84vpKNmY8JE" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Conservation CTA (Editorial Style) */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-12 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary mb-6 block">Our Mission</span>
            <h2 className="text-6xl font-extrabold tracking-tighter mb-10 leading-[1.1]">Preserving Biodiversity <br/>through Civic Engagement.</h2>
            <p className="text-xl text-on-surface-variant font-light mb-12">We believe that to love nature, one must see it in its most heroic state. Join our conservation efforts today.</p>
            <div className="flex justify-center gap-6">
              <button className="px-12 py-6 bg-primary text-on-primary rounded-lg font-bold text-lg hover:bg-primary-dim transition-all shadow-lg">Become a Member</button>
              <button className="px-12 py-6 border border-outline text-on-surface rounded-lg font-bold text-lg hover:bg-surface-container transition-all">Read Annual Report</button>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="w-full border-t border-stone-200/50 dark:border-stone-800/50 bg-stone-100 dark:bg-stone-900 py-16">
        <div className="container mx-auto px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="text-lg font-bold text-emerald-900 tracking-tighter">Civic Naturalist Botanical Gardens &amp; Zoo</div>
            <div className="flex flex-wrap gap-8 font-public-sans text-sm uppercase tracking-widest">
              <a className="text-stone-500 dark:text-stone-400 hover:text-emerald-600 transition-all opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
              <a className="text-stone-500 dark:text-stone-400 hover:text-emerald-600 transition-all opacity-80 hover:opacity-100" href="#">Accessibility</a>
              <a className="text-stone-500 dark:text-stone-400 hover:text-emerald-600 transition-all opacity-80 hover:opacity-100" href="#">Terms of Service</a>
              <a className="text-stone-500 dark:text-stone-400 hover:text-emerald-600 transition-all opacity-80 hover:opacity-100" href="#">Contact Us</a>
            </div>
          </div>
          <div className="text-stone-400 text-xs text-center border-t border-stone-200/20 pt-8 uppercase tracking-widest">
            © 2024 Civic Naturalist Botanical Gardens &amp; Zoo. A Sanctuary for Biodiversity.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
