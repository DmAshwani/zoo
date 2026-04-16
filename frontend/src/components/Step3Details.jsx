import React from 'react';

function Step3Details({ userDetails, handleUserDetailsChange, setStep }) {
  return (
    <div className="max-w-5xl mx-auto w-full px-6 py-8 pb-32 font-body text-on-surface">
      <section className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-primary mb-1 block">Step 3 of 4</span>
            <h2 className="text-3xl font-headline font-bold tracking-tight text-on-surface">Visitor Details</h2>
          </div>
          <div className="flex gap-1">
            <div className="h-1.5 w-12 bg-surface-container-highest rounded-full"></div>
            <div className="h-1.5 w-12 bg-surface-container-highest rounded-full"></div>
            <div className="h-1.5 w-12 bg-primary rounded-full"></div>
            <div className="h-1.5 w-12 bg-surface-container-highest rounded-full"></div>
          </div>
        </div>
        <p className="text-on-surface-variant max-w-md">Please provide your contact information. Your tickets will be emailed here.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-low p-6 rounded-xl space-y-6">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">Full Name</label>
            <input 
              type="text" 
              value={userDetails?.name || ''}
              onChange={(e) => handleUserDetailsChange('name', e.target.value)}
              className="w-full p-4 border-2 border-outline-variant rounded-lg bg-surface-bright focus:border-primary outline-none transition-colors"
              placeholder="John Doe" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">Email Address</label>
            <input 
              type="email" 
              value={userDetails?.email || ''}
              onChange={(e) => handleUserDetailsChange('email', e.target.value)}
              className="w-full p-4 border-2 border-outline-variant rounded-lg bg-surface-bright focus:border-primary outline-none transition-colors"
              placeholder="john@example.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">Phone Number</label>
            <input 
              type="tel" 
              value={userDetails?.phone || ''}
              onChange={(e) => handleUserDetailsChange('phone', e.target.value)}
              className="w-full p-4 border-2 border-outline-variant rounded-lg bg-surface-bright focus:border-primary outline-none transition-colors"
              placeholder="+91 9876543210" 
            />
          </div>
        </div>

        <div className="bg-primary-container/30 border-l-4 border-primary p-6 rounded-r-xl self-start">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-primary">info</span>
            <div>
              <h4 className="font-bold text-on-primary-container text-sm">Account Note</h4>
              <p className="text-sm text-on-primary-container/80 mt-1">If you are logged directly into your account, we assume these details match your profile. Valid ID is still required at the gate.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-surface-bright/90 backdrop-blur-xl border-t border-outline-variant/10 px-6 py-4 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-6">
          <button onClick={() => setStep(2)} className="text-primary font-bold hover:underline">Go Back</button>
          <button 
            disabled={!userDetails.name || !userDetails.email || !userDetails.phone}
            onClick={() => setStep(4)}
            className={`px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98]
                       ${(userDetails.name && userDetails.email && userDetails.phone) ? 'bg-primary text-on-primary hover:bg-primary-dim cursor-pointer' : 'bg-outline-variant/50 text-on-surface border cursor-not-allowed'}`}>
            Continue to Payment
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step3Details;
