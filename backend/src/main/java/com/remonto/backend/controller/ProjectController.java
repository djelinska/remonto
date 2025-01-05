package com.remonto.backend.controller;

import com.remonto.backend.dto.ProjectDTO;
import com.remonto.backend.model.Project;
import com.remonto.backend.model.User;
import com.remonto.backend.service.ProjectService;
import com.remonto.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final UserService userService;
    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService, UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

//    @GetMapping
//    public ResponseEntity<List<Project>> getUserProjects(Principal principal) {
//        try {
//            System.out.println("Principal object: " + principal);
//            if (principal == null) {
//                throw new RuntimeException("Principal is null. Are you authenticated?");
//            }
//
//            // Step 1: Get the email of the authenticated user directly from the Principal
//            String userEmail = principal.getName();
//            System.out.println("Authenticated user: " + userEmail);
//
//            // Step 2: Fetch the user entity from the database
//            User user = userService.getUserRepository().findByEmail(userEmail)
//                    .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
//
//            System.out.println(user);
//
//            // Step 3: Fetch projects for this user using ProjectService
//            List<Project> userProjects = projectService.findAllByUserId(user.getId());
//
//            return ResponseEntity.ok(userProjects); // Return projects as JSON
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(null); // Handle errors gracefully
//        }
//    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authenticated User: " + auth.getName());
        System.out.println("Authorities: " + auth.getAuthorities());
        return ResponseEntity.ok(projectService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return new ResponseEntity<>(projectService.save(project), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project project) {
        Project existingProject = projectService.findById(id);
        project.setId(existingProject.getId());
        return ResponseEntity.ok(projectService.save(project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
