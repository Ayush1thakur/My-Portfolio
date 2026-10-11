package com.portfolio.service;

import com.portfolio.model.User;
import com.portfolio.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final Map<String, TokenSession> activeSessions = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    public static class TokenSession {
        private final String username;
        private final String role;
        private final long createdAt;

        public TokenSession(String username, String role) {
            this.username = username;
            this.role = role;
            this.createdAt = System.currentTimeMillis();
        }

        public String getUsername() {
            return username;
        }

        public String getRole() {
            return role;
        }

        public long getCreatedAt() {
            return createdAt;
        }
    }

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void initAdminUser() {
        Optional<User> existing = userRepository.findByUsername("Ayush");
        if (existing.isEmpty()) {
            userRepository.save(new User("Ayush", "Ayush.admin", "ROLE_ADMIN"));
        } else {
            // Guarantee correct credentials
            User admin = existing.get();
            admin.setPassword("Ayush.admin");
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
        }
    }

    public Optional<String> authenticate(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                // Generate secure bearer token
                byte[] bytes = new byte[32];
                secureRandom.nextBytes(bytes);
                String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
                activeSessions.put(token, new TokenSession(user.getUsername(), user.getRole()));
                return Optional.of(token);
            }
        }
        return Optional.empty();
    }

    public boolean validateAdminToken(String token) {
        if (token == null || token.isBlank()) return false;
        TokenSession session = activeSessions.get(token);
        if (session != null) {
            return "ROLE_ADMIN".equals(session.getRole());
        }
        return false;
    }

    public Optional<TokenSession> getSession(String token) {
        if (token == null) return Optional.empty();
        return Optional.ofNullable(activeSessions.get(token));
    }

    public void invalidateToken(String token) {
        if (token != null) {
            activeSessions.remove(token);
        }
    }
}
