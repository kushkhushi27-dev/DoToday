package com.taskflow.controller;

import com.taskflow.dto.KanbanColumnDto;
import com.taskflow.entity.Project;
import com.taskflow.security.SecurityUtils;
import com.taskflow.service.ProjectService;
import com.taskflow.service.TaskService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/kanban")
public class KanbanViewController {

    private final TaskService taskService;
    private final ProjectService projectService;

    public KanbanViewController(TaskService taskService, ProjectService projectService) {
        this.taskService = taskService;
        this.projectService = projectService;
    }

    @GetMapping
    public String showKanbanBoard(@RequestParam(value = "projectId", required = false) Long projectId, Model model) {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        List<KanbanColumnDto> columns = taskService.getKanbanBoard(currentUserId, projectId);
        List<Project> projects = projectService.getUserProjects(currentUserId);

        model.addAttribute("columns", columns);
        model.addAttribute("projects", projects);
        model.addAttribute("selectedProjectId", projectId);
        model.addAttribute("activeNav", "kanban");

        return "kanban/board";
    }
}
