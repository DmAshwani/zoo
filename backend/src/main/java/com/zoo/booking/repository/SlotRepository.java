package com.zoo.booking.repository;

import com.zoo.booking.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {
    List<Slot> findBySlotDateAndIsActiveTrue(LocalDate date);
}
