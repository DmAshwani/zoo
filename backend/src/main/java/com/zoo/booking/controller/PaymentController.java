package com.zoo.booking.controller;

import com.zoo.booking.entity.Booking;
import com.zoo.booking.payload.response.MessageResponse;
import com.zoo.booking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Payment webhook and verification endpoints")
public class PaymentController {

    @Autowired
    private BookingService bookingService;

    /**
     * Webhook handler for Razorpay payment success callback.
     * This is the ONLY source of truth for payment success.
     */
    @PostMapping("/webhook/razorpay")
    @Operation(summary = "Razorpay Payment Webhook", description = "Webhook endpoint for Razorpay payment callbacks")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Webhook processed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid webhook payload"),
        @ApiResponse(responseCode = "500", description = "Error processing webhook")
    })
    public ResponseEntity<?> handleRazorpayWebhook(@RequestBody RazorpayWebhookPayload payload) {
        log.info("Received Razorpay webhook: orderId={}, paymentId={}",
                payload.getOrderId(), payload.getPaymentId());

        try {
            // Verify webhook signature (in production, verify with Razorpay public key)
            if (!verifyWebhookSignature(payload)) {
                log.warn("Webhook signature verification failed");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("Invalid webhook signature"));
            }

            // Find booking by order ID
            // Note: Using a custom query method that should be added to BookingRepository
            // For now, we'll implement a basic version

            if ("PAYMENT_SUCCESS".equals(payload.getStatus())) {
                // Confirm booking
                log.info("Processing payment success for order: {}", payload.getOrderId());
                // This should extract booking ID from order ID format: order_{bookingId}_{timestamp}
                Long bookingId = extractBookingIdFromOrderId(payload.getOrderId());
                Booking booking = bookingService.confirmBooking(bookingId, payload.getPaymentId());
                return ResponseEntity.ok(new MessageResponse("Booking confirmed successfully"));
            } else if ("PAYMENT_FAILED".equals(payload.getStatus())) {
                log.warn("Processing payment failure for order: {}", payload.getOrderId());
                Long bookingId = extractBookingIdFromOrderId(payload.getOrderId());
                bookingService.failBooking(bookingId, "PAYMENT_FAILED_" + payload.getFailureReason());
                return ResponseEntity.ok(new MessageResponse("Booking marked as failed"));
            }

            return ResponseEntity.ok(new MessageResponse("Webhook processed"));
        } catch (Exception e) {
            log.error("Error processing Razorpay webhook", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error processing webhook: " + e.getMessage()));
        }
    }

    /**
     * Verify webhook signature with Razorpay.
     * In production, this should verify using Razorpay's webhook secret.
     */
    private boolean verifyWebhookSignature(RazorpayWebhookPayload payload) {
        // TODO: Implement proper signature verification
        // For now, accept all valid payloads
        return payload.getOrderId() != null && payload.getPaymentId() != null;
    }

    /**
     * Extract booking ID from order ID.
     * Order ID format: order_{bookingId}_{timestamp}
     */
    private Long extractBookingIdFromOrderId(String orderId) {
        try {
            String[] parts = orderId.split("_");
            if (parts.length >= 2) {
                return Long.parseLong(parts[1]);
            }
        } catch (Exception e) {
            log.error("Error extracting booking ID from order: {}", orderId, e);
        }
        throw new RuntimeException("Invalid order ID format");
    }

    /**
     * Webhook payload from Razorpay.
     */
    @lombok.Data
    public static class RazorpayWebhookPayload {
        private String orderId;
        private String paymentId;
        private String status;
        private String failureReason;
    }
}

