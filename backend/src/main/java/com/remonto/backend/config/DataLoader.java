package com.remonto.backend.config;

import com.remonto.backend.model.*;
import com.remonto.backend.repository.MaterialRepository;
import com.remonto.backend.repository.ProjectRepository;
import com.remonto.backend.repository.ToolRepository;
import com.remonto.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner loadData(
            MaterialRepository materialRepository,
            ToolRepository toolRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository) {
        return args -> {
            // Insert dummy user
            User user = new User();
            user.setEmail("john.doe@gmail.com");
            user.setFirstName("John");
            user.setLastName("Doe");
            user.setPassword("password");
            user.setRole(UserRole.USER);
            userRepository.save(user);

            // Insert dummy project and associate with the saved user
            Project project = new Project();
            project.setUser(user);
            project.setName("Sample Project");
            project.setDescription("A detailed description of the project.");
            project.setStartDate(java.time.LocalDate.now());
            project.setEndDate(java.time.LocalDate.now().plusMonths(1));
            project.setBudget(new BigDecimal("1000.00"));
            projectRepository.save(project);

            // Insert sample materials
            Material material1 = new Material();
            material1.setProject(project);
            material1.setName("Cement");
            material1.setCost(new BigDecimal("15.00"));
            material1.setQuantity(100);
            material1.setLocation("Warehouse A");
            material1.setStatus("In Stock");
            material1.setLink("http://example.com/cement");
            material1.setNote("For foundation work");
            material1.setType("Type 1");
            material1.setImageUrl("http://example.com/cement.png");
            materialRepository.save(material1);

            Material material2 = new Material();
            material2.setProject(project);
            material2.setName("Paint");
            material2.setCost(new BigDecimal("30.00"));
            material2.setQuantity(50);
            material2.setLocation("Warehouse B");
            material2.setStatus("In Stock");
            material2.setLink("http://example.com/paint");
            material2.setNote("For wall finishing");
            material2.setType("Type 2");
            material2.setImageUrl("http://example.com/paint.png");
            materialRepository.save(material2);

            // Insert sample tools
            Tool tool1 = new Tool();
            tool1.setProject(project);
            tool1.setName("Hammer");
            tool1.setCost(new BigDecimal("5.00"));
            tool1.setQuantity(20);
            tool1.setLocation("Tool Shed");
            tool1.setStatus("In Stock");
            tool1.setLink("http://example.com/hammer");
            tool1.setNote("For construction work");
            tool1.setImageUrl("http://example.com/hammer.png");
            toolRepository.save(tool1);

            Tool tool2 = new Tool();
            tool2.setProject(project);
            tool2.setName("Screwdriver");
            tool2.setCost(new BigDecimal("3.00"));
            tool2.setQuantity(50);
            tool2.setLocation("Tool Shed");
            tool2.setStatus("In Stock");
            tool2.setLink("http://example.com/screwdriver");
            tool2.setNote("For electrical work");
            tool2.setImageUrl("http://example.com/screwdriver.png");
            toolRepository.save(tool2);
        };
    }
}
