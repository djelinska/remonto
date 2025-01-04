package com.remonto.backend.service;

import com.remonto.backend.dto.MaterialDTO;
import com.remonto.backend.model.Material;
import com.remonto.backend.model.Project;
import com.remonto.backend.repository.MaterialRepository;
import com.remonto.backend.repository.ProjectRepository;
import com.remonto.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    @Autowired
    public MaterialService(MaterialRepository materialRepository,
                           TaskRepository taskRepository,
                           ProjectRepository projectRepository) {
        this.materialRepository = materialRepository;
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    private MaterialDTO mapToDTO(Material material) {
        MaterialDTO dto = new MaterialDTO();
        dto.setId(material.getId());
        dto.setName(material.getName());
        dto.setImageUrl(material.getImageUrl());
        dto.setStatus(material.getStatus());
        dto.setCost(material.getCost());
        dto.setQuantity(material.getQuantity());
        dto.setLocation(material.getLocation());
        dto.setLink(material.getLink());
        dto.setNote(material.getNote());
        dto.setType(material.getType());
        dto.setProjectId(material.getProject() != null ? material.getProject().getId() : null);
        return dto;
    }

    private Material mapToEntity(MaterialDTO dto) {
        Material material = new Material();
        material.setId(dto.getId());
        material.setName(dto.getName());
        material.setImageUrl(dto.getImageUrl());
        material.setStatus(dto.getStatus());
        material.setCost(dto.getCost());
        material.setQuantity(dto.getQuantity());
        material.setLocation(dto.getLocation());
        material.setLink(dto.getLink());
        material.setNote(dto.getNote());
        material.setType(dto.getType());

        if (dto.getProjectId() != null) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found with ID: " + dto.getProjectId()));
            material.setProject(project);
        } else {
            material.setProject(null);
        }

        return material;
    }

    public List<MaterialDTO> findAll() {
        return materialRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    public MaterialDTO save(MaterialDTO dto) {
        Material material = mapToEntity(dto);
        Material savedMaterial = materialRepository.save(material);
        return mapToDTO(savedMaterial);
    }

    public MaterialDTO update(Long id, MaterialDTO dto) {
        Material existingMaterial = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        Material updatedMaterial = mapToEntity(dto);
        updatedMaterial.setId(existingMaterial.getId());
        return mapToDTO(materialRepository.save(updatedMaterial));
    }

    public void deleteById(Long id) {
        materialRepository.deleteById(id);
    }
}


