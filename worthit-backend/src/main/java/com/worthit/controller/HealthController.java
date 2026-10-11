package com.worthit.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * HealthController — Session 1 test endpoint
 *
 * Purpose: Verify that the Spring Boot backend started correctly
 *          and can respond to HTTP requests.
 *
 * Test URL: GET http://localhost:8080/api/health
 *
 * This controller will be kept as a simple health check even after
 * more controllers are added in Sessions 2–5.
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("application", "WorthIt Backend");
        response.put("version", "1.0.0");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("message", "Backend is running! MySQL tables created by Hibernate.");
        return ResponseEntity.ok(response);
    }
}
