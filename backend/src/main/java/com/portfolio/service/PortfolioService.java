package com.portfolio.service;

import com.portfolio.model.*;
import com.portfolio.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class PortfolioService {

    private final PersonalInfoRepository personalInfoRepository;
    private final ImpactMetricRepository impactMetricRepository;
    private final ExperienceRepository experienceRepository;
    private final SubProjectRepository subProjectRepository;
    private final ProjectRepository projectRepository;
    private final EducationRepository educationRepository;
    private final SkillCategoryRepository skillCategoryRepository;

    private final List<String> currentCertifications = new CopyOnWriteArrayList<>(Arrays.asList(
            "Microsoft Certified: Azure Fundamentals (AZ-900) & Cloud Infrastructure",
            "Generative AI & Agent Engineering: LangChain, LangGraph & FastMCP",
            "Enterprise Java Spring Boot, Microservices & Spring Data JPA"
    ));

    public PortfolioService(PersonalInfoRepository personalInfoRepository,
                            ImpactMetricRepository impactMetricRepository,
                            ExperienceRepository experienceRepository,
                            SubProjectRepository subProjectRepository,
                            ProjectRepository projectRepository,
                            EducationRepository educationRepository,
                            SkillCategoryRepository skillCategoryRepository) {
        this.personalInfoRepository = personalInfoRepository;
        this.impactMetricRepository = impactMetricRepository;
        this.experienceRepository = experienceRepository;
        this.subProjectRepository = subProjectRepository;
        this.projectRepository = projectRepository;
        this.educationRepository = educationRepository;
        this.skillCategoryRepository = skillCategoryRepository;
    }

    @PostConstruct
    @Transactional
    public void seedPortfolioData() {
        // 1. Seed Personal Info
        if (personalInfoRepository.count() == 0) {
            personalInfoRepository.save(new PersonalInfo(
                    "Ayush Thakur",
                    "Associate Software Engineer",
                    "MAQ Software",
                    "Chitkara University",
                    "Noida, India",
                    "Open to Roles",
                    "ayush.thaku7@gmail.com",
                    "+91-9877247382",
                    "https://linkedin.com/in/ayush-thakur1",
                    "https://github.com/Ayush1thakur",
                    "./profile.jpg",
                    "#", // Default resume link
                    "Associate Software Engineer at MAQ Software specializing in distributed data pipelines, enterprise migration platforms, and scalable backend architectures. Experienced in processing 10M+ records with fault-tolerant retry workflows, automating Tableau-to-Power BI conversions for 1,000+ reports, and engineering robust APIs using Python, C#, Java Spring Boot, and AI agent frameworks."
            ));
        }

        // 2. Seed Impact Metrics / Achievements
        if (impactMetricRepository.count() == 0) {
            impactMetricRepository.save(new ImpactMetric(
                    "10M+ Records",
                    "Data Pipeline Scale",
                    "Engineered fault-tolerant data pipelines with optimized retry workflows (+35% reliability gain) at MAQ Software.",
                    1
            ));
            impactMetricRepository.save(new ImpactMetric(
                    "1,000+ Reports",
                    "Migration Automation",
                    "Automated enterprise Tableau-to-Power BI report migrations via dedicated orchestration engine.",
                    2
            ));
            impactMetricRepository.save(new ImpactMetric(
                    "8.41 CGPA",
                    "Academic Distinction",
                    "B.E. Computer Science & Engineering graduate from Chitkara University (2022 – 2026).",
                    3
            ));
        }

        // 3. Seed Company Experiences & Company Projects
        if (experienceRepository.count() == 0) {
            Experience maqExperience = new Experience(
                    "MAQ Software",
                    "Associate Software Engineer",
                    "Oct 2025 – Present",
                    "Noida, India",
                    true,
                    1
            );

            SubProject subProject1 = new SubProject(
                    "MigrateFAST",
                    "Python, Flask, LangGraph, React, Azure, Tableau, Power BI",
                    Arrays.asList(
                            "Developed internal migration platform supporting 1,000+ report migrations.",
                            "Built distributed data-processing pipelines handling 10M+ records with optimized retry workflows (+35% reliability).",
                            "Architected microservice-oriented backend components for high availability.",
                            "Automated E2E and regression suites using Playwright.",
                            "Integrated telemetry and monitoring with Azure Application Insights."
                    )
            );

            SubProject subProject2 = new SubProject(
                    "SaaS Tools License Manager",
                    "C#, ASP.NET Core, SQL, TypeScript",
                    Arrays.asList(
                            "Built secure REST APIs for licensing with rate limiting and authentication across 10+ endpoints.",
                            "Implemented server-clock SQL license validation across 100% of activation checks.",
                            "Conducted load and performance stress testing."
                    )
            );

            maqExperience.addSubProject(subProject1);
            maqExperience.addSubProject(subProject2);

            experienceRepository.save(maqExperience);
        }

        // 4. Seed Personal Projects
        if (projectRepository.count() == 0) {
            projectRepository.save(new Project(
                    "MyShop",
                    "High-concurrency e-commerce backend platform for user authentication, catalog management, cart operations, and order lifecycle fulfillment.",
                    "Java, Spring Boot, Spring Data JPA, Hibernate, SQL, Spring Security",
                    "https://github.com/Ayush1thakur/MyShop",
                    "https://github.com/Ayush1thakur/MyShop",
                    "Personal Project",
                    true,
                    1,
                    Arrays.asList(
                            "E-commerce backend platform for user, order, and inventory management.",
                            "Optimized database queries and transactional consistency using JPA / Hibernate.",
                            "Secured authentication and role-based permissions (RBAC) with Spring Security."
                    )
            ));
        }

        // 5. Seed Education
        if (educationRepository.count() == 0) {
            educationRepository.save(new Education(
                    "Chitkara University",
                    "B.E. Computer Science Engineering",
                    "Aug 2022 – Jul 2026",
                    "CGPA: 8.41",
                    "Punjab, India",
                    1
            ));
        }

        // 6. Seed Technical Skills
        if (skillCategoryRepository.count() == 0) {
            skillCategoryRepository.save(new SkillCategory(
                    "AI & LLM",
                    1,
                    Arrays.asList("LangChain", "LangGraph", "RAG", "MCP", "FastMCP", "Semantic Kernel", "AutoGen", "ChromaDB")
            ));
            skillCategoryRepository.save(new SkillCategory(
                    "Backend & APIs",
                    2,
                    Arrays.asList("Spring Boot", "Flask", "ASP.NET Core", "REST APIs", "Rate Limiting")
            ));
            skillCategoryRepository.save(new SkillCategory(
                    "Languages",
                    3,
                    Arrays.asList("Python", "Java", "C#", "SQL")
            ));
            skillCategoryRepository.save(new SkillCategory(
                    "Cloud & Testing",
                    4,
                    Arrays.asList("Azure", "Azure DevOps", "Playwright", "App Insights", "Git")
            ));
        }
    }

    public List<String> getCertifications() {
        return new ArrayList<>(currentCertifications);
    }

    public void updateCertifications(List<String> newCerts) {
        if (newCerts != null) {
            currentCertifications.clear();
            currentCertifications.addAll(newCerts);
        }
    }

    @Transactional(readOnly = true)
    public PortfolioDataDTO getCompletePortfolio() {
        PersonalInfo info = personalInfoRepository.findFirstByOrderByIdAsc().orElse(null);
        List<ImpactMetric> metrics = impactMetricRepository.findAllByOrderByDisplayOrderAsc();
        List<Experience> experiences = experienceRepository.findAllByOrderByDisplayOrderAsc();
        List<Project> projects = projectRepository.findAllByOrderByDisplayOrderAsc();
        List<Education> education = educationRepository.findAllByOrderByDisplayOrderAsc();
        List<SkillCategory> skills = skillCategoryRepository.findAllByOrderByDisplayOrderAsc();
        List<String> certifications = getCertifications();

        return new PortfolioDataDTO(info, metrics, experiences, projects, education, skills, certifications);
    }

    // CRUD: Profile
    @Transactional
    public PersonalInfo updatePersonalInfo(PersonalInfo updated) {
        PersonalInfo existing = personalInfoRepository.findFirstByOrderByIdAsc().orElseGet(PersonalInfo::new);
        if (updated.getFullName() != null) existing.setFullName(updated.getFullName());
        if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
        if (updated.getCurrentCompany() != null) existing.setCurrentCompany(updated.getCurrentCompany());
        if (updated.getCollege() != null) existing.setCollege(updated.getCollege());
        if (updated.getLocation() != null) existing.setLocation(updated.getLocation());
        if (updated.getEmail() != null) existing.setEmail(updated.getEmail());
        if (updated.getPhone() != null) existing.setPhone(updated.getPhone());
        if (updated.getLinkedInUrl() != null) existing.setLinkedInUrl(updated.getLinkedInUrl());
        if (updated.getGithubUrl() != null) existing.setGithubUrl(updated.getGithubUrl());
        if (updated.getAvatarUrl() != null) existing.setAvatarUrl(updated.getAvatarUrl());
        if (updated.getResumeUrl() != null) existing.setResumeUrl(updated.getResumeUrl());
        if (updated.getSummary() != null) existing.setSummary(updated.getSummary());
        if (updated.getStatusBadge() != null) existing.setStatusBadge(updated.getStatusBadge());
        existing.setUpdatedAt(java.time.LocalDateTime.now());
        return personalInfoRepository.save(existing);
    }

    // CRUD: Projects
    @Transactional
    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    @Transactional
    public Project updateProject(Long id, Project updated) {
        Project existing = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + id));
        if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getTechnologies() != null) existing.setTechnologies(updated.getTechnologies());
        if (updated.getGithubUrl() != null) existing.setGithubUrl(updated.getGithubUrl());
        if (updated.getLiveUrl() != null) existing.setLiveUrl(updated.getLiveUrl());
        if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
        existing.setFeatured(updated.isFeatured());
        if (updated.getBullets() != null) existing.setBullets(updated.getBullets());
        return projectRepository.save(existing);
    }

    @Transactional
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    // CRUD: Company Subprojects
    @Transactional
    public SubProject addSubProject(Long experienceId, SubProject subProject) {
        Experience exp;
        if (experienceId != null) {
            exp = experienceRepository.findById(experienceId)
                    .orElseGet(() -> experienceRepository.findFirstByOrderByDisplayOrderAsc().orElse(null));
        } else {
            exp = experienceRepository.findFirstByOrderByDisplayOrderAsc().orElse(null);
        }
        if (exp != null) {
            exp.addSubProject(subProject);
            experienceRepository.save(exp);
            return subProject;
        }
        return subProjectRepository.save(subProject);
    }

    @Transactional
    public void deleteSubProject(Long id) {
        subProjectRepository.deleteById(id);
    }
}
