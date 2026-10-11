package com.portfolio.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sub_projects")
public class SubProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String technologies;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "experience_id")
    @JsonBackReference
    private Experience experience;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "sub_project_bullets", joinColumns = @JoinColumn(name = "sub_project_id"))
    @Column(name = "bullet", length = 1000)
    private List<String> bullets = new ArrayList<>();

    public SubProject() {
    }

    public SubProject(String name, String technologies, List<String> bullets) {
        this.name = name;
        this.technologies = technologies;
        this.bullets = bullets != null ? bullets : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTechnologies() {
        return technologies;
    }

    public void setTechnologies(String technologies) {
        this.technologies = technologies;
    }

    public Experience getExperience() {
        return experience;
    }

    public void setExperience(Experience experience) {
        this.experience = experience;
    }

    public List<String> getBullets() {
        return bullets;
    }

    public void setBullets(List<String> bullets) {
        this.bullets = bullets;
    }
}
