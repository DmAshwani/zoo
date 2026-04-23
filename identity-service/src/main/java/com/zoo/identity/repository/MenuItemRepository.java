package com.zoo.identity.repository;

import com.zoo.identity.dto.MenuResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public class MenuItemRepository {

    @Autowired
    private NamedParameterJdbcTemplate jdbcTemplate;

    public List<MenuResponse> findAllowedMenus(Set<String> permissions) {
        String sql = "SELECT DISTINCT m.* FROM menu_items m " +
                     "JOIN permission_menus pm ON m.id = pm.menu_item_id " +
                     "JOIN permissions p ON pm.permission_id = p.id " +
                     "WHERE p.code IN (:permissions) AND m.is_active = TRUE " +
                     "ORDER BY m.sequence ASC";
        
        MapSqlParameterSource params = new MapSqlParameterSource("permissions", permissions);

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> MenuResponse.builder()
                .id(rs.getLong("id"))
                .label(rs.getString("label"))
                .path(rs.getString("path"))
                .icon(rs.getString("icon"))
                .parentId(rs.getLong("parent_id"))
                .sequence(rs.getInt("sequence"))
                .build());
    }
}
