package com.remonto.backend.config;

import com.remonto.backend.model.Project;
import com.remonto.backend.model.User;
import com.remonto.backend.service.ProjectService;
import com.remonto.backend.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataLoader extends BCryptPasswordEncoder {

    @Bean
    public CommandLineRunner initUser(UserService userService, ProjectService projectService) {
        return args -> {
            // Using UserService to leverage bcrypt and validation
            try {
                // Register a new user (dummyuser)
                User user = userService.registerUser(
                        "Dummy", // First Name
                        "User",  // Last Name
                        "dummyuser@example.com", // Email
                        "dummy-password" // Plain password (will be encoded)
                );
                System.out.println("Dummy user created successfully");

                // Step 2: Initialize and save projects for the dummy user
                Project project1 = new Project();
                project1.setName("Project Alpha");
                project1.setDescription("An example project description");
                project1.setStartDate(LocalDate.now());
                project1.setEndDate(LocalDate.now().plusWeeks(4)); // 4 weeks from now
                project1.setBudget(new BigDecimal("1000.00"));
                project1.setUser(user); // Link the project to the user

                Project project2 = new Project();
                project2.setName("Project Beta");
                project2.setDescription("Another example project");
                project2.setStartDate(LocalDate.now().plusWeeks(1)); // Starts next week
                project2.setEndDate(LocalDate.now().plusMonths(2)); // Two months from now
                project2.setBudget(new BigDecimal("5000.00"));
                project2.setUser(user); // Link the project to the user

                // Step 3: Save projects using ProjectService
                projectService.save(project1);
                projectService.save(project2);

                System.out.println("Dummy projects created successfully.");

            } catch (Exception e) {
                e.printStackTrace();
                System.err.println("Failed to create dummy user");
            }
        };
    }
}
