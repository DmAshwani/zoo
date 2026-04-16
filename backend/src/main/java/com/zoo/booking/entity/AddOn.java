package com.zoo.booking.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "add_on_master")
public class AddOn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Camera, Safari

    @Column(nullable = false)
    private String type; // PER_BOOKING or PER_PERSON

    @Column(nullable = false)
    private Double price;

    private Integer maxLimitPerBooking; // Max quantity per booking

    private Integer availableCapacity; // Total available (null = unlimited)

    private Integer bookedCapacity = 0; // Currently booked

    private Boolean isActive = true;
}

