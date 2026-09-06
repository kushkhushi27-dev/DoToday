package com.taskflow.dto;

import com.taskflow.entity.Task;
import com.taskflow.entity.TaskPriority;
import com.taskflow.entity.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskResponseDto {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private String statusDisplayName;
    private String statusBadgeColor;
    private TaskPriority priority;
    private String priorityDisplayName;
    private String priorityBadgeColor;
    private LocalDate dueDate;
    private String category;
    private Long projectId;
    private String projectName;
    private String projectColor;
    private Long creatorId;
    private String creatorName;
    private Long assigneeId;
    private String assigneeName;
    private String assigneeInitials;
    private String assigneeColor;
    private boolean overdue;
    private boolean dueToday;
    private int commentCount;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public TaskResponseDto() {
    }

    public static TaskResponseDto fromEntity(Task task) {
        TaskResponseDto dto = new TaskResponseDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setStatusDisplayName(task.getStatus().getDisplayName());
        dto.setStatusBadgeColor(task.getStatus().getBadgeColor());
        dto.setPriority(task.getPriority());
        dto.setPriorityDisplayName(task.getPriority().getDisplayName());
        dto.setPriorityBadgeColor(task.getPriority().getBadgeColor());
        dto.setDueDate(task.getDueDate());
        dto.setCategory(task.getCategory());
        if (task.getProject() != null) {
            dto.setProjectId(task.getProject().getId());
            dto.setProjectName(task.getProject().getName());
            dto.setProjectColor(task.getProject().getColor());
        }
        if (task.getCreator() != null) {
            dto.setCreatorId(task.getCreator().getId());
            dto.setCreatorName(task.getCreator().getFullName());
        }
        if (task.getAssignee() != null) {
            dto.setAssigneeId(task.getAssignee().getId());
            dto.setAssigneeName(task.getAssignee().getFullName());
            dto.setAssigneeInitials(task.getAssignee().getInitials());
            dto.setAssigneeColor(task.getAssignee().getAvatarColor());
        }
        dto.setOverdue(task.isOverdue());
        dto.setDueToday(task.isDueToday());
        dto.setCommentCount(task.getComments() != null ? task.getComments().size() : 0);
        dto.setCreatedAt(task.getCreatedAt());
        dto.setCompletedAt(task.getCompletedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public String getStatusDisplayName() {
        return statusDisplayName;
    }

    public void setStatusDisplayName(String statusDisplayName) {
        this.statusDisplayName = statusDisplayName;
    }

    public String getStatusBadgeColor() {
        return statusBadgeColor;
    }

    public void setStatusBadgeColor(String statusBadgeColor) {
        this.statusBadgeColor = statusBadgeColor;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public String getPriorityDisplayName() {
        return priorityDisplayName;
    }

    public void setPriorityDisplayName(String priorityDisplayName) {
        this.priorityDisplayName = priorityDisplayName;
    }

    public String getPriorityBadgeColor() {
        return priorityBadgeColor;
    }

    public void setPriorityBadgeColor(String priorityBadgeColor) {
        this.priorityBadgeColor = priorityBadgeColor;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectColor() {
        return projectColor;
    }

    public void setProjectColor(String projectColor) {
        this.projectColor = projectColor;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public String getAssigneeName() {
        return assigneeName;
    }

    public void setAssigneeName(String assigneeName) {
        this.assigneeName = assigneeName;
    }

    public String getAssigneeInitials() {
        return assigneeInitials;
    }

    public void setAssigneeInitials(String assigneeInitials) {
        this.assigneeInitials = assigneeInitials;
    }

    public String getAssigneeColor() {
        return assigneeColor;
    }

    public void setAssigneeColor(String assigneeColor) {
        this.assigneeColor = assigneeColor;
    }

    public boolean isOverdue() {
        return overdue;
    }

    public void setOverdue(boolean overdue) {
        this.overdue = overdue;
    }

    public boolean isDueToday() {
        return dueToday;
    }

    public void setDueToday(boolean dueToday) {
        this.dueToday = dueToday;
    }

    public int getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(int commentCount) {
        this.commentCount = commentCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
