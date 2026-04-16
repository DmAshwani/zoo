import React from 'react';

function Step1Date({ date, handleDateChange, slots, selectedSlot, setSelectedSlot, setStep }) {
  return (
    <div className="max-w-5xl mx-auto w-full px-6 py-8 pb-32 font-body text-on-surface">
      <section className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-primary mb-1 block">Step 1 of 3</span>
            <h2 className="text-3xl font-headline font-bold tracking-tight text-on-surface">Date & Time selection</h2>
          </div>
          <div className="flex gap-1">
            <div className="h-1.5 w-12 bg-primary rounded-full"></div>
            <div className="h-1.5 w-12 bg-surface-container-highest rounded-full"></div>
            <div className="h-1.5 w-12 bg-surface-container-highest rounded-full"></div>
          </div>
        </div>
        <p className="text-on-surface-variant max-w-md">Plan your journey through the sanctuary. Choose a date to see available entry windows.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Calendar UI (Simplified with native date input to wire backend logic) */}
        <section className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface">Select Date</h3>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl">
             <input type="date" value={date} onChange={handleDateChange} 
                    className="w-full p-4 border-2 border-outline-variant rounded-lg bg-surface-bright" />
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_12px_32px_rgba(44,52,51,0.06)] flex gap-4 items-center">
            <span className="text-[2rem]">🦁</span>
            <div>
              <span className="text-[10px] uppercase font-bold text-tertiary">Naturalist Tip</span>
              <p className="text-sm text-on-surface-variant leading-relaxed">Morning slots often feature active feeding sessions for our larger carnivores.</p>
            </div>
          </div>
        </section>

        {/* Right Column: Time Slots */}
        <section className="lg:col-span-7 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface">Available Entry Windows</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {slots.length === 0 && <p className="text-on-surface-variant text-sm col-span-2">No slots available for this date.</p>}
            {slots.map(s => {
              const isSelected = selectedSlot?.id === s.id;
              const isFull = s.availableCapacity === 0;
              const capacityPercentage = Math.round((s.availableCapacity / s.totalCapacity) * 100);

              return (
                <label key={s.id} className={`group relative cursor-pointer ${isFull ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <input type="radio" name="time_slot" className="hidden" 
                         disabled={isFull}
                         checked={isSelected} 
                         onChange={() => setSelectedSlot(s)} />
                  <div className={`p-5 rounded-xl border-2 transition-all group-hover:shadow-md 
                                  ${isSelected ? 'border-primary bg-primary-container/20' : 'border-transparent bg-surface-container-lowest'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`font-bold text-lg ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                        {s.startTime} — {s.endTime}
                      </span>
                      {isSelected ? (
                        <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                      ) : (
                        <span className="material-symbols-outlined text-outline-variant">{isFull ? 'block' : 'circle'}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex-grow h-1 bg-surface-container rounded-full overflow-hidden">
                         <div className={`h-full ${isFull ? 'bg-outline-variant' : capacityPercentage < 10 ? 'bg-error' : 'bg-primary'}`} 
                              style={{ width: `${capacityPercentage}%` }}></div>
                      </div>
                      <span className={`text-[11px] font-bold whitespace-nowrap 
                                      ${isFull ? 'text-outline uppercase' : capacityPercentage < 10 ? 'text-error' : 'text-on-surface-variant'}`}>
                        {isFull ? 'Sold Out' : `${s.availableCapacity} spots left`}
                      </span>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="bg-primary-container/30 border-l-4 border-primary p-6 rounded-r-xl">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary">info</span>
              <div>
                <h4 className="font-bold text-on-primary-container text-sm">Arrival Window Policy</h4>
                <p className="text-sm text-on-primary-container/80 mt-1">Please arrive within your selected 2-hour window. Once inside, you are welcome to stay until the sanctuary closes.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-surface-bright/90 backdrop-blur-xl border-t border-outline-variant/10 px-6 py-4 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-end gap-6">
          <button 
            disabled={!selectedSlot}
            onClick={() => setStep(2)}
            className={`px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98]
                       ${selectedSlot ? 'bg-primary text-on-primary hover:bg-primary-dim cursor-pointer' : 'bg-outline-variant/50 text-on-surface border cursor-not-allowed'}`}>
            Continue to Tickets
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step1Date;
