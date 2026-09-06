package com.dotoday.service;

import com.dotoday.dto.KanbanColumnDto;
import com.dotoday.dto.TaskRequestDto;
import com.dotoday.dto.TaskResponseDto;
import com.dotoday.entity.Task;
import com.dotoday.entity.TaskPriority;
import com.dotoday.entity.TaskStatus;
import com.dotoday.entity.User;

import java.util.List;

public interface TaskService {
    Task createTask(TaskRequestDto dto, User creator);
    Task updateTask(Long taskId, TaskRequestDto dto, Long currentUserId);
    void deleteTask(Long taskId, Long currentUserId);
    Task getTaskById(Long taskId, Long currentUserId);
    TaskResponseDto getTaskDtoById(Long taskId, Long currentUserId);
    Task updateTaskStatus(Long taskId, TaskStatus status, Long currentUserId);
    Task toggleTaskComplete(Long taskId, Long currentUserId);
    List<Task> getFilteredTasks(Long userId, TaskStatus status, TaskPriority priority, Long projectId, String keyword, String sortBy, String sortDir);
    List<TaskResponseDto> getFilteredTaskDtos(Long userId, TaskStatus status, TaskPriority priority, Long projectId, String keyword, String sortBy, String sortDir);
    List<KanbanColumnDto> getKanbanBoard(Long userId, Long projectId);
}
