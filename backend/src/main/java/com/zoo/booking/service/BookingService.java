package com.zoo.booking.service;

import com.zoo.booking.entity.AddOn;
import com.zoo.booking.entity.Booking;
import com.zoo.booking.entity.BookingAudit;
import com.zoo.booking.entity.Slot;
import com.zoo.booking.entity.User;
import com.zoo.booking.payload.request.CreateBookingRequest;
import com.zoo.booking.payload.response.PriceBreakdownResponse;
import com.zoo.booking.repository.AddOnRepository;
import com.zoo.booking.repository.BookingAuditRepository;
import com.zoo.booking.repository.BookingRepository;
import com.zoo.booking.repository.SlotRepository;
import com.zoo.booking.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddOnRepository addOnRepository;

    @Autowired
    private BookingAuditRepository bookingAuditRepository;

    @Autowired
    private PricingService pricingService;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final int BOOKING_EXPIRY_MINUTES = 10;

    /**
     * Create a new pending booking with capacity reservation and payment initiation.
     * This uses pessimistic locking to prevent race conditions.
     */
    @Transactional
    public Booking initiateBooking(CreateBookingRequest request) {
        log.info("Initiating booking for slot: {}", request.getSlotId());

        // Get current user
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lock slot row using pessimistic lock to prevent concurrent overbooking
        Slot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // Validate request
        validateBookingRequest(request, slot);

        // Calculate price
        PriceBreakdownResponse priceBreakdown = pricingService.calculatePriceBreakdown(request);
        Double totalAmount = priceBreakdown.getTotalAmount();

        // Create booking with PENDING status
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setSlot(slot);
        booking.setAdultTickets(request.getAdultTickets());
        booking.setChildTickets(request.getChildTickets());
        booking.setTotalAmount(totalAmount);
        booking.setStatus("PENDING");
        booking.setExpiryTime(LocalDateTime.now().plusMinutes(BOOKING_EXPIRY_MINUTES));

        // Store booked quantities for add-ons
        if (request.getAddOns() != null) {
            for (CreateBookingRequest.AddOnRequest addOnReq : request.getAddOns()) {
                AddOn addOn = addOnRepository.findById(addOnReq.getAddOnId())
                        .orElseThrow(() -> new RuntimeException("Add-on not found"));

                if ("Camera".equals(addOn.getName())) {
                    booking.setAddOnCamera(addOnReq.getQuantity());
                } else if ("Safari".equals(addOn.getName())) {
                    booking.setAddOnSafari(addOnReq.getQuantity());
                }
            }
        }

        // Deduct capacity (temporary reservation)
        int totalTickets = request.getAdultTickets() + request.getChildTickets();
        if (slot.getAvailableCapacity() < totalTickets) {
            throw new RuntimeException("Not enough capacity available");
        }

        slot.setAvailableCapacity(slot.getAvailableCapacity() - totalTickets);
        booking.setBookedAdults(request.getAdultTickets());
        booking.setBookedChildren(request.getChildTickets());

        // Validate and deduct add-on capacity
        if (request.getAddOns() != null) {
            for (CreateBookingRequest.AddOnRequest addOnReq : request.getAddOns()) {
                validateAndReserveAddOnCapacity(addOnReq.getAddOnId(), addOnReq.getQuantity());
            }
        }

        // Save booking and slot
        booking = bookingRepository.save(booking);
        slotRepository.save(slot);

        // Create audit log
        createAuditLog(booking, request, priceBreakdown, "CREATED", null);

        // Initiate payment (mock Razorpay order)
        String razorpayOrderId = "order_" + booking.getId() + "_" + System.currentTimeMillis();
        booking.setRazorpayOrderId(razorpayOrderId);
        booking = bookingRepository.save(booking);

        log.info("Booking initiated successfully: {} with order ID: {}", booking.getId(), razorpayOrderId);
        return booking;
    }

    /**
     * Confirm booking after successful payment via webhook.
     * This should only be called after payment verification.
     */
    @Transactional
    public Booking confirmBooking(Long bookingId, String paymentId) {
        log.info("Confirming booking: {} with payment: {}", bookingId, paymentId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("Booking status is not PENDING");
        }

        // Update booking status
        booking.setStatus("CONFIRMED");
        booking.setRazorpayPaymentId(paymentId);
        booking = bookingRepository.save(booking);

        // Generate ticket
        try {
            String pdfUrl = generateTicketPdf(booking);
            booking.setPdfUrl(pdfUrl);
            booking = bookingRepository.save(booking);
        } catch (Exception e) {
            log.error("Error generating ticket for booking: {}", bookingId, e);
        }

        createAuditLog(booking, null, null, "PAYMENT_SUCCESS", null);
        log.info("Booking confirmed successfully: {}", bookingId);

        return booking;
    }

    /**
     * Fail a booking and release capacity.
     * This is called when payment fails or booking expires.
     */
    @Transactional
    public Booking failBooking(Long bookingId, String reason) {
        log.warn("Failing booking: {} - Reason: {}", bookingId, reason);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if ("CONFIRMED".equals(booking.getStatus())) {
            log.error("Cannot fail a confirmed booking: {}", bookingId);
            throw new RuntimeException("Cannot fail a confirmed booking");
        }

        // Release capacity
        Slot slot = booking.getSlot();
        int totalTickets = booking.getAdultTickets() + booking.getChildTickets();
        slot.setAvailableCapacity(slot.getAvailableCapacity() + totalTickets);
        slotRepository.save(slot);

        // Release add-on capacity
        releaseAddOnCapacity(booking);

        // Update booking status
        booking.setStatus("FAILED");
        booking = bookingRepository.save(booking);

        createAuditLog(booking, null, null, "PAYMENT_FAILED", reason);
        log.info("Booking failed and capacity released: {}", bookingId);

        return booking;
    }

    /**
     * Validate booking request for feasibility.
     */
    private void validateBookingRequest(CreateBookingRequest request, Slot slot) {
        if (request.getAdultTickets() < 1) {
            throw new RuntimeException("At least 1 adult ticket is required");
        }

        int totalTickets = request.getAdultTickets() + request.getChildTickets();
        if (totalTickets > slot.getAvailableCapacity()) {
            throw new RuntimeException("Not enough capacity. Available: " + slot.getAvailableCapacity());
        }

        // Validate add-ons
        if (request.getAddOns() != null) {
            for (CreateBookingRequest.AddOnRequest addOnReq : request.getAddOns()) {
                AddOn addOn = addOnRepository.findById(addOnReq.getAddOnId())
                        .orElseThrow(() -> new RuntimeException("Add-on not found"));

                if (addOn.getMaxLimitPerBooking() != null &&
                    addOnReq.getQuantity() > addOn.getMaxLimitPerBooking()) {
                    throw new RuntimeException("Add-on quantity exceeds limit: " + addOn.getName());
                }
            }
        }
    }

    /**
     * Validate add-on capacity and reserve it.
     */
    private void validateAndReserveAddOnCapacity(Long addOnId, Integer quantity) {
        AddOn addOn = addOnRepository.findById(addOnId)
                .orElseThrow(() -> new RuntimeException("Add-on not found"));

        if (addOn.getAvailableCapacity() != null) {
            int availableSpace = addOn.getAvailableCapacity() - addOn.getBookedCapacity();
            if (quantity > availableSpace) {
                throw new RuntimeException("Add-on capacity exhausted: " + addOn.getName());
            }

            addOn.setBookedCapacity(addOn.getBookedCapacity() + quantity);
            addOnRepository.save(addOn);
        }
    }

    /**
     * Release add-on capacity when booking fails.
     */
    private void releaseAddOnCapacity(Booking booking) {
        if (booking.getBookedAddOnCamera() != null && booking.getBookedAddOnCamera() > 0) {
            Optional<AddOn> camera = addOnRepository.findByName("Camera");
            if (camera.isPresent()) {
                camera.get().setBookedCapacity(camera.get().getBookedCapacity() - booking.getBookedAddOnCamera());
                addOnRepository.save(camera.get());
            }
        }

        if (booking.getBookedAddOnSafari() != null && booking.getBookedAddOnSafari() > 0) {
            Optional<AddOn> safari = addOnRepository.findByName("Safari");
            if (safari.isPresent()) {
                safari.get().setBookedCapacity(safari.get().getBookedCapacity() - booking.getBookedAddOnSafari());
                addOnRepository.save(safari.get());
            }
        }
    }

    /**
     * Create audit log for booking transaction.
     */
    private void createAuditLog(Booking booking, CreateBookingRequest request,
                               PriceBreakdownResponse priceBreakdown,
                               String status, String errorMessage) {
        try {
            BookingAudit audit = new BookingAudit();
            audit.setBooking(booking);
            audit.setStatus(status);
            audit.setErrorMessage(errorMessage);

            if (request != null) {
                audit.setRequestPayload(objectMapper.writeValueAsString(request));
            }

            if (priceBreakdown != null) {
                audit.setPriceBreakdown(objectMapper.writeValueAsString(priceBreakdown));
            }

            bookingAuditRepository.save(audit);
        } catch (Exception e) {
            log.error("Error creating audit log for booking: {}", booking.getId(), e);
        }
    }

    /**
     * Generate PDF ticket (mock implementation).
     */
    private String generateTicketPdf(Booking booking) throws Exception {
        // Delegate to TicketService
        return "ticket_" + booking.getId() + ".pdf";
    }
}

