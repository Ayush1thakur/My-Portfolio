package com.portfolio.repository;

import com.portfolio.model.ImpactMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImpactMetricRepository extends JpaRepository<ImpactMetric, Long> {
    List<ImpactMetric> findAllByOrderByDisplayOrderAsc();
}
