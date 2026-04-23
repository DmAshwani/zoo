package com.zoo.booking.service;

import com.zoo.booking.entity.*;
import com.zoo.booking.payload.request.CreateBookingRequest;
import com.zoo.booking.payload.response.PriceBreakdownResponse;
import com.zoo.booking.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PricingService {

    private final TicketTypeRepository ticketTypeRepository;
    private final SlotPricingRepository slotPricingRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final SlotRepository slotRepository;

    public PricingService(TicketTypeRepository ticketTypeRepository,
                          SlotPricingRepository slotPricingRepository,
                          SystemSettingRepository systemSettingRepository,
                          SlotRepository slotRepository) {
        this.ticketTypeRepository = ticketTypeRepository;
        this.slotPricingRepository = slotPricingRepository;
        this.systemSettingRepository = systemSettingRepository;
        this.slotRepository = slotRepository;
    }

    public Map<String, Double> resolvePricesForSlot(Long slotId) {
        Map<String, Double> finalPrices = new HashMap<>();
        List<TicketType> types = ticketTypeRepository.findAll();
        
        // Initialize with default prices
        for (TicketType type : types) {
            if (Boolean.TRUE.equals(type.getIsActive())) {
                finalPrices.put(type.getName(), type.getDefaultPrice().doubleValue());
            }
        }

        // Apply fallback defaults if not found in DB
        if (!finalPrices.containsKey("ADULT")) finalPrices.put("ADULT", 800.0);
        if (!finalPrices.containsKey("CHILD")) finalPrices.put("CHILD", 500.0);

        // 1. Apply Manual Overrides if enabled
        boolean overridesEnabled = systemSettingRepository.getBooleanValue("manual_overrides_enabled", true);
        if (overridesEnabled && slotId != null) {
            List<SlotPricing> overrides = slotPricingRepository.findBySlotId(slotId);
            for (SlotPricing override : overrides) {
                if (Boolean.TRUE.equals(override.getIsActive())) {
                    finalPrices.put(override.getTicketType(), override.getPrice());
                }
            }
        }

        // 2. Apply Automatic Surge (Occupancy Based) if enabled
        boolean automaticEnabled = systemSettingRepository.getBooleanValue("dynamic_pricing_enabled", true);
        if (automaticEnabled && slotId != null) {
            Optional<Slot> slotOpt = slotRepository.findById(slotId);
            if (slotOpt.isPresent()) {
                Slot slot = slotOpt.get();
                int threshold = systemSettingRepository.getIntValue("surge_threshold_percent", 90);
                double multiplier = systemSettingRepository.getDoubleValue("surge_multiplier", 1.5);
                
                int total = slot.getTotalCapacity();
                int available = slot.getAvailableCapacity();
                int booked = total - available;
                
                if (total > 0 && ((double) booked / total) * 100 >= threshold) {
                    // Apply surge multiplier to current values (which might already be overridden)
                    for (String type : finalPrices.keySet()) {
                        finalPrices.put(type, finalPrices.get(type) * multiplier);
                    }
                }
            }
        }

        return finalPrices;
    }

    public PriceBreakdownResponse calculatePriceBreakdown(CreateBookingRequest request) {
        Long slotId = request.getSlotId();
        Map<String, Double> prices = resolvePricesForSlot(slotId);
        
        Double adultBase = prices.getOrDefault("ADULT", 800.0);
        Double childBase = prices.getOrDefault("CHILD", 500.0);
        
        int adults = request.getAdultTickets() != null ? request.getAdultTickets() : 0;
        int children = request.getChildTickets() != null ? request.getChildTickets() : 0;
        
        Double adultSubtotal = adultBase * adults;
        Double childSubtotal = childBase * children;
        
        PriceBreakdownResponse response = new PriceBreakdownResponse();
        response.setAdultPrice(adultBase);
        response.setAdultCount(adults);
        response.setAdultSubtotal(adultSubtotal);
        
        response.setChildPrice(childBase);
        response.setChildCount(children);
        response.setChildSubtotal(childSubtotal);
        
        double addOnTotal = 0.0;
        // Conservation levy
        response.setTotalAmount(adultSubtotal + childSubtotal + addOnTotal + 100.0); 
        return response;
    }
}
