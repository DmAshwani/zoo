package com.zoo.pricing.dto;

import lombok.Data;

@Data
public class PricingRequest {
    private Long slotId;
    private Integer adultTickets;
    private Integer childTickets;
}
