package com.zoo.booking.repository;

import com.zoo.booking.entity.SlotPricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SlotPricingRepository extends JpaRepository<SlotPricing, Long> {
    Optional<SlotPricing> findBySlotIdAndTicketType(Long slotId, String ticketType);
    List<SlotPricing> findBySlotId(Long slotId);
}

