package com.remonto.backend.service;

import com.remonto.backend.model.User;
import com.remonto.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    // User registration logic
    public User registerUser(String name, String surname, String email, String password) {
        // Check if email or username already exists
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        // Create a new User instance
        User user = new User();
        user.setName(name);
        user.setSurname(surname);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // Store encrypted password
        user.setRole("ROLE_USER");

        return userRepository.save(user);
    }
    public User registerAdmin(String name, String surname, String email, String password) {
        // Create an admin user
        User user = new User();
        user.setName(name);
        user.setSurname(surname);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("ROLE_ADMIN"); // Explicitly assign an admin role

        return userRepository.save(user);
    }

    // Validate user during login
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password.");
        }

        return user;
    }
}