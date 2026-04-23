package com.zoo.booking.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Long slotId;
    private Integer adultTickets;
    private Integer childTickets;
    private String guestFullName;
    private String guestEmail;
    private String guestMobileNumber;
}
