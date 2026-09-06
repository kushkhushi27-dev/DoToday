package com.dotoday.controller;

import com.dotoday.dto.DashboardStatsDto;
import com.dotoday.entity.Project;
import com.dotoday.entity.User;
import com.dotoday.security.SecurityUtils;
import com.dotoday.service.DashboardService;
import com.dotoday.service.ProjectService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class DashboardController {

    private final DashboardService dashboardService;
    private final ProjectService projectService;

    public DashboardController(DashboardService dashboardService, ProjectService projectService) {
        this.dashboardService = dashboardService;
        this.projectService = projectService;
    }

    @GetMapping({"/", "/dashboard"})
    public String showDashboard(Model model) {
        if (!SecurityUtils.isAuthenticated()) {
            return "redirect:/login";
        }

        Long currentUserId = SecurityUtils.getCurrentUserId();
        User currentUser = SecurityUtils.getCurrentUser().orElse(null);

        DashboardStatsDto stats = dashboardService.getDashboardStats(currentUserId);
        List<Project> projects = projectService.getUserProjects(currentUserId);

        model.addAttribute("stats", stats);
        model.addAttribute("projects", projects);
        model.addAttribute("currentUser", currentUser);
        model.addAttribute("activeNav", "dashboard");

        return "dashboard";
    }
}
