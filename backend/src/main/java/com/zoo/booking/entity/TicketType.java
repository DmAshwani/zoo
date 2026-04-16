package com.zoo.booking.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ticket_types")
public class TicketType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name; // ADULT, CHILD

    private Double defaultPrice;

    private String description;

    private Boolean isActive = true;
}

