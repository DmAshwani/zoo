package com.zoo.booking.repository;

import com.zoo.booking.entity.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;

@Repository
public class BookingRepository {

    @Autowired
    private NamedParameterJdbcTemplate jdbcTemplate;

    public Booking save(Booking booking) {
        if (booking.getId() == null) {
            String sql = "INSERT INTO bookings (user_id, slot_id, status, total_amount, adult_tickets, child_tickets, " +
                         "guest_full_name, guest_email, guest_mobile_number, expiry_time) " +
                         "VALUES (:userId, :slotId, :status, :totalAmount, :adultTickets, :childTickets, " +
                         ":guestFullName, :guestEmail, :guestMobileNumber, :expiryTime) RETURNING id";
            
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("userId", booking.getUserId())
                    .addValue("slotId", booking.getSlotId())
                    .addValue("status", booking.getStatus())
                    .addValue("totalAmount", booking.getTotalAmount())
                    .addValue("adultTickets", booking.getAdultTickets())
                    .addValue("childTickets", booking.getChildTickets())
                    .addValue("guestFullName", booking.getGuestFullName())
                    .addValue("guestEmail", booking.getGuestEmail())
                    .addValue("guestMobileNumber", booking.getGuestMobileNumber())
                    .addValue("expiryTime", booking.getExpiryTime());
            
            Long id = jdbcTemplate.queryForObject(sql, params, Long.class);
            booking.setId(id);
        } else {
            String sql = "UPDATE bookings SET status = :status, razorpay_order_id = :orderId, " +
                         "razorpay_payment_id = :paymentId, pdf_url = :pdfUrl, updated_at = NOW() WHERE id = :id";
            
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("id", booking.getId())
                    .addValue("status", booking.getStatus())
                    .addValue("orderId", booking.getRazorpayOrderId())
                    .addValue("paymentId", booking.getRazorpayPaymentId())
                    .addValue("pdfUrl", booking.getPdfUrl());
            
            jdbcTemplate.update(sql, params);
        }
        return booking;
    }

    private Booking mapRow(ResultSet rs, int rowNum) throws SQLException {
        return Booking.builder()
                .id(rs.getLong("id"))
                .userId(rs.getLong("user_id"))
                .slotId(rs.getLong("slot_id"))
                .status(rs.getString("status"))
                .totalAmount(rs.getDouble("total_amount"))
                .adultTickets(rs.getInt("adult_tickets"))
                .childTickets(rs.getInt("child_tickets"))
                .guestFullName(rs.getString("guest_full_name"))
                .guestEmail(rs.getString("guest_email"))
                .guestMobileNumber(rs.getString("guest_mobile_number"))
                .razorpayOrderId(rs.getString("razorpay_order_id"))
                .razorpayPaymentId(rs.getString("razorpay_payment_id"))
                .pdfUrl(rs.getString("pdf_url"))
                .expiryTime(rs.getObject("expiry_time", LocalDateTime.class))
                .build();
    }
}
