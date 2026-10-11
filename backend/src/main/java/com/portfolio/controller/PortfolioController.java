package com.portfolio.controller;

import com.portfolio.model.ApiResponse;
import com.portfolio.model.PortfolioDataDTO;
import com.portfolio.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    /**
     * Primary endpoint returning all profile info, company projects,
     * personal projects, achievements, certifications, and contacts.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PortfolioDataDTO>> getPortfolio() {
        PortfolioDataDTO data = portfolioService.getCompletePortfolio();
        return ResponseEntity.ok(ApiResponse.ok("Portfolio retrieved successfully", data));
    }
}
