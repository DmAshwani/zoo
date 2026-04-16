package com.zoo.booking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id")
    private Slot slot;

    private Integer adultTickets;
    
    private Integer childTickets;
    
    private Integer addOnCamera;
    
    private Integer addOnSafari;

    private Double totalAmount;

    // e.g. PENDING, CONFIRMED, FAILED
    private String status;

    private String razorpayOrderId;
    
    private String razorpayPaymentId;

    private String qrCodeUrl;
    private String pdfUrl;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Capacity management fields
    private Integer bookedAdults = 0;
    private Integer bookedChildren = 0;
    private Integer bookedAddOnCamera = 0;
    private Integer bookedAddOnSafari = 0;

    // Expiry for pending bookings
    private LocalDateTime expiryTime;
}
