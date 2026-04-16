package com.zoo.booking.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "slot_pricing")
public class SlotPricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    private Slot slot;

    @Column(nullable = false)
    private String ticketType; // ADULT, CHILD

    @Column(nullable = false)
    private Double price;

    private Boolean isActive = true;
}

