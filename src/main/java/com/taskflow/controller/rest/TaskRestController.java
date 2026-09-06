package com.taskflow.controller.rest;

import com.taskflow.dto.CommentRequestDto;
import com.taskflow.dto.CommentResponseDto;
import com.taskflow.dto.TaskRequestDto;
import com.taskflow.dto.TaskResponseDto;
import com.taskflow.entity.*;
import com.taskflow.security.SecurityUtils;
import com.taskflow.service.CommentService;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskRestController {

    private final TaskService taskService;
    private final CommentService commentService;

    public TaskRestController(TaskService taskService, CommentService commentService) {
        this.taskService = taskService;
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> getAllTasks(
            @RequestParam(value = "status", required = false) TaskStatus status,
            @RequestParam(value = "priority", required = false) TaskPriority priority,
            @RequestParam(value = "projectId", required = false) Long projectId,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir) {

        Long currentUserId = SecurityUtils.getCurrentUserId();
        List<TaskResponseDto> tasks = taskService.getFilteredTaskDtos(currentUserId, status, priority, projectId, keyword, sortBy, sortDir);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<TaskResponseDto> createTask(@Valid @RequestBody TaskRequestDto taskDto) {
        User currentUser = SecurityUtils.getCurrentUser().orElseThrow();
        Task created = taskService.createTask(taskDto, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(TaskResponseDto.fromEntity(created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDto> getTaskById(@PathVariable("id") Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(taskService.getTaskDtoById(id, currentUserId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDto> updateTask(@PathVariable("id") Long id,
                                                      @Valid @RequestBody TaskRequestDto taskDto) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Task updated = taskService.updateTask(id, taskDto, currentUserId);
        return ResponseEntity.ok(TaskResponseDto.fromEntity(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable("id") Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        taskService.deleteTask(id, currentUserId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponseDto> updateStatus(@PathVariable("id") Long id,
                                                        @RequestBody Map<String, String> payload) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        String statusStr = payload.get("status");
        TaskStatus status = TaskStatus.valueOf(statusStr.toUpperCase());
        Task updated = taskService.updateTaskStatus(id, status, currentUserId);
        return ResponseEntity.ok(TaskResponseDto.fromEntity(updated));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable("id") Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(commentService.getTaskCommentDtos(id, currentUserId));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponseDto> addComment(@PathVariable("id") Long id,
                                                         @Valid @RequestBody CommentRequestDto commentDto) {
        User currentUser = SecurityUtils.getCurrentUser().orElseThrow();
        Comment comment = commentService.addComment(id, commentDto, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(CommentResponseDto.fromEntity(comment));
    }
}
