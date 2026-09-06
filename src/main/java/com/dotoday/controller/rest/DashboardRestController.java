package com.dotoday.controller.rest;

import com.dotoday.dto.DashboardStatsDto;
import com.dotoday.security.SecurityUtils;
import com.dotoday.service.DashboardService;
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
