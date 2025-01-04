package com.remonto.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "tools")
public class Tool extends Element {

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToMany(mappedBy = "tools")
    private List<Task> tasks;

     public Project getProject() { return project; }
     public void setProject(Project project) { this.project = project; }
     public List<Task> getTasks() { return tasks; }
     public void setTasks(List<Task> tasks) { this.tasks = tasks; }
}
