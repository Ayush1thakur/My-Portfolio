package com.portfolio.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "experiences")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String role;

    private String period;
    private String location;
    private boolean isCurrent;
    private int displayOrder;

    @OneToMany(mappedBy = "experience", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<SubProject> subProjects = new ArrayList<>();

    public Experience() {
    }

    public Experience(String company, String role, String period, String location, boolean isCurrent, int displayOrder) {
        this.company = company;
        this.role = role;
        this.period = period;
        this.location = location;
        this.isCurrent = isCurrent;
        this.displayOrder = displayOrder;
    }

    public void addSubProject(SubProject subProject) {
        subProjects.add(subProject);
        subProject.setExperience(this);
    }

    public void removeSubProject(SubProject subProject) {
        subProjects.remove(subProject);
        subProject.setExperience(null);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public boolean isCurrent() {
        return isCurrent;
    }

    public void setCurrent(boolean current) {
        isCurrent = current;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }

    public List<SubProject> getSubProjects() {
        return subProjects;
    }

    public void setSubProjects(List<SubProject> subProjects) {
        this.subProjects = subProjects;
        if (subProjects != null) {
            for (SubProject subProject : subProjects) {
                subProject.setExperience(this);
            }
        }
    }
}
