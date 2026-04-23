package com.zoo.pricing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceBreakdownResponse {
    private Double adultPrice;
    private Integer adultCount;
    private Double adultSubtotal;
    private Double childPrice;
    private Integer childCount;
    private Double childSubtotal;
    private Double totalAmount;
}
