package com.zoo.booking.repository;

import com.zoo.booking.entity.BookingAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingAuditRepository extends JpaRepository<BookingAudit, Long> {
    List<BookingAudit> findByBookingId(Long bookingId);
}

