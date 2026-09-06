package com.dotoday.controller;

import com.dotoday.dto.ProjectRequestDto;
import com.dotoday.dto.ProjectResponseDto;
import com.dotoday.entity.ActivityLog;
import com.dotoday.entity.Project;
import com.dotoday.entity.ProjectRole;
import com.dotoday.entity.Task;
import com.dotoday.entity.User;
import com.dotoday.exception.BadRequestException;
import com.dotoday.exception.ResourceNotFoundException;
import com.dotoday.security.SecurityUtils;
import com.dotoday.service.ActivityLogService;
import com.dotoday.service.ProjectService;
import com.dotoday.service.TaskService;
import com.dotoday.service.UserService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/projects")
public class ProjectViewController {

    private final ProjectService projectService;
    private final TaskService taskService;
    private final ActivityLogService activityLogService;
    private final UserService userService;

    public ProjectViewController(ProjectService projectService,
                                 TaskService taskService,
                                 ActivityLogService activityLogService,
                                 UserService userService) {
        this.projectService = projectService;
        this.taskService = taskService;
        this.activityLogService = activityLogService;
        this.userService = userService;
    }

    @GetMapping
    public String listProjects(Model model) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        List<ProjectResponseDto> projects = projectService.getUserProjectDtos(currentUserId);

        model.addAttribute("projects", projects);
        model.addAttribute("newProject", new ProjectRequestDto());
        model.addAttribute("activeNav", "projects");

        return "projects/list";
    }

    @GetMapping("/new")
    public String showCreateProjectForm(Model model) {
        model.addAttribute("project", new ProjectRequestDto());
        model.addAttribute("activeNav", "projects");
        return "projects/form";
    }

    @PostMapping
    public String createProject(@Valid @ModelAttribute("project") ProjectRequestDto projectDto,
                                BindingResult bindingResult,
                                Model model,
                                RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("activeNav", "projects");
            return "projects/form";
        }

        User currentUser = SecurityUtils.getCurrentUser().orElseThrow();
        Project created = projectService.createProject(projectDto, currentUser);
        redirectAttributes.addFlashAttribute("successMessage", "Project \"" + created.getName() + "\" created successfully!");

        return "redirect:/projects/" + created.getId();
    }

    @GetMapping("/{id}")
    public String showProjectDetail(@PathVariable("id") Long id, Model model) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Project project = projectService.getProjectById(id, currentUserId);
        List<Task> tasks = project.getTasks();
        List<ActivityLog> activities = activityLogService.getProjectActivities(id, 15);
        List<User> allUsers = userService.getAllUsers();

        boolean isOwner = project.getOwner().getId().equals(currentUserId) || SecurityUtils.hasRole("ROLE_ADMIN");

        model.addAttribute("project", project);
        model.addAttribute("tasks", tasks);
        model.addAttribute("activities", activities);
        model.addAttribute("allUsers", allUsers);
        model.addAttribute("isOwner", isOwner);
        model.addAttribute("currentUserId", currentUserId);
        model.addAttribute("activeNav", "projects");

        return "projects/detail";
    }

    @PostMapping("/{id}/members")
    public String addMember(@PathVariable("id") Long id,
                            @RequestParam("email") String email,
                            @RequestParam(value = "role", defaultValue = "MEMBER") ProjectRole role,
                            RedirectAttributes redirectAttributes) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        try {
            projectService.addMemberToProject(id, email, role, currentUserId);
            redirectAttributes.addFlashAttribute("successMessage", "Member added successfully.");
        } catch (BadRequestException | ResourceNotFoundException ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/projects/" + id;
    }

    @PostMapping("/{id}/members/{memberUserId}/delete")
    public String removeMember(@PathVariable("id") Long id,
                               @PathVariable("memberUserId") Long memberUserId,
                               RedirectAttributes redirectAttributes) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        projectService.removeMemberFromProject(id, memberUserId, currentUserId);
        redirectAttributes.addFlashAttribute("successMessage", "Member removed from project.");
        return "redirect:/projects/" + id;
    }

    @PostMapping("/{id}/delete")
    public String deleteProject(@PathVariable("id") Long id, RedirectAttributes redirectAttributes) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        projectService.deleteProject(id, currentUserId);
        redirectAttributes.addFlashAttribute("successMessage", "Project deleted successfully.");
        return "redirect:/projects";
    }
}
