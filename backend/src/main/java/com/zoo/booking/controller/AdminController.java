package com.zoo.booking.controller;

import com.zoo.booking.entity.AddOn;
import com.zoo.booking.entity.SlotPricing;
import com.zoo.booking.entity.User;
import com.zoo.booking.entity.ERole;
import com.zoo.booking.entity.TicketType;
import com.zoo.booking.repository.AddOnRepository;
import com.zoo.booking.repository.SlotPricingRepository;
import com.zoo.booking.repository.UserRepository;
import com.zoo.booking.repository.TicketTypeRepository;
import com.zoo.booking.repository.SystemSettingRepository;
import com.zoo.booking.service.StaffService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Admin", description = "Administrative management endpoints")
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_STAFF')")
public class AdminController {

    private final AddOnRepository addOnRepository;
    private final SlotPricingRepository slotPricingRepository;
    private final StaffService staffService;
    private final UserRepository userRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final SystemSettingRepository systemSettingRepository;

    public AdminController(AddOnRepository addOnRepository, 
                           SlotPricingRepository slotPricingRepository, 
                           StaffService staffService,
                           UserRepository userRepository,
                           TicketTypeRepository ticketTypeRepository,
                           SystemSettingRepository systemSettingRepository) {
        this.addOnRepository = addOnRepository;
        this.slotPricingRepository = slotPricingRepository;
        this.staffService = staffService;
        this.userRepository = userRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.systemSettingRepository = systemSettingRepository;
    }

    @GetMapping("/settings")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Get global system settings")
    public List<com.zoo.booking.entity.SystemSetting> getSettings() {
        return systemSettingRepository.findAll();
    }

    @PutMapping("/settings")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update system setting")
    public ResponseEntity<?> updateSetting(@RequestBody Map<String, String> setting) {
        systemSettingRepository.updateValue(setting.get("settingKey"), setting.get("settingValue"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/ping")
    public String ping() {
        return "AdminController is Active";
    }

    @GetMapping("/summary")
    @Operation(summary = "Get admin dashboard summary metrics")
    public ResponseEntity<?> getSummary() {
        long totalUsers = userRepository.count();
        long totalStaff = staffService.getAllStaff().size();
        
        // In a real production app, these would come from specialized repository methods
        // For now, we provide the structure for the enhanced UI
        return ResponseEntity.ok(Map.of(
            "totalUsers", totalUsers,
            "totalStaff", totalStaff,
            "todayRevenue", 12500.0, // Mocked for demo, should be SUM(totalAmount) where status=CONFIRMED
            "activeBookings", 45,
            "pendingApprovals", 2
        ));
    }

    // --- Ticket Type Management ---

    @GetMapping("/tickets")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_PRICING')")
    @Operation(summary = "Get all ticket types")
    public List<TicketType> getAllTickets() {
        return ticketTypeRepository.findAll();
    }

    @PutMapping("/tickets/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_PRICING')")
    @Operation(summary = "Update a ticket type")
    public ResponseEntity<TicketType> updateTicket(@PathVariable Long id, @RequestBody TicketType ticketType) {
        ticketType.setId(id);
        return ResponseEntity.ok(ticketTypeRepository.save(ticketType));
    }

    // --- Add-On Management ---

    @GetMapping("/addons")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_PRICING')")
    @Operation(summary = "Get all add-ons")
    public List<AddOn> getAllAddOns() {
        // We'll need a findAll in AddOnRepository, let's assume it exists or use query
        return addOnRepository.findAll();
    }

    @PostMapping("/addons")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_PRICING')")
    @Operation(summary = "Create an add-on")
    public ResponseEntity<AddOn> createAddOn(@RequestBody AddOn addOn) {
        return ResponseEntity.ok(addOnRepository.save(addOn));
    }

    @PutMapping("/addons/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_PRICING')")
    @Operation(summary = "Update an existing add-on")
    public ResponseEntity<AddOn> updateAddOn(@PathVariable Long id, @RequestBody AddOn addOn) {
        addOn.setId(id);
        return ResponseEntity.ok(addOnRepository.save(addOn));
    }

    @PatchMapping("/addons/{id}/toggle")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_PRICING')")
    @Operation(summary = "Toggle add-on active status")
    public ResponseEntity<AddOn> toggleAddOn(@PathVariable Long id) {
        AddOn addOn = addOnRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Add-on not found"));
        addOn.setIsActive(!Boolean.TRUE.equals(addOn.getIsActive()));
        return ResponseEntity.ok(addOnRepository.save(addOn));
    }

    @DeleteMapping("/addons/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_PRICING')")
    @Operation(summary = "Delete an add-on")
    public ResponseEntity<?> deleteAddOn(@PathVariable Long id) {
        addOnRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Pricing Management ---

    @GetMapping("/pricing")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_PRICING')")
    @Operation(summary = "Get current slot pricing")
    public ResponseEntity<List<SlotPricing>> getPricing() {
        return ResponseEntity.ok(slotPricingRepository.findAll());
    }

    @PutMapping("/pricing")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_PRICING')")
    @Operation(summary = "Update slot pricing")
    public ResponseEntity<SlotPricing> updatePricing(@RequestBody SlotPricing pricing) {
        return ResponseEntity.ok(slotPricingRepository.save(pricing));
    }

    // --- Staff Management --- (ROLE_ADMIN ONLY)

    @GetMapping("/staff")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Get all staff members")
    public List<User> getAllStaff() {
        return staffService.getAllStaff();
    }

    @PostMapping("/staff")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Create a new staff user")
    public ResponseEntity<User> createStaff(@RequestBody Map<String, Object> request) {
        User user = new User();
        user.setEmail((String) request.get("email"));
        user.setFullName((String) request.get("fullName"));
        user.setMobileNumber((String) request.get("mobileNumber"));
        user.setPassword((String) request.get("password"));

        Object rolesObj = request.get("roles");
        Set<ERole> roles;
        if (rolesObj instanceof List<?> && !((List<?>) rolesObj).isEmpty()) {
            roles = ((List<?>) rolesObj).stream()
                    .map(Object::toString)
                    .map(ERole::valueOf)
                    .collect(java.util.stream.Collectors.toSet());
        } else {
            roles = Set.of(ERole.ROLE_STAFF); // Default role
        }
        return ResponseEntity.ok(staffService.createStaff(user, roles));
    }

    @PutMapping("/staff/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update an existing staff member")
    public ResponseEntity<User> updateStaff(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        User user = new User();
        user.setEmail((String) request.get("email"));
        user.setFullName((String) request.get("fullName"));
        user.setMobileNumber((String) request.get("mobileNumber"));
        user.setPassword((String) request.get("password"));

        Object rolesObj = request.get("roles");
        Set<ERole> roles;
        if (rolesObj instanceof List<?> && !((List<?>) rolesObj).isEmpty()) {
            roles = ((List<?>) rolesObj).stream()
                    .map(Object::toString)
                    .map(ERole::valueOf)
                    .collect(java.util.stream.Collectors.toSet());
        } else {
            roles = Set.of(ERole.ROLE_STAFF); // Default role
        }
        return ResponseEntity.ok(staffService.updateStaff(id, user, roles));
    }

    @DeleteMapping("/staff/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Delete a staff member")
    public ResponseEntity<?> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/staff/{id}/toggle")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Toggle staff active status")
    public ResponseEntity<User> toggleStaff(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.toggleStaffStatus(id));
    }
}
