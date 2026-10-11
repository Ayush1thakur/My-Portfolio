package com.portfolio.controller;

import com.portfolio.model.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final DataSource dataSource;

    @Value("${neon.project.id:green-lab-52718513}")
    private String neonProjectId;

    @Value("${neon.project.branch:production}")
    private String neonBranch;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("framework", "Spring Boot 3.4.3");

        boolean dbConnected = false;
        String dbProduct = "Unknown";
        try (Connection connection = dataSource.getConnection()) {
            dbConnected = !connection.isClosed();
            dbProduct = connection.getMetaData().getDatabaseProductName();
        } catch (Exception e) {
            dbProduct = "Connection error: " + e.getMessage();
        }

        healthInfo.put("databaseConnected", dbConnected);
        healthInfo.put("databaseDetails", dbProduct);
        healthInfo.put("neonProjectId", neonProjectId);
        healthInfo.put("neonBranch", neonBranch);

        return ResponseEntity.ok(ApiResponse.ok("Backend and Database are operational", healthInfo));
    }
}
