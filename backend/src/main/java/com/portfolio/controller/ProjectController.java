package com.portfolio.controller;

import com.portfolio.model.ApiResponse;
import com.portfolio.model.Project;
import com.portfolio.service.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.ok("Projects retrieved successfully", projects));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<Project>>> getFeaturedProjects() {
        List<Project> featured = projectService.getFeaturedProjects();
        return ResponseEntity.ok(ApiResponse.ok("Featured projects retrieved successfully", featured));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Project>> createProject(@RequestBody Project project) {
        Project saved = projectService.saveProject(project);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Project created successfully", saved));
    }
}
