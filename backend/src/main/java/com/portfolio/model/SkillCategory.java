package com.portfolio.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "skill_categories")
public class SkillCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String categoryName;

    private int displayOrder;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "skill_items", joinColumns = @JoinColumn(name = "category_id"))
    @Column(name = "skill_name")
    private List<String> skills = new ArrayList<>();

    public SkillCategory() {
    }

    public SkillCategory(String categoryName, int displayOrder, List<String> skills) {
        this.categoryName = categoryName;
        this.displayOrder = displayOrder;
        this.skills = skills != null ? skills : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }
}
