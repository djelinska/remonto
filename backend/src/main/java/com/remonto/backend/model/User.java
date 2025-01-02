package com.remonto.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
// @Data - combines @Getter, @Setter, @ToString, @EqualsAndHashCode and @RequiredArgsConstructor
@Table(name = "app_user")
// note: user is a reserved keyword in postgres, so the table storing users is called app_user
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Project> projects;
}
