package com.remonto.backend.repository;

import com.remonto.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email); // To check for email uniqueness
    Optional<User> findByEmail(String email); // To look for the user during login
}