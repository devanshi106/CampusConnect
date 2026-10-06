package com.CampusConnect.backend.service;

import com.CampusConnect.backend.dto.AuthResponse;
import com.CampusConnect.backend.dto.RegisterRequest;
import com.CampusConnect.backend.entity.Role;
import com.CampusConnect.backend.entity.User;
import com.CampusConnect.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (users.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
        Role role = request.role() == Role.ORGANISER ? Role.ORGANISER : Role.STUDENT;
        String org = request.organization();
        if (role == Role.ORGANISER && (org == null || org.isBlank())) {
            org = "Student Council";
        }
        User user = users.save(new User(email, passwordEncoder.encode(request.password()), role, org));
        return toResponse(user);
    }

    public AuthResponse currentUser(String email) {
        return users.findByEmail(email)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account not found"));
    }

    private AuthResponse toResponse(User user) {
        return new AuthResponse(user.getId(), user.getEmail(), user.getRole().name(), user.getOrganization());
    }
}
