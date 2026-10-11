package com.portfolio.controller;

import com.portfolio.model.*;
import com.portfolio.service.AuthService;
import com.portfolio.service.PortfolioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final PortfolioService portfolioService;
    private final AuthService authService;

    public AdminController(PortfolioService portfolioService, AuthService authService) {
        this.portfolioService = portfolioService;
        this.authService = authService;
    }

    private boolean isAuthorized(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;
        String token = authHeader.substring(7).trim();
        return authService.validateAdminToken(token);
    }

    // 1. Update Profile (Name, Title, Company, College, Phone, Email, Bio, Resume)
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<PersonalInfo>> updateProfile(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody PersonalInfo profile) {
        if (!isAuthorized(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin credentials required."));
        }
        PersonalInfo updated = portfolioService.updatePersonalInfo(profile);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    // 2. Create Personal Project
    @PostMapping("/projects")
    public ResponseEntity<ApiResponse<Project>> createProject(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Project project) {
        if (!isAuthorized(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin credentials required."));
        }
        Project saved = portfolioService.saveProject(project);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Project created successfully", saved));
    }

    // 3. Update Personal Project
    @PutMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Project>> updateProject(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id,
            @RequestBody Project project) {
        if (!isAuthorized(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin credentials required."));
        }
        try {
            Project updated = portfolioService.updateProject(id, project);
            return ResponseEntity.ok(ApiResponse.ok("Project updated successfully", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 4. Delete Personal Project
    @DeleteMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProject(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id) {
        if (!isAuthorized(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin credentials required."));
        }
        portfolioService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.ok("Project deleted successfully", "Deleted ID: " + id));
    }

    // 5. Add Company SubProject
    @PostMapping("/subprojects")
    public ResponseEntity<ApiResponse<SubProject>> addSubProject(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(required = false) Long experienceId,
            @RequestBody SubProject subProject) {
        if (!isAuthorized(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin credentials required."));
        }
        SubProject created = portfolioService.addSubProject(experienceId, subProject);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Company sub-project added successfully", created));
    }

    // 6. Delete Company SubProject
    @DeleteMapping("/subprojects/{id}")
    public ResponseEntity<ApiResponse<String>> deleteSubProject(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id) {
        if (!isAuthorized(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin credentials required."));
        }
        portfolioService.deleteSubProject(id);
        return ResponseEntity.ok(ApiResponse.ok("Company sub-project deleted successfully", "Deleted ID: " + id));
    }

    // 7. Update Certifications
    @PutMapping("/certifications")
    public ResponseEntity<ApiResponse<List<String>>> updateCertifications(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody List<String> certs) {
        if (!isAuthorized(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin credentials required."));
        }
        portfolioService.updateCertifications(certs);
        return ResponseEntity.ok(ApiResponse.ok("Certifications updated successfully", portfolioService.getCertifications()));
    }
}
