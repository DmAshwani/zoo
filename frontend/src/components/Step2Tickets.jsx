import React from 'react';

function Step2Tickets({ ticketCounts, handleTicketChange, setStep, totalAmount }) {
  return (
    <div className="max-w-5xl mx-auto w-full px-6 py-8 pb-32 font-body text-on-surface">
      <section className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-primary mb-1 block">Step 2 of 4</span>
            <h2 className="text-3xl font-headline font-bold tracking-tight text-on-surface">Ticket Selection</h2>
          </div>
          <div className="flex gap-1">
            <div className="h-1.5 w-12 bg-surface-container-highest rounded-full"></div>
            <div className="h-1.5 w-12 bg-primary rounded-full"></div>
            <div className="h-1.5 w-12 bg-surface-container-highest rounded-full"></div>
            <div className="h-1.5 w-12 bg-surface-container-highest rounded-full"></div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-surface-container-low rounded-xl">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Entry Tickets</h3>
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="font-bold text-on-surface">Adult</p>
              <p className="text-sm text-on-surface-variant">₹80 (Above 12 yrs)</p>
            </div>
            <div className="flex items-center gap-4 bg-surface-container rounded-full p-1">
              <button onClick={() => handleTicketChange('Adult', -1)} className="w-8 h-8 rounded-full bg-surface hover:bg-surface-dim font-bold">-</button>
              <span className="font-bold w-4 text-center">{ticketCounts['Adult'] || 0}</span>
              <button onClick={() => handleTicketChange('Adult', 1)} className="w-8 h-8 rounded-full bg-surface hover:bg-surface-dim font-bold">+</button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="font-bold text-on-surface">Child</p>
              <p className="text-sm text-on-surface-variant">₹40 (3-12 yrs)</p>
            </div>
            <div className="flex items-center gap-4 bg-surface-container rounded-full p-1">
              <button onClick={() => handleTicketChange('Child', -1)} className="w-8 h-8 rounded-full bg-surface hover:bg-surface-dim font-bold">-</button>
              <span className="font-bold w-4 text-center">{ticketCounts['Child'] || 0}</span>
              <button onClick={() => handleTicketChange('Child', 1)} className="w-8 h-8 rounded-full bg-surface hover:bg-surface-dim font-bold">+</button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface-container-low rounded-xl">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Optional Add-ons</h3>
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="font-bold text-on-surface">Camera Pass</p>
              <p className="text-sm text-on-surface-variant">₹150 per camera</p>
            </div>
            <div className="flex items-center gap-4 bg-surface-container rounded-full p-1">
              <button onClick={() => handleTicketChange('Camera', -1)} className="w-8 h-8 rounded-full bg-surface hover:bg-surface-dim font-bold">-</button>
              <span className="font-bold w-4 text-center">{ticketCounts['Camera'] || 0}</span>
              <button onClick={() => handleTicketChange('Camera', 1)} className="w-8 h-8 rounded-full bg-surface hover:bg-surface-dim font-bold">+</button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-surface-bright/90 backdrop-blur-xl border-t border-outline-variant/10 px-6 py-4 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-6">
          <button onClick={() => setStep(1)} className="text-primary font-bold hover:underline">Go Back</button>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <span className="text-sm text-on-surface-variant">Total Amount</span>
              <p className="font-bold text-lg text-primary">₹{totalAmount}</p>
            </div>
            <button 
              disabled={totalAmount === 0}
              onClick={() => setStep(3)}
              className={`px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98]
                         ${totalAmount > 0 ? 'bg-primary text-on-primary hover:bg-primary-dim cursor-pointer' : 'bg-outline-variant/50 text-on-surface border cursor-not-allowed'}`}>
              Continue to Details
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2Tickets;
