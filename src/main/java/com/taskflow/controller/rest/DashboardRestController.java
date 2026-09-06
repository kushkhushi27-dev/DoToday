package com.taskflow.controller.rest;

import com.taskflow.dto.DashboardStatsDto;
import com.taskflow.security.SecurityUtils;
import com.taskflow.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardRestController {

    private final DashboardService dashboardService;

    public DashboardRestController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(dashboardService.getDashboardStats(currentUserId));
    }
}
