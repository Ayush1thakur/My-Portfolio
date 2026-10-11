package com.portfolio.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "personal_info")
public class PersonalInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String title;

    private String currentCompany;
    private String college;
    private String location;
    private String statusBadge;
    private String email;
    private String phone;
    private String linkedInUrl;
    private String githubUrl;
    private String avatarUrl;
    private String resumeUrl;

    @Column(length = 2000)
    private String summary;

    private LocalDateTime updatedAt = LocalDateTime.now();

    public PersonalInfo() {
    }

    public PersonalInfo(String fullName, String title, String currentCompany, String college,
                        String location, String statusBadge, String email, String phone,
                        String linkedInUrl, String githubUrl, String avatarUrl, String resumeUrl, String summary) {
        this.fullName = fullName;
        this.title = title;
        this.currentCompany = currentCompany;
        this.college = college;
        this.location = location;
        this.statusBadge = statusBadge;
        this.email = email;
        this.phone = phone;
        this.linkedInUrl = linkedInUrl;
        this.githubUrl = githubUrl;
        this.avatarUrl = avatarUrl;
        this.resumeUrl = resumeUrl;
        this.summary = summary;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCurrentCompany() {
        return currentCompany;
    }

    public void setCurrentCompany(String currentCompany) {
        this.currentCompany = currentCompany;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatusBadge() {
        return statusBadge;
    }

    public void setStatusBadge(String statusBadge) {
        this.statusBadge = statusBadge;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLinkedInUrl() {
        return linkedInUrl;
    }

    public void setLinkedInUrl(String linkedInUrl) {
        this.linkedInUrl = linkedInUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
