package com.zoo.pricing.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "${app.services.inventory.name:inventory-service}")
public interface InventoryClient {

    @GetMapping("/api/slots/{id}")
    SlotResponse getSlotById(@PathVariable("id") Long id);

    @lombok.Data
    public static class SlotResponse {
        private Long id;
        private Integer totalCapacity;
        private Integer availableCapacity;
    }
}
