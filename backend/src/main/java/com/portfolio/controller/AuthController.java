package com.portfolio.controller;

import com.portfolio.model.ApiResponse;
import com.portfolio.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody LoginRequest request) {
        if (request == null || request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Username and password are required"));
        }

        Optional<String> tokenOpt = authService.authenticate(request.getUsername(), request.getPassword());
        if (tokenOpt.isPresent()) {
            String token = tokenOpt.get();
            Map<String, Object> data = new HashMap<>();
            data.put("token", token);
            data.put("username", request.getUsername());
            data.put("role", "ROLE_ADMIN");
            return ResponseEntity.ok(ApiResponse.ok("Login successful. Admin session established.", data));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid credentials. Access restricted to administrator."));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verify(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        String token = extractToken(authHeader);
        if (token != null && authService.validateAdminToken(token)) {
            var session = authService.getSession(token).orElseThrow();
            Map<String, Object> data = new HashMap<>();
            data.put("username", session.getUsername());
            data.put("role", session.getRole());
            data.put("valid", true);
            return ResponseEntity.ok(ApiResponse.ok("Session is valid", data));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Invalid or expired session token"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        String token = extractToken(authHeader);
        if (token != null) {
            authService.invalidateToken(token);
        }
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully", "Session ended"));
    }

    private String extractToken(String header) {
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7).trim();
        }
        return null;
    }
}
