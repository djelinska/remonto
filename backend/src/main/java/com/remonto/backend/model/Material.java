package com.remonto.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "materials")
public class Material extends Element {

    @Column(name = "type")
    private String type;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToMany(mappedBy = "materials")
    private List<Task> tasks;

     public String getType() { return type; }
     public void setType(String type) { this.type = type; }
     public Project getProject() { return project; }
     public void setProject(Project project) { this.project = project; }
     public List<Task> getTasks() { return tasks; }
     public void setTasks(List<Task> tasks) { this.tasks = tasks; }
}
