package com.worthit.controller;

import com.worthit.dto.WarrantyDTO;
import com.worthit.service.AuthService;
import com.worthit.service.WarrantyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/warranties")
public class WarrantyController {

    private final WarrantyService warrantyService;
    private final AuthService authService;

    public WarrantyController(WarrantyService warrantyService, AuthService authService) {
        this.warrantyService = warrantyService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<WarrantyDTO.WarrantyResponse>> getAllWarranties() {
        Long userId = authService.getCurrentUserId();
        return ResponseEntity.ok(warrantyService.getAllWarrantiesForUser(userId));
    }

    @GetMapping("/expiring")
    public ResponseEntity<List<WarrantyDTO.WarrantyResponse>> getExpiringWarranties(
            @RequestParam(defaultValue = "30") int days) {
        Long userId = authService.getCurrentUserId();
        return ResponseEntity.ok(warrantyService.getExpiringSoonWarranties(userId, days));
    }
}
