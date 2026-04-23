package com.zoo.booking.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    private Long id;
    private Long userId;
    private Long slotId;
    private String status;
    private Double totalAmount;
    private Integer adultTickets;
    private Integer childTickets;
    private String guestFullName;
    private String guestEmail;
    private String guestMobileNumber;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String pdfUrl;
    private LocalDateTime expiryTime;
}
