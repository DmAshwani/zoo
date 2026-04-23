package com.zoo.inventory.repository;

import com.zoo.inventory.entity.Slot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public class SlotRepository {

    @Autowired
    private NamedParameterJdbcTemplate jdbcTemplate;

    public List<Slot> findByDateAndIsActive(LocalDate date) {
        String sql = "SELECT * FROM slots WHERE slot_date = :date AND is_active = TRUE ORDER BY start_time";
        MapSqlParameterSource params = new MapSqlParameterSource("date", date);
        return jdbcTemplate.query(sql, params, (rs, rowNum) -> mapRowToSlot(rs));
    }

    public Optional<Slot> findById(Long id) {
        String sql = "SELECT * FROM slots WHERE id = :id";
        MapSqlParameterSource params = new MapSqlParameterSource("id", id);
        List<Slot> slots = jdbcTemplate.query(sql, params, (rs, rowNum) -> mapRowToSlot(rs));
        return slots.stream().findFirst();
    }

    public void updateCapacity(Long slotId, int count) {
        String sql = "UPDATE slots SET available_capacity = available_capacity + :count " +
                     "WHERE id = :id AND available_capacity + :count >= 0";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", slotId)
                .addValue("count", count);
        
        int updated = jdbcTemplate.update(sql, params);
        if (updated == 0) {
            throw new RuntimeException("Insufficient capacity or invalid slot ID");
        }
    }

    public Slot save(Slot slot) {
        if (slot.getId() == null) {
            String sql = "INSERT INTO slots (slot_date, start_time, end_time, total_capacity, available_capacity, is_active) " +
                         "VALUES (:slotDate, :startTime, :endTime, :totalCapacity, :availableCapacity, :isActive) RETURNING id";
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("slotDate", slot.getSlotDate())
                    .addValue("startTime", slot.getStartTime())
                    .addValue("endTime", slot.getEndTime())
                    .addValue("totalCapacity", slot.getTotalCapacity())
                    .addValue("availableCapacity", slot.getAvailableCapacity())
                    .addValue("isActive", slot.getIsActive());
            
            Long id = jdbcTemplate.queryForObject(sql, params, Long.class);
            slot.setId(id);
        } else {
            String sql = "UPDATE slots SET total_capacity = :totalCapacity, is_active = :isActive, updated_at = NOW() WHERE id = :id";
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("id", slot.getId())
                    .addValue("totalCapacity", slot.getTotalCapacity())
                    .addValue("isActive", slot.getIsActive());
            jdbcTemplate.update(sql, params);
        }
        return slot;
    }

    private Slot mapRowToSlot(java.sql.ResultSet rs) throws java.sql.SQLException {
        return Slot.builder()
                .id(rs.getLong("id"))
                .slotDate(rs.getObject("slot_date", LocalDate.class))
                .startTime(rs.getObject("start_time", LocalTime.class))
                .endTime(rs.getObject("end_time", LocalTime.class))
                .totalCapacity(rs.getInt("total_capacity"))
                .availableCapacity(rs.getInt("available_capacity"))
                .isActive(rs.getBoolean("is_active"))
                .build();
    }
}
