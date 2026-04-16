package com.zoo.booking.repository;

import com.zoo.booking.entity.Booking;
import com.zoo.booking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    Optional<Booking> findByRazorpayOrderId(String orderId);

    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING' AND b.expiryTime < ?1")
    List<Booking> findExpiredPendingBookings(LocalDateTime currentTime);
}
