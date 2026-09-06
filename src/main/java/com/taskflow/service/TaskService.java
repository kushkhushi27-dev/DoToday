package com.taskflow.service;

import com.taskflow.dto.KanbanColumnDto;
import com.taskflow.dto.TaskRequestDto;
import com.taskflow.dto.TaskResponseDto;
import com.taskflow.entity.Task;
import com.taskflow.entity.TaskPriority;
import com.taskflow.entity.TaskStatus;
import com.taskflow.entity.User;

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
