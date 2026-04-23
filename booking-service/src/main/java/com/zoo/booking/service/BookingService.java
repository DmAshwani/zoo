package com.zoo.booking.service;

import com.zoo.booking.client.*;
import com.zoo.booking.dto.BookingRequest;
import com.zoo.booking.entity.Booking;
import com.zoo.booking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private InventoryClient inventoryClient;

    @Autowired
    private PricingClient pricingClient;

    @Transactional
    public Booking initiateBooking(BookingRequest request, Long userId) {
        
        // 1. Calculate Prices via Pricing Microservice
        PricingClient.PricingRequest pricingRequest = PricingClient.PricingRequest.builder()
                .slotId(request.getSlotId())
                .adultTickets(request.getAdultTickets())
                .childTickets(request.getChildTickets())
                .build();
        
        PricingClient.PriceBreakdownResponse price = pricingClient.calculatePrice(pricingRequest);

        // 2. Reduce Capacity via Inventory Microservice
        int totalTickets = request.getAdultTickets() + request.getChildTickets();
        inventoryClient.reduceCapacity(request.getSlotId(), totalTickets);

        // 3. Create Booking Record
        Booking booking = Booking.builder()
                .userId(userId)
                .slotId(request.getSlotId())
                .adultTickets(request.getAdultTickets())
                .childTickets(request.getChildTickets())
                .totalAmount(price.getTotalAmount())
                .status("PENDING")
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .guestEmail(request.getGuestEmail())
                .guestFullName(request.getGuestFullName())
                .guestMobileNumber(request.getGuestMobileNumber())
                .build();

        return bookingRepository.save(booking);
    }
    
    // Additional methods like confirmBooking, failBooking...
}
