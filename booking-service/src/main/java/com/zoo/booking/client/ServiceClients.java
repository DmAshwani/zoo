package com.zoo.booking.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// 1. Inventory Client
@FeignClient(name = "${app.services.inventory.name:inventory-service}")
public interface InventoryClient {
    @PostMapping("/api/slots/{id}/reduce-capacity")
    void reduceCapacity(@PathVariable("id") Long id, @RequestParam("count") int count);
}

// 2. Pricing Client
@FeignClient(name = "${app.services.pricing.name:pricing-service}")
public interface PricingClient {
    @PostMapping("/api/pricing/calculate")
    PriceBreakdownResponse calculatePrice(@RequestBody PricingRequest request);

    @lombok.Data
    @lombok.Builder
    public static class PricingRequest {
        private Long slotId;
        private Integer adultTickets;
        private Integer childTickets;
    }

    @lombok.Data
    public static class PriceBreakdownResponse {
        private Double totalAmount;
        private Double adultPrice;
        private Double childPrice;
    }
}

// 3. Identity Client
@FeignClient(name = "${app.services.identity.name:identity-service}")
public interface IdentityClient {
    @GetMapping("/api/users/me")
    UserResponse getCurrentUser(@RequestHeader("Authorization") String token);

    @lombok.Data
    public static class UserResponse {
        private Long id;
        private String email;
    }
}

// 4. Notification Client
@FeignClient(name = "${app.services.notification.name:notification-service}")
public interface NotificationClient {
    @PostMapping("/api/notifications/send-ticket")
    void sendTicket(@RequestBody NotificationRequest request);

    @lombok.Data
    @lombok.Builder
    public static class NotificationRequest {
        private String bookingId;
        private String guestEmail;
        private String guestName;
        private Double amount;
    }
}
