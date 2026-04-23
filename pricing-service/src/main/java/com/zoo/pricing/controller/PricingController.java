package com.zoo.pricing.controller;

import com.zoo.pricing.dto.PriceBreakdownResponse;
import com.zoo.pricing.dto.PricingRequest;
import com.zoo.pricing.service.PricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pricing")
@CrossOrigin(origins = "*")
public class PricingController {

    @Autowired
    private PricingService pricingService;

    @GetMapping("/resolve/{slotId}")
    public ResponseEntity<Map<String, Double>> resolvePrices(@PathVariable Long slotId) {
        return ResponseEntity.ok(pricingService.resolvePricesForSlot(slotId));
    }

    @PostMapping("/calculate")
    public ResponseEntity<PriceBreakdownResponse> calculatePrice(@RequestBody PricingRequest request) {
        return ResponseEntity.ok(pricingService.calculatePriceBreakdown(request));
    }
}
