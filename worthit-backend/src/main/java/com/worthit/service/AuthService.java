package com.worthit.service;

import com.worthit.dto.AuthDTO;
import com.worthit.model.User;
import com.worthit.repository.UserRepository;
import com.worthit.security.JwtService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getName().trim(), request.getEmail().trim().toLowerCase(), hashedPassword);
        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser.getId(), savedUser.getEmail());

        return AuthDTO.AuthResponse.builder()
                .token(token)
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .joinedDate(savedUser.getCreatedAt() != null
                        ? savedUser.getCreatedAt().format(DateTimeFormatter.ofPattern("MMMM yyyy"))
                        : "Just now")
                .build();
    }

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail());

        return AuthDTO.AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .joinedDate(user.getCreatedAt() != null
                        ? user.getCreatedAt().format(DateTimeFormatter.ofPattern("MMMM yyyy"))
                        : "Recent")
                .build();
    }

    public User getOrCreateDemoUser() {
        return userRepository.findByEmail("aditya.verma@college.edu")
                .orElseGet(() -> {
                    User demo = new User(
                            "Aditya Verma",
                            "aditya.verma@college.edu",
                            passwordEncoder.encode("password123")
                    );
                    return userRepository.save(demo);
                });
    }

    public Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getCredentials() instanceof Long) {
            return (Long) auth.getCredentials();
        } else if (auth != null && auth.getPrincipal() instanceof String) {
            String email = (String) auth.getPrincipal();
            return userRepository.findByEmail(email)
                    .map(User::getId)
                    .orElseGet(() -> getOrCreateDemoUser().getId());
        }
        return getOrCreateDemoUser().getId();
    }
}
