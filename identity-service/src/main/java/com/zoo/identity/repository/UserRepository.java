package com.zoo.identity.repository;

import com.zoo.identity.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public class UserRepository {

    @Autowired
    private NamedParameterJdbcTemplate jdbcTemplate;

    public Optional<User> findByUsername(String username) {
        String sql = "SELECT * FROM users WHERE username = :username";
        MapSqlParameterSource params = new MapSqlParameterSource("username", username);

        List<User> users = jdbcTemplate.query(sql, params, (rs, rowNum) -> User.builder()
                .id(rs.getLong("id"))
                .username(rs.getString("username"))
                .password(rs.getString("password"))
                .fullName(rs.getString("full_name"))
                .email(rs.getString("email"))
                .isEnabled(rs.getBoolean("is_enabled"))
                .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                .build());

        if (users.isEmpty()) {
            return Optional.empty();
        }

        User user = users.get(0);
        user.setRoles(fetchRoles(user.getId()));
        user.setPermissions(fetchPermissions(user.getId()));
        
        return Optional.of(user);
    }

    private Set<String> fetchRoles(Long userId) {
        String sql = "SELECT r.name FROM roles r " +
                     "JOIN user_roles ur ON r.id = ur.role_id " +
                     "WHERE ur.user_id = :userId";
        MapSqlParameterSource params = new MapSqlParameterSource("userId", userId);
        return new HashSet<>(jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getString("name")));
    }

    private Set<String> fetchPermissions(Long userId) {
        String sql = "SELECT DISTINCT p.code FROM permissions p " +
                     "JOIN role_permissions rp ON p.id = rp.permission_id " +
                     "JOIN user_roles ur ON rp.role_id = ur.role_id " +
                     "WHERE ur.user_id = :userId";
        MapSqlParameterSource params = new MapSqlParameterSource("userId", userId);
        return new HashSet<>(jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getString("code")));
    }

    public void save(User user) {
        String sql = "INSERT INTO users (username, password, full_name, email) " +
                     "VALUES (:username, :password, :fullName, :email)";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("username", user.getUsername())
                .addValue("password", user.getPassword())
                .addValue("fullName", user.getFullName())
                .addValue("email", user.getEmail());
        
        jdbcTemplate.update(sql, params);
    }
}
