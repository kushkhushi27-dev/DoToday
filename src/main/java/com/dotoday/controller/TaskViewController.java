package com.dotoday.controller;

import com.dotoday.dto.CommentRequestDto;
import com.dotoday.dto.TaskRequestDto;
import com.dotoday.entity.*;
import com.dotoday.security.SecurityUtils;
import com.dotoday.service.CommentService;
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
@RequestMapping("/tasks")
public class TaskViewController {

    private final TaskService taskService;
    private final ProjectService projectService;
    private final UserService userService;
    private final CommentService commentService;

    public TaskViewController(TaskService taskService,
                              ProjectService projectService,
                              UserService userService,
                              CommentService commentService) {
        this.taskService = taskService;
        this.projectService = projectService;
        this.userService = userService;
        this.commentService = commentService;
    }

    @GetMapping
    public String listTasks(@RequestParam(value = "status", required = false) TaskStatus status,
                            @RequestParam(value = "priority", required = false) TaskPriority priority,
                            @RequestParam(value = "projectId", required = false) Long projectId,
                            @RequestParam(value = "keyword", required = false) String keyword,
                            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
                            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir,
                            Model model) {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        List<Task> tasks = taskService.getFilteredTasks(currentUserId, status, priority, projectId, keyword, sortBy, sortDir);
        List<Project> userProjects = projectService.getUserProjects(currentUserId);

        model.addAttribute("tasks", tasks);
        model.addAttribute("projects", userProjects);
        model.addAttribute("selectedStatus", status);
        model.addAttribute("selectedPriority", priority);
        model.addAttribute("selectedProjectId", projectId);
        model.addAttribute("keyword", keyword);
        model.addAttribute("sortBy", sortBy);
        model.addAttribute("sortDir", sortDir);
        model.addAttribute("activeNav", "tasks");

        return "tasks/list";
    }

    @GetMapping("/new")
    public String showCreateTaskForm(@RequestParam(value = "projectId", required = false) Long projectId, Model model) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        TaskRequestDto dto = new TaskRequestDto();
        if (projectId != null) {
            dto.setProjectId(projectId);
        }

        model.addAttribute("task", dto);
        model.addAttribute("projects", projectService.getUserProjects(currentUserId));
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("isEdit", false);
        model.addAttribute("activeNav", "tasks");

