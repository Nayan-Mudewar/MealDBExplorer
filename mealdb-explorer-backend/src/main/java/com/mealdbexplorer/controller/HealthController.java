package com.mealdbexplorer.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<HealthResponse> health() {
        HealthResponse response = new HealthResponse(
                "UP",
                "MealDB Explorer API",
                "1.0.0",
                LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @Data
    @AllArgsConstructor
    static class HealthResponse {
        private String status;
        private String service;
        private String version;
        private LocalDateTime timestamp;
    }
}