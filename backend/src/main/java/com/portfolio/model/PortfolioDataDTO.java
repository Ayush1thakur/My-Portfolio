package com.portfolio.model;

import java.util.List;

public class PortfolioDataDTO {

    private PersonalInfo personalInfo;
    private List<ImpactMetric> metrics;
    private List<Experience> experiences;
    private List<Project> projects;
    private List<Education> education;
    private List<SkillCategory> skills;
    private List<String> certifications;

    public PortfolioDataDTO() {
    }

    public PortfolioDataDTO(PersonalInfo personalInfo, List<ImpactMetric> metrics,
                            List<Experience> experiences, List<Project> projects,
                            List<Education> education, List<SkillCategory> skills,
                            List<String> certifications) {
        this.personalInfo = personalInfo;
        this.metrics = metrics;
        this.experiences = experiences;
        this.projects = projects;
        this.education = education;
        this.skills = skills;
        this.certifications = certifications;
    }

    public PersonalInfo getPersonalInfo() {
        return personalInfo;
    }

    public void setPersonalInfo(PersonalInfo personalInfo) {
        this.personalInfo = personalInfo;
    }

    public List<ImpactMetric> getMetrics() {
        return metrics;
    }

    public void setMetrics(List<ImpactMetric> metrics) {
        this.metrics = metrics;
    }

    public List<Experience> getExperiences() {
        return experiences;
    }

    public void setExperiences(List<Experience> experiences) {
        this.experiences = experiences;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public List<Education> getEducation() {
        return education;
    }

    public void setEducation(List<Education> education) {
        this.education = education;
    }

    public List<SkillCategory> getSkills() {
        return skills;
    }

    public void setSkills(List<SkillCategory> skills) {
        this.skills = skills;
    }

    public List<String> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<String> certifications) {
        this.certifications = certifications;
    }
}
