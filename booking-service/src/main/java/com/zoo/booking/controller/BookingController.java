package com.zoo.booking.controller;

import com.zoo.booking.dto.BookingRequest;
import com.zoo.booking.entity.Booking;
import com.zoo.booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/initiate")
    public ResponseEntity<Booking> initiateBooking(@RequestBody BookingRequest request) {
        // In a real scenario, we'd get the user ID from the security context (JWT)
        // For guest bookings, userId could be null
        Long userId = null; 
        // Logic to extract userId from SecurityContext if authenticated
        
        return ResponseEntity.ok(bookingService.initiateBooking(request, userId));
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<Booking> confirmBooking(@PathVariable Long id, @RequestParam String paymentId) {
        // Implementation for confirmation logic
        return ResponseEntity.ok().build(); 
    }
}
