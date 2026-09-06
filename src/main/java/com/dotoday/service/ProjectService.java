package com.dotoday.service;

import com.dotoday.dto.ProjectRequestDto;
import com.dotoday.dto.ProjectResponseDto;
import com.dotoday.entity.Project;
import com.dotoday.entity.ProjectRole;
import com.dotoday.entity.User;

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
