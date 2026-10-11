package com.portfolio.repository;

import com.portfolio.model.SubProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubProjectRepository extends JpaRepository<SubProject, Long> {
}
