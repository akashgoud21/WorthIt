package com.worthit.controller;

import com.worthit.dto.RepairDTO;
import com.worthit.service.AuthService;
import com.worthit.service.RepairService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repairs")
public class RepairController {

    private final RepairService repairService;
    private final AuthService authService;

    public RepairController(RepairService repairService, AuthService authService) {
        this.repairService = repairService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<RepairDTO.RepairResponse> logRepair(@Valid @RequestBody RepairDTO.RepairRequest request) {
        Long userId = authService.getCurrentUserId();
        RepairDTO.RepairResponse response = repairService.logRepair(request, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user")
    public ResponseEntity<List<RepairDTO.RepairResponse>> getAllUserRepairs() {
        Long userId = authService.getCurrentUserId();
        return ResponseEntity.ok(repairService.getAllRepairsForUser(userId));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<RepairDTO.RepairResponse>> getRepairsByProduct(@PathVariable Long productId) {
        Long userId = authService.getCurrentUserId();
        return ResponseEntity.ok(repairService.getRepairsByProductId(productId, userId));
    }

    @GetMapping(value = {"/{productId}/analytics", "/product/{productId}/analytics"})
    public ResponseEntity<RepairDTO.RepairAnalyticsResponse> getRepairAnalytics(@PathVariable Long productId) {
        Long userId = authService.getCurrentUserId();
        return ResponseEntity.ok(repairService.getRepairAnalytics(productId, userId));
    }
}
