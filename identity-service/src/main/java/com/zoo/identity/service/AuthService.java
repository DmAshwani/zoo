package com.zoo.identity.service;

import com.zoo.identity.dto.LoginRequest;
import com.zoo.identity.dto.LoginResponse;
import com.zoo.identity.dto.MenuResponse;
import com.zoo.identity.entity.User;
import com.zoo.identity.repository.MenuItemRepository;
import com.zoo.identity.repository.UserRepository;
import com.zoo.identity.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public LoginResponse authenticate(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        String token = jwtUtils.generateToken(user.getUsername(), user.getRoles(), user.getPermissions());

        List<MenuResponse> menus = buildMenuTree(user.getPermissions());

        return LoginResponse.builder()
                .token(token)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .roles(user.getRoles())
                .permissions(user.getPermissions())
                .menus(menus)
                .build();
    }

    private List<MenuResponse> buildMenuTree(java.util.Set<String> permissions) {
        List<MenuResponse> allAllowed = menuItemRepository.findAllowedMenus(permissions);
        
        Map<Long, MenuResponse> menuMap = allAllowed.stream()
                .collect(Collectors.toMap(MenuResponse::getId, m -> m));

        List<MenuResponse> rootMenus = new ArrayList<>();

        for (MenuResponse menu : allAllowed) {
            if (menu.getParentId() == null || menu.getParentId() == 0) {
                rootMenus.add(menu);
            } else {
                MenuResponse parent = menuMap.get(menu.getParentId());
                if (parent != null) {
                    if (parent.getChildren() == null) {
                        parent.setChildren(new ArrayList<>());
                    }
                    parent.getChildren().add(menu);
                }
            }
        }

        return rootMenus;
    }
}
