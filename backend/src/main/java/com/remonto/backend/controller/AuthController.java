package com.remonto.backend.controller;

import com.remonto.backend.model.User;
import com.remonto.backend.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    public AuthController(UserService userService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {

        userService.registerUser(
                registerRequest.getName(),
                registerRequest.getSurname(),
                registerRequest.getEmail(),
                registerRequest.getPassword()
        );
        return ResponseEntity.ok("User registered successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        try {
            // Authenticate user via AuthenticationManager
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Store authentication in SecurityContextHolder
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Start the session and return success response (session cookie will be set)
            return ResponseEntity.ok("{\"message\": \"Login successful\"}");
        } catch (Exception e) {
            // Return 401 Unauthorized with error message
            return ResponseEntity.status(401).body("{\"message\": \"Invalid credentials\"}");
        }
    }

    // DTOs for request payloads
    @Data
    private static class RegisterRequest {
        private String name;
        private String surname;
        private String email;
        private String password;

        public String getName() {
            return name;
        }

        public String getSurname() {
            return surname;
        }

        public String getPassword() {
            return password;
        }

        public String getEmail() {
            return email;
        }
    }

    @Data
    private static class LoginRequest {
        private String email;
        private String password;
        public String getEmail() {
            return email;
        }
        public String getPassword() {
            return password;
        }
    }
}