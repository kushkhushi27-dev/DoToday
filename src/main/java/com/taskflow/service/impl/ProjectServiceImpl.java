package com.taskflow.service.impl;

import com.taskflow.dto.ProjectRequestDto;
import com.taskflow.dto.ProjectResponseDto;
import com.taskflow.entity.ActivityAction;
import com.taskflow.entity.Project;
import com.taskflow.entity.ProjectMember;
import com.taskflow.entity.ProjectRole;
import com.taskflow.entity.User;
import com.taskflow.exception.BadRequestException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedAccessException;
import com.taskflow.repository.ProjectMemberRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.security.SecurityUtils;
import com.taskflow.service.ActivityLogService;
import com.taskflow.service.ProjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              ProjectMemberRepository projectMemberRepository,
                              UserRepository userRepository,
                              ActivityLogService activityLogService) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userRepository = userRepository;
        this.activityLogService = activityLogService;
    }

    @Override
    public Project createProject(ProjectRequestDto dto, User owner) {
        Project project = new Project(
                dto.getName().trim(),
                dto.getDescription() != null ? dto.getDescription().trim() : "",
                dto.getColor(),
                owner
        );
        Project savedProject = projectRepository.save(project);

        activityLogService.logActivity(
                ActivityAction.TASK_CREATED,
                "created project \"" + savedProject.getName() + "\"",
                "PROJECT",
                savedProject.getId(),
                savedProject,
                owner
        );

        return savedProject;
    }

    @Override
    public Project updateProject(Long projectId, ProjectRequestDto dto, Long currentUserId) {
        Project project = getProjectById(projectId, currentUserId);
        if (!isProjectAdmin(project, currentUserId)) {
            throw new UnauthorizedAccessException("Only project owner or admin can update project details");
        }

        project.setName(dto.getName().trim());
        project.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : "");
        if (dto.getColor() != null && !dto.getColor().isBlank()) {
            project.setColor(dto.getColor());
        }

        return projectRepository.save(project);
    }

    @Override
    public void deleteProject(Long projectId, Long currentUserId) {
        Project project = getProjectById(projectId, currentUserId);
        if (!isProjectAdmin(project, currentUserId)) {
            throw new UnauthorizedAccessException("Only project owner or admin can delete this project");
        }
        projectRepository.delete(project);
    }

    @Override
    @Transactional(readOnly = true)
    public Project getProjectById(Long projectId, Long currentUserId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        if (!isUserAuthorizedForProject(projectId, currentUserId)) {
            throw new UnauthorizedAccessException("You are not authorized to access this project");
        }
        return project;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> getUserProjects(Long userId) {
        return projectRepository.findAllAccessibleProjects(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponseDto> getUserProjectDtos(Long userId) {
        return projectRepository.findAllAccessibleProjects(userId).stream()
                .map(ProjectResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponseDto getProjectDtoById(Long projectId, Long currentUserId) {
        return ProjectResponseDto.fromEntity(getProjectById(projectId, currentUserId));
    }

    @Override
    public void addMemberToProject(Long projectId, String userEmail, ProjectRole role, Long currentUserId) {
        Project project = getProjectById(projectId, currentUserId);
        if (!isProjectAdmin(project, currentUserId)) {
            throw new UnauthorizedAccessException("Only project owner can add new members");
        }

        User newMember = userRepository.findByEmail(userEmail.trim())
                .or(() -> userRepository.findByUsername(userEmail.trim()))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email/username: " + userEmail));

        if (project.getOwner().getId().equals(newMember.getId())) {
            throw new BadRequestException("User is already the owner of this project");
        }

        if (projectMemberRepository.existsByProjectIdAndUserId(projectId, newMember.getId())) {
            throw new BadRequestException("User is already a member of this project");
        }

        ProjectMember member = new ProjectMember(project, newMember, role != null ? role : ProjectRole.MEMBER);
        projectMemberRepository.save(member);

        User currentUser = userRepository.findById(currentUserId).orElse(null);
        activityLogService.logActivity(
                ActivityAction.MEMBER_ADDED,
                "added " + newMember.getFullName() + " to project",
                "MEMBER",
                newMember.getId(),
                project,
                currentUser
        );
    }

    @Override
    public void removeMemberFromProject(Long projectId, Long memberUserId, Long currentUserId) {
        Project project = getProjectById(projectId, currentUserId);
        if (!isProjectAdmin(project, currentUserId) && !currentUserId.equals(memberUserId)) {
            throw new UnauthorizedAccessException("Only project owner can remove members");
        }

        projectMemberRepository.deleteByProjectIdAndUserId(projectId, memberUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isUserAuthorizedForProject(Long projectId, Long userId) {
        if (SecurityUtils.hasRole("ROLE_ADMIN")) {
            return true;
        }
        return projectRepository.findById(projectId)
                .map(p -> p.hasMember(userId))
                .orElse(false);
    }

    private boolean isProjectAdmin(Project project, Long userId) {
        return project.getOwner().getId().equals(userId) || SecurityUtils.hasRole("ROLE_ADMIN");
    }
}
