package com.dotoday.controller.rest;

import com.dotoday.dto.ProjectRequestDto;
import com.dotoday.dto.ProjectResponseDto;
import com.dotoday.entity.Project;
import com.dotoday.entity.ProjectRole;
import com.dotoday.entity.User;
import com.dotoday.security.SecurityUtils;
import com.dotoday.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectRestController {

    private final ProjectService projectService;

    public ProjectRestController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponseDto>> getAllProjects() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(projectService.getUserProjectDtos(currentUserId));
    }

    @PostMapping
    public ResponseEntity<ProjectResponseDto> createProject(@Valid @RequestBody ProjectRequestDto projectDto) {
        User currentUser = SecurityUtils.getCurrentUser().orElseThrow();
        Project created = projectService.createProject(projectDto, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(ProjectResponseDto.fromEntity(created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponseDto> getProjectById(@PathVariable("id") Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(projectService.getProjectDtoById(id, currentUserId));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<Map<String, String>> addMember(@PathVariable("id") Long id,
                                                         @RequestBody Map<String, String> payload) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        String email = payload.get("email");
        String roleStr = payload.getOrDefault("role", "MEMBER");
        ProjectRole role = ProjectRole.valueOf(roleStr.toUpperCase());

        projectService.addMemberToProject(id, email, role, currentUserId);
        return ResponseEntity.ok(Map.of("message", "Member added successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable("id") Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        projectService.deleteProject(id, currentUserId);
        return ResponseEntity.noContent().build();
    }
}
