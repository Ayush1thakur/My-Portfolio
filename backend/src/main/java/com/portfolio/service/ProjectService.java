package com.portfolio.service;

import com.portfolio.model.Project;
import com.portfolio.repository.ProjectRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @PostConstruct
    public void initSeedData() {
        if (projectRepository.count() == 0) {
            projectRepository.save(new Project(
                    "Cloud-Native E-Commerce API",
                    "High-performance microservices architecture powered by Spring Boot, PostgreSQL, and Redis caching.",
                    "Java, Spring Boot, PostgreSQL, Docker, Redis",
                    "https://github.com/Ayush1thakur/ecommerce-api",
                    "https://api.demo.example.com",
                    "Backend",
                    true
            ));

            projectRepository.save(new Project(
                    "Real-Time Analytics Dashboard",
                    "Interactive real-time monitoring and event-driven pipeline visualizing system telemetry and metrics.",
                    "React, Vite, WebSockets, Chart.js, Spring Boot",
                    "https://github.com/Ayush1thakur/realtime-analytics",
                    "https://analytics.demo.example.com",
                    "Fullstack",
                    true
            ));

            projectRepository.save(new Project(
                    "Neon Serverless AI Orchestrator",
                    "LLM workflow automation platform running on Neon Serverless Postgres with automated vector search indexing.",
                    "Java 21, Neon Postgres, pgvector, Spring AI, React",
                    "https://github.com/Ayush1thakur/neon-ai-orchestrator",
                    "https://neon.demo.example.com",
                    "AI & Cloud",
                    true
            ));
        }
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> getFeaturedProjects() {
        return projectRepository.findByFeaturedTrue();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
