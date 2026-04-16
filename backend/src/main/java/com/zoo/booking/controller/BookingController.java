package com.zoo.booking.controller;

import com.zoo.booking.entity.Booking;
import com.zoo.booking.entity.Slot;
import com.zoo.booking.entity.User;
import com.zoo.booking.repository.BookingRepository;
import com.zoo.booking.repository.SlotRepository;
import com.zoo.booking.repository.UserRepository;
import com.zoo.booking.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Bookings", description = "Endpoints for managing zoo ticket bookings")
public class BookingController {

    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    SlotRepository slotRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TicketService ticketService;

    @PostMapping("/initiate")
    @SecurityRequirement(name = "Bearer")
    @Operation(summary = "Initiate Booking", description = "Initiate a new booking for the authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Booking initiated successfully"),
        @ApiResponse(responseCode = "400", description = "Slot not found or invalid request"),
        @ApiResponse(responseCode = "409", description = "Not enough capacity in selected slot")
    })
    public ResponseEntity<?> initiateBooking(@RequestBody Booking bookingRequest) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();
        User user = userRepository.findByEmail(email).orElseThrow();

        Optional<Slot> optSlot = slotRepository.findById(bookingRequest.getSlot().getId());
        if (!optSlot.isPresent()) {
            return ResponseEntity.badRequest().body("Slot not found");
        }
        Slot slot = optSlot.get();

        int totalTickets = bookingRequest.getAdultTickets() + bookingRequest.getChildTickets();

        if (slot.getAvailableCapacity() < totalTickets) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Not enough capacity");
        }

        // Deduct capacity
        slot.setAvailableCapacity(slot.getAvailableCapacity() - totalTickets);
        slotRepository.save(slot);

        bookingRequest.setUser(user);
        bookingRequest.setStatus("PENDING");
        
        // Mock Razorpay Order ID (In Prod: Call Razorpay API)
        bookingRequest.setRazorpayOrderId("order_test_" + System.currentTimeMillis());

        Booking savedBooking = bookingRepository.save(bookingRequest);
        return ResponseEntity.ok(savedBooking);
    }

    @PostMapping("/confirm/{id}")
    @SecurityRequirement(name = "Bearer")
    @Operation(summary = "Confirm Booking", description = "Confirm a booking after successful payment")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Booking confirmed successfully"),
        @ApiResponse(responseCode = "404", description = "Booking not found"),
        @ApiResponse(responseCode = "500", description = "Error generating ticket")
    })
    public ResponseEntity<?> confirmBooking(@PathVariable Long id, @RequestParam String paymentId) {
        Optional<Booking> optBooking = bookingRepository.findById(id);
        if (!optBooking.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Booking booking = optBooking.get();
        // In Prod: Verify Razorpay signature
        
        booking.setStatus("CONFIRMED");
        booking.setRazorpayPaymentId(paymentId);

        try {
            String pdfUrl = ticketService.generatePdfTicket(booking);
            booking.setPdfUrl("/api/bookings/ticket/" + pdfUrl);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating ticket");
        }

        bookingRepository.save(booking);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/my-bookings")
    @SecurityRequirement(name = "Bearer")
    @Operation(summary = "Get User's Bookings", description = "Retrieve all bookings for the authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Bookings retrieved successfully")
    })
    public ResponseEntity<List<Booking>> getUserBookings() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();
        User user = userRepository.findByEmail(email).orElseThrow();

        return ResponseEntity.ok(bookingRepository.findByUser(user));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer")
    @Operation(summary = "Get All Bookings", description = "Retrieve all bookings (Admin only)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Bookings retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Admin role required")
    })
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }
}
