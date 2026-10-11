package com.worthit.controller;

import com.worthit.dto.DashboardDTO;
import com.worthit.service.AuthService;
import com.worthit.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthService authService;

    public DashboardController(DashboardService dashboardService, AuthService authService) {
        this.dashboardService = dashboardService;
        this.authService = authService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardDTO.SummaryResponse> getSummary() {
        Long userId = authService.getCurrentUserId();
        return ResponseEntity.ok(dashboardService.getSummary(userId));
    }
}
