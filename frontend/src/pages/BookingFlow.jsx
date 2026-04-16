import React, { useState } from 'react';
import api from '../api/axiosConfig';
import Step1Date from '../components/Step1Date';
import Step2Tickets from '../components/Step2Tickets';
import Step3Details from '../components/Step3Details';
import Step4Payment from '../components/Step4Payment';

function BookingFlow() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const [tickets, setTickets] = useState({ Adult: 1, Child: 0, Camera: 0, Safari: 0 });
  const [userDetails, setUserDetails] = useState({ name: '', email: '', phone: '' });
  
  const [bookingId, setBookingId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [ticketUrl, setTicketUrl] = useState('');

  const PRICING = { Adult: 80, Child: 40, Camera: 150, Safari: 100 };

  const calculateTotal = () => {
    return (tickets.Adult * PRICING.Adult) + 
           (tickets.Child * PRICING.Child) + 
           (tickets.Camera * PRICING.Camera) + 
           (tickets.Safari * PRICING.Safari);
  };

  const handleDateChange = async (e) => {
    setDate(e.target.value);
    try {
      const res = await api.get(`/slots/available?date=${e.target.value}`);
      setSlots(res.data);
      setSelectedSlot(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTicketChange = (type, val) => {
    setTickets(prev => ({ ...prev, [type]: Math.max(0, prev[type] + val) }));
  };

  const handleUserDetailsChange = (field, val) => {
    setUserDetails(prev => ({ ...prev, [field]: val }));
  };

  const handleBook = async () => {
    const payload = {
      slotId: selectedSlot.id,
      adultTickets: tickets.Adult,
      childTickets: tickets.Child,
      addOns: []
    };
    
    if (tickets.Camera > 0) payload.addOns.push({ addOnId: 1, quantity: tickets.Camera }); // Assuming 1=Camera
    if (tickets.Safari > 0) payload.addOns.push({ addOnId: 2, quantity: tickets.Safari }); // Assuming 2=Safari

    try {
      // 1. Initial Booking Request
      const res = await api.post('/bookings/initiate', payload);
      setBookingId(res.data.id);
      
      // 2. Fake Razorpay Payment completion mapped from the user's previously implemented flow
      const confirmRes = await api.post(`/bookings/confirm/${res.data.id}?paymentId=DUMMY_PAY_STITCH`);
      setPaymentStatus(true);
      setTicketUrl(confirmRes.data.pdfUrl);
      setStep(5); // Confirmation Screen
    } catch (err) {
      alert('Transaction Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      {step === 1 && (
        <Step1Date 
          date={date} 
          handleDateChange={handleDateChange} 
          slots={slots} 
          selectedSlot={selectedSlot} 
          setSelectedSlot={setSelectedSlot} 
          setStep={setStep} 
        />
      )}

      {step === 2 && (
        <Step2Tickets 
          ticketCounts={tickets} 
          handleTicketChange={handleTicketChange} 
          totalAmount={calculateTotal()}
          setStep={setStep} 
        />
      )}

      {step === 3 && (
        <Step3Details 
          userDetails={userDetails}
          handleUserDetailsChange={handleUserDetailsChange}
          setStep={setStep} 
        />
      )}

      {step === 4 && (
        <Step4Payment 
          selectedSlot={selectedSlot}
          ticketCounts={tickets}
          totalAmount={calculateTotal()}
          handleBook={handleBook}
          setStep={setStep} 
        />
      )}

      {step === 5 && (
        <div className="max-w-3xl mx-auto px-6 py-16 text-center mt-12 bg-surface-container-low rounded-xl shadow-lg border border-primary-container">
          <div className="w-20 h-20 bg-primary-container text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[3rem]">check_circle</span>
          </div>
          <h1 className="text-3xl font-headline font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-on-surface-variant mb-6">Booking ID: <span className="font-bold text-on-surface">{bookingId}</span></p>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-8">
            Your e-ticket has been generated with a unique QR code. Present it at the digital turnstiles when you arrive.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {ticketUrl && (
               <a href={`http://localhost:8080${ticketUrl}`} target="_blank" rel="noreferrer" 
                  className="px-6 py-3 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary-dim transition-colors flex items-center justify-center gap-2">
                 <span className="material-symbols-outlined">download</span>
                 Download PDF Ticket
               </a>
            )}
            <button className="px-6 py-3 rounded-xl font-bold bg-surface-container-highest text-on-surface hover:bg-surface-dim transition-colors block">
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingFlow;
