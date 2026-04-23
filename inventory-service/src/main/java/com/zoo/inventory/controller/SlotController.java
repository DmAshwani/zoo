package com.zoo.inventory.controller;

import com.zoo.inventory.entity.Slot;
import com.zoo.inventory.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
@CrossOrigin(origins = "*")
public class SlotController {

    @Autowired
    private SlotRepository slotRepository;

    @GetMapping("/available")
    public ResponseEntity<List<Slot>> getAvailableSlots(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(slotRepository.findByDateAndIsActive(date));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Slot> createSlot(@RequestBody Slot slot) {
        if (slot.getAvailableCapacity() == null) {
            slot.setAvailableCapacity(slot.getTotalCapacity());
        }
        return ResponseEntity.ok(slotRepository.save(slot));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Slot> updateSlot(@PathVariable Long id, @RequestBody Slot slot) {
        slot.setId(id);
        return ResponseEntity.ok(slotRepository.save(slot));
    }

    @PostMapping("/{id}/reduce-capacity")
    public ResponseEntity<Void> reduceCapacity(@PathVariable Long id, @RequestParam int count) {
        slotRepository.updateCapacity(id, -count);
        return ResponseEntity.ok().build();
    }
}
