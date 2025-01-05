package com.remonto.backend.service;

import com.remonto.backend.dto.ProjectDTO;
import com.remonto.backend.model.Project;
import com.remonto.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // Method to map Project entity to ProjectDTO
    private ProjectDTO mapToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStartDate(project.getStartDate() != null ? project.getStartDate().atStartOfDay() : null);
        dto.setEndDate(project.getEndDate() != null ? project.getEndDate().atStartOfDay() : null);
        dto.setBudget(project.getBudget());
        // TODO: Map lists of tasks, materials, and tools if added to ProjectDTO
        return dto;
    }

    // Method to map ProjectDTO to Project entity
    private Project mapToEntity(ProjectDTO dto) {
        Project project = new Project();
        project.setId(dto.getId());
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStartDate(dto.getStartDate() != null ? dto.getStartDate().toLocalDate() : null);
        project.setEndDate(dto.getEndDate() != null ? dto.getEndDate().toLocalDate() : null);
        project.setBudget(dto.getBudget());
        // TODO: Handle setting lists of tasks, materials, and tools explicitly if added to DTO
        return project;
    }

    public List<ProjectDTO> findAll() {
        return projectRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<ProjectDTO> findAllByUserId(Long userId) {
        return projectRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .toList();
    }

    public Project findById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    public Project save(Project project) {
        return projectRepository.save(project);
    }

    public void deleteById(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }
}
