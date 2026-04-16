package com.zoo.booking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "booking_audit")
public class BookingAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(columnDefinition = "TEXT")
    private String requestPayload;

    @Column(columnDefinition = "TEXT")
    private String priceBreakdown;

    @Column(columnDefinition = "TEXT")
    private String paymentResponse;

    private String status; // CREATED, PAYMENT_INITIATED, PAYMENT_SUCCESS, PAYMENT_FAILED, EXPIRED

    private String errorMessage;

    private LocalDateTime createdAt = LocalDateTime.now();
}

