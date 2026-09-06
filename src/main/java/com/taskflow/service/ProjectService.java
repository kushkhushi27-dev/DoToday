package com.taskflow.service;

import com.taskflow.dto.ProjectRequestDto;
import com.taskflow.dto.ProjectResponseDto;
import com.taskflow.entity.Project;
import com.taskflow.entity.ProjectRole;
import com.taskflow.entity.User;

import java.util.List;

public interface ProjectService {
    Project createProject(ProjectRequestDto dto, User owner);
    Project updateProject(Long projectId, ProjectRequestDto dto, Long currentUserId);
    void deleteProject(Long projectId, Long currentUserId);
    Project getProjectById(Long projectId, Long currentUserId);
    List<Project> getUserProjects(Long userId);
    List<ProjectResponseDto> getUserProjectDtos(Long userId);
    ProjectResponseDto getProjectDtoById(Long projectId, Long currentUserId);
    void addMemberToProject(Long projectId, String userEmail, ProjectRole role, Long currentUserId);
    void removeMemberFromProject(Long projectId, Long memberUserId, Long currentUserId);
    boolean isUserAuthorizedForProject(Long projectId, Long userId);
}
