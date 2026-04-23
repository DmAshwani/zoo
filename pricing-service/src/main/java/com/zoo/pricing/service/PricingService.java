package com.zoo.pricing.service;

import com.zoo.pricing.client.InventoryClient;
import com.zoo.pricing.dto.PriceBreakdownResponse;
import com.zoo.pricing.dto.PricingRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PricingService {

    @Autowired
    private NamedParameterJdbcTemplate jdbcTemplate;

    @Autowired
    private InventoryClient inventoryClient;

    public Map<String, Double> resolvePricesForSlot(Long slotId) {
        Map<String, Double> finalPrices = new HashMap<>();

        // 1. Get Default Prices
        String sqlDefaults = "SELECT name, default_price FROM ticket_types WHERE is_active = TRUE";
        jdbcTemplate.query(sqlDefaults, (rs, rowNum) -> {
            finalPrices.put(rs.getString("name"), rs.getDouble("default_price"));
            return null;
        });

        // Fallbacks
        if (!finalPrices.containsKey("ADULT")) finalPrices.put("ADULT", 800.0);
        if (!finalPrices.containsKey("CHILD")) finalPrices.put("CHILD", 500.0);

        // 2. Apply Manual Overrides
        if (slotId != null && getSetting("manual_overrides_enabled", "true").equalsIgnoreCase("true")) {
            String sqlOverrides = "SELECT ticket_type, price FROM slot_pricing WHERE slot_id = :slotId AND is_active = TRUE";
            jdbcTemplate.query(sqlOverrides, new MapSqlParameterSource("slotId", slotId), (rs, rowNum) -> {
                finalPrices.put(rs.getString("ticket_type"), rs.getDouble("price"));
                return null;
            });
        }

        // 3. Apply Automatic Surge
        if (slotId != null && getSetting("dynamic_pricing_enabled", "true").equalsIgnoreCase("true")) {
            try {
                InventoryClient.SlotResponse slot = inventoryClient.getSlotById(slotId);
                int threshold = Integer.parseInt(getSetting("surge_threshold_percent", "90"));
                double multiplier = Double.parseDouble(getSetting("surge_multiplier", "1.5"));

                int total = slot.getTotalCapacity();
                int booked = total - slot.getAvailableCapacity();

                if (total > 0 && ((double) booked / total) * 100 >= threshold) {
                    for (String type : finalPrices.keySet()) {
                        finalPrices.put(type, finalPrices.get(type) * multiplier);
                    }
                }
            } catch (Exception e) {
                // Log error and fallback to current prices
            }
        }

        return finalPrices;
    }

    public PriceBreakdownResponse calculatePriceBreakdown(PricingRequest request) {
        Map<String, Double> prices = resolvePricesForSlot(request.getSlotId());

        Double adultBase = prices.getOrDefault("ADULT", 800.0);
        Double childBase = prices.getOrDefault("CHILD", 500.0);

        int adults = request.getAdultTickets() != null ? request.getAdultTickets() : 0;
        int children = request.getChildTickets() != null ? request.getChildTickets() : 0;

        Double adultSubtotal = adultBase * adults;
        Double childSubtotal = childBase * children;

        // Conservation levy or other fees
        Double total = adultSubtotal + childSubtotal + 100.0;

        return PriceBreakdownResponse.builder()
                .adultPrice(adultBase)
                .adultCount(adults)
                .adultSubtotal(adultSubtotal)
                .childPrice(childBase)
                .childCount(children)
                .childSubtotal(childSubtotal)
                .totalAmount(total)
                .build();
    }

    private String getSetting(String key, String defaultValue) {
        String sql = "SELECT value FROM system_settings WHERE key = :key";
        try {
            return jdbcTemplate.queryForObject(sql, new MapSqlParameterSource("key", key), String.class);
        } catch (Exception e) {
            return defaultValue;
        }
    }
}
