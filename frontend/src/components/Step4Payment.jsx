import React from 'react';

function Step4Payment({ selectedSlot, ticketCounts, totalAmount, setStep, handleBook }) {
  return (
    <div className="max-w-5xl mx-auto w-full px-6 py-8 pb-32 font-body text-on-surface">
      <section className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-primary mb-1 block">Step 4 of 4</span>
            <h2 className="text-3xl font-headline font-bold tracking-tight text-on-surface">Payment & Checkout</h2>
          </div>
          <div className="flex gap-1">
            <div className="h-1.5 w-12 bg-surface-container-highest rounded-full"></div>
            <div className="h-1.5 w-12 bg-surface-container-highest rounded-full"></div>
            <div className="h-1.5 w-12 bg-surface-container-highest rounded-full"></div>
            <div className="h-1.5 w-12 bg-primary rounded-full"></div>
          </div>
        </div>
        <p className="text-on-surface-variant max-w-md">Review your booking summary and proceed with the secure payment gateway to confirm your tickets.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-low p-6 rounded-xl space-y-6">
          <h3 className="text-lg font-bold border-b pb-2">Booking Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Date</span>
              <span className="font-bold">{selectedSlot?.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Time Window</span>
              <span className="font-bold">{selectedSlot?.startTime} - {selectedSlot?.endTime}</span>
            </div>
          </div>
          
          <h3 className="text-lg font-bold border-b pb-2 pt-4">Tickets</h3>
          <ul className="space-y-3">
             {Object.entries(ticketCounts).map(([type, count]) => {
                if(count > 0) {
                   return (
                     <li key={type} className="flex justify-between">
                       <span>{count}x {type} {type !== 'Camera' ? 'Ticket' : 'Pass'}</span>
                     </li>
                   )
                }
                return null;
             })}
          </ul>

          <div className="flex justify-between items-center text-xl font-bold pt-6 border-t mt-6">
            <span>Total Amount</span>
            <span className="text-primary">₹{totalAmount}</span>
          </div>
        </div>

        <div className="p-6 border-2 border-primary bg-primary-container/10 rounded-xl flex flex-col justify-center items-center text-center space-y-4">
          <span className="material-symbols-outlined text-[4rem] text-primary">lock</span>
          <h3 className="text-xl font-bold">Secure Payment</h3>
          <p className="text-on-surface-variant">You will be redirected to Razorpay to complete your transaction securely.</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-surface-bright/90 backdrop-blur-xl border-t border-outline-variant/10 px-6 py-4 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-6">
          <button onClick={() => setStep(3)} className="text-primary font-bold hover:underline">Go Back</button>
          <button 
            onClick={handleBook}
            className="px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 bg-[#274635] text-[#e1ffea] hover:bg-[#1f382a] transition-all focus:ring-4 ring-primary-container active:scale-[0.98]">
            <span className="material-symbols-outlined">payments</span>
            Pay ₹{totalAmount}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step4Payment;
