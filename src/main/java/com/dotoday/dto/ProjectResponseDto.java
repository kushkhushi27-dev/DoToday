package com.dotoday.dto;

import com.dotoday.entity.Project;
import com.dotoday.entity.Task;
import com.dotoday.entity.TaskStatus;

import java.time.LocalDateTime;

public class ProjectResponseDto {
    private Long id;
    private String name;
    private String description;
    private String color;
    private Long ownerId;
    private String ownerName;
    private int memberCount;
    private int taskCount;
    private int completedTaskCount;
    private int progressPercentage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProjectResponseDto() {
    }

    public static ProjectResponseDto fromEntity(Project project) {
        ProjectResponseDto dto = new ProjectResponseDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setColor(project.getColor());
        if (project.getOwner() != null) {
            dto.setOwnerId(project.getOwner().getId());
            dto.setOwnerName(project.getOwner().getFullName());
        }
        int members = project.getMembers() != null ? project.getMembers().size() + 1 : 1; // including owner
        dto.setMemberCount(members);

        if (project.getTasks() != null) {
            int total = project.getTasks().size();
            long completed = project.getTasks().stream()
                    .filter(t -> t.getStatus() == TaskStatus.COMPLETED)
                    .count();
            dto.setTaskCount(total);
            dto.setCompletedTaskCount((int) completed);
            dto.setProgressPercentage(total > 0 ? (int) Math.round((completed * 100.0) / total) : 0);
        } else {
            dto.setTaskCount(0);
            dto.setCompletedTaskCount(0);
            dto.setProgressPercentage(0);
        }
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public int getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }

    public int getTaskCount() {
        return taskCount;
    }

    public void setTaskCount(int taskCount) {
        this.taskCount = taskCount;
    }

    public int getCompletedTaskCount() {
        return completedTaskCount;
    }

    public void setCompletedTaskCount(int completedTaskCount) {
        this.completedTaskCount = completedTaskCount;
    }

    public int getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(int progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
