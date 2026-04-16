package com.zoo.booking.service;

import com.zoo.booking.entity.AddOn;
import com.zoo.booking.entity.Slot;
import com.zoo.booking.entity.SlotPricing;
import com.zoo.booking.payload.request.CreateBookingRequest;
import com.zoo.booking.payload.response.PriceBreakdownResponse;
import com.zoo.booking.repository.AddOnRepository;
import com.zoo.booking.repository.SlotPricingRepository;
import com.zoo.booking.repository.SlotRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class PricingService {

    @Autowired
    private SlotPricingRepository slotPricingRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private AddOnRepository addOnRepository;

    /**
     * Calculate price breakdown for a booking request.
     * This is backend-only pricing calculation - NEVER trust frontend values.
     */
    public PriceBreakdownResponse calculatePriceBreakdown(CreateBookingRequest request) {
        log.info("Calculating price breakdown for booking request: {}", request);

        PriceBreakdownResponse response = new PriceBreakdownResponse();
        Slot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // Calculate adult ticket cost
        Double adultPrice = getTicketPrice(slot.getId(), "ADULT");
        Integer adultCount = request.getAdultTickets();
        Double adultSubtotal = adultPrice * adultCount;

        response.setAdultPrice(adultPrice);
        response.setAdultCount(adultCount);
        response.setAdultSubtotal(adultSubtotal);

        // Calculate child ticket cost
        Double childPrice = getTicketPrice(slot.getId(), "CHILD");
        Integer childCount = request.getChildTickets();
        Double childSubtotal = childPrice * childCount;

        response.setChildPrice(childPrice);
        response.setChildCount(childCount);
        response.setChildSubtotal(childSubtotal);

        // Calculate add-on costs
        Double addOnTotal = 0.0;
        List<PriceBreakdownResponse.AddOnBreakdown> addOnsList = new ArrayList<>();

        if (request.getAddOns() != null && !request.getAddOns().isEmpty()) {
            int totalTickets = adultCount + childCount;

            for (CreateBookingRequest.AddOnRequest addOnRequest : request.getAddOns()) {
                AddOn addOn = addOnRepository.findById(addOnRequest.getAddOnId())
                        .orElseThrow(() -> new RuntimeException("Add-on not found: " + addOnRequest.getAddOnId()));

                PriceBreakdownResponse.AddOnBreakdown addOnBreakdown = new PriceBreakdownResponse.AddOnBreakdown();
                addOnBreakdown.setAddOnId(addOn.getId());
                addOnBreakdown.setAddOnName(addOn.getName());
                addOnBreakdown.setAddOnType(addOn.getType());
                addOnBreakdown.setPrice(addOn.getPrice());
                addOnBreakdown.setQuantity(addOnRequest.getQuantity());

                // Calculate add-on subtotal based on type
                Double addOnSubtotal;
                if ("PER_PERSON".equals(addOn.getType())) {
                    addOnSubtotal = addOn.getPrice() * totalTickets * addOnRequest.getQuantity();
                } else { // PER_BOOKING
                    addOnSubtotal = addOn.getPrice() * addOnRequest.getQuantity();
                }

                addOnBreakdown.setSubtotal(addOnSubtotal);
                addOnsList.add(addOnBreakdown);
                addOnTotal += addOnSubtotal;
            }
        }

        response.setAddOns(addOnsList);

        // Calculate total
        Double totalAmount = adultSubtotal + childSubtotal + addOnTotal;
        response.setTotalAmount(totalAmount);

        log.info("Price breakdown calculated - Total: {}", totalAmount);
        return response;
    }

    /**
     * Get ticket price for a specific ticket type and slot.
     * Checks slot-specific pricing first, then falls back to default price.
     */
    private Double getTicketPrice(Long slotId, String ticketType) {
        // Try to get slot-specific pricing
        SlotPricing slotPricing = slotPricingRepository.findBySlotIdAndTicketType(slotId, ticketType)
                .orElse(null);

        if (slotPricing != null && slotPricing.getIsActive()) {
            log.debug("Using slot-specific price for {} at slot {}: {}",
                    ticketType, slotId, slotPricing.getPrice());
            return slotPricing.getPrice();
        }

        // Fallback to default price from ticket_type table
        // For now, using hardcoded defaults - can be moved to database
        if ("ADULT".equals(ticketType)) {
            return 100.0; // ₹100 for adults
        } else if ("CHILD".equals(ticketType)) {
            return 50.0; // ₹50 for children
        }

        throw new RuntimeException("No pricing found for ticket type: " + ticketType);
    }

    /**
     * Apply dynamic pricing based on remaining capacity.
     * If capacity is low, increase price.
     */
    public Double applyDynamicPricing(Double basePrice, Integer remainingCapacity, Integer totalCapacity) {
        if (remainingCapacity == null || totalCapacity == null || totalCapacity == 0) {
            return basePrice;
        }

        double occupancyPercentage = (double) (totalCapacity - remainingCapacity) / totalCapacity;

        // Pricing tiers based on occupancy
        if (occupancyPercentage >= 0.9) {
            return basePrice * 1.5; // 50% increase at 90% occupancy
        } else if (occupancyPercentage >= 0.7) {
            return basePrice * 1.25; // 25% increase at 70% occupancy
        }

        return basePrice;
    }
}

