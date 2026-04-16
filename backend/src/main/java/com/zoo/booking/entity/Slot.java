package com.zoo.booking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "slots")
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate slotDate;
    
    private LocalTime startTime;
    
    private LocalTime endTime;

    private Integer totalCapacity;
    
    private Integer availableCapacity;

    private Boolean isActive = true;
}
