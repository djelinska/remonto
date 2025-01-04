package com.remonto.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Email
    @Column(name = "email", unique = true)
    private String email;

    @NotNull
    @Size(min = 2, max = 50)
    @Column(name = "first_name")
    private String firstName;

    @NotNull
    @Size(min = 2, max = 50)
    @Column(name = "last_name")
    private String lastName;

    @NotNull
    @Size(min = 8, max = 100)
    @Column(name = "password")
    private String password;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private UserRole role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Project> projects;


     public Long getId() { return id; }
     public void setId(Long id) { this.id = id; }
     public String getEmail() { return email; }
     public void setEmail(String email) { this.email = email; }
     public String getFirstName() { return firstName; }
     public void setFirstName(String firstName) { this.firstName = firstName; }
     public String getLastName() { return lastName; }
     public void setLastName(String lastName) { this.lastName = lastName; }
     public String getPassword() { return password; }
     public void setPassword(String password) { this.password = password; }
     public UserRole getRole() { return role; }
     public void setRole(UserRole role) { this.role = role; }
     public List<Project> getProjects() { return projects; }
     public void setProjects(List<Project> projects) { this.projects = projects; }
}