        return "tasks/form";
    }

    @PostMapping
    public String createTask(@Valid @ModelAttribute("task") TaskRequestDto taskDto,
                             BindingResult bindingResult,
                             Model model,
                             RedirectAttributes redirectAttributes) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User currentUser = SecurityUtils.getCurrentUser().orElseThrow();

        if (bindingResult.hasErrors()) {
            model.addAttribute("projects", projectService.getUserProjects(currentUserId));
            model.addAttribute("users", userService.getAllUsers());
            model.addAttribute("isEdit", false);
            model.addAttribute("activeNav", "tasks");
            return "tasks/form";
        }

        Task created = taskService.createTask(taskDto, currentUser);
        redirectAttributes.addFlashAttribute("successMessage", "Task \"" + created.getTitle() + "\" created successfully!");

        if (taskDto.getProjectId() != null) {
            return "redirect:/projects/" + taskDto.getProjectId();
        }
        return "redirect:/tasks";
    }

    @GetMapping("/{id}")
    public String showTaskDetail(@PathVariable("id") Long id, Model model) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Task task = taskService.getTaskById(id, currentUserId);
        List<Comment> comments = commentService.getTaskComments(id, currentUserId);

        model.addAttribute("task", task);
        model.addAttribute("comments", comments);
        model.addAttribute("newComment", new CommentRequestDto());
        model.addAttribute("currentUserId", currentUserId);
        model.addAttribute("activeNav", "tasks");

        return "tasks/detail";
    }

    @GetMapping("/{id}/edit")
    public String showEditTaskForm(@PathVariable("id") Long id, Model model) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Task task = taskService.getTaskById(id, currentUserId);

        TaskRequestDto dto = new TaskRequestDto();
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setDueDate(task.getDueDate());
        dto.setCategory(task.getCategory());
        if (task.getProject() != null) {
            dto.setProjectId(task.getProject().getId());
        }
        if (task.getAssignee() != null) {
            dto.setAssigneeId(task.getAssignee().getId());
        }

        model.addAttribute("task", dto);
        model.addAttribute("taskId", id);
        model.addAttribute("projects", projectService.getUserProjects(currentUserId));
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("isEdit", true);
        model.addAttribute("activeNav", "tasks");

        return "tasks/form";
    }

    @PostMapping("/{id}/edit")
    public String updateTask(@PathVariable("id") Long id,
                             @Valid @ModelAttribute("task") TaskRequestDto taskDto,
                             BindingResult bindingResult,
                             Model model,
                             RedirectAttributes redirectAttributes) {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        if (bindingResult.hasErrors()) {
            model.addAttribute("taskId", id);
            model.addAttribute("projects", projectService.getUserProjects(currentUserId));
            model.addAttribute("users", userService.getAllUsers());
            model.addAttribute("isEdit", true);
            model.addAttribute("activeNav", "tasks");
            return "tasks/form";
        }

        taskService.updateTask(id, taskDto, currentUserId);
        redirectAttributes.addFlashAttribute("successMessage", "Task updated successfully!");

        return "redirect:/tasks/" + id;
    }

    @PostMapping("/{id}/delete")
    public String deleteTask(@PathVariable("id") Long id,
                             @RequestParam(value = "redirect", required = false) String redirectUrl,
                             RedirectAttributes redirectAttributes) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        taskService.deleteTask(id, currentUserId);
        redirectAttributes.addFlashAttribute("successMessage", "Task deleted successfully.");

        if (redirectUrl != null && !redirectUrl.isBlank()) {
            return "redirect:" + redirectUrl;
        }
        return "redirect:/tasks";
    }

    @PostMapping("/{id}/status")
    public String updateTaskStatus(@PathVariable("id") Long id,
                                   @RequestParam("status") TaskStatus status,
                                   @RequestParam(value = "redirect", required = false) String redirectUrl,
                                   RedirectAttributes redirectAttributes) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Task updated = taskService.updateTaskStatus(id, status, currentUserId);
        redirectAttributes.addFlashAttribute("successMessage", "Status updated to " + updated.getStatus().getDisplayName());

        if (redirectUrl != null && !redirectUrl.isBlank()) {
            return "redirect:" + redirectUrl;
        }
        return "redirect:/tasks/" + id;
    }

    @PostMapping("/{id}/toggle")
    public String toggleTask(@PathVariable("id") Long id,
                             @RequestParam(value = "redirect", required = false) String redirectUrl,
                             RedirectAttributes redirectAttributes) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Task updated = taskService.toggleTaskComplete(id, currentUserId);
        redirectAttributes.addFlashAttribute("successMessage", "Task marked as " + updated.getStatus().getDisplayName());

        if (redirectUrl != null && !redirectUrl.isBlank()) {
            return "redirect:" + redirectUrl;
        }
        return "redirect:/tasks";
    }

    @PostMapping("/{id}/comments")
    public String addComment(@PathVariable("id") Long id,
                             @Valid @ModelAttribute("newComment") CommentRequestDto commentDto,
                             BindingResult bindingResult,
                             RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            redirectAttributes.addFlashAttribute("errorMessage", "Comment cannot be empty.");
            return "redirect:/tasks/" + id;
        }

        User currentUser = SecurityUtils.getCurrentUser().orElseThrow();
        commentService.addComment(id, commentDto, currentUser);
        redirectAttributes.addFlashAttribute("successMessage", "Comment posted.");

        return "redirect:/tasks/" + id;
    }
}
