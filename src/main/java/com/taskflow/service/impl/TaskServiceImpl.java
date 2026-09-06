package com.taskflow.service.impl;

import com.taskflow.dto.KanbanColumnDto;
import com.taskflow.dto.TaskRequestDto;
import com.taskflow.dto.TaskResponseDto;
import com.taskflow.entity.*;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedAccessException;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.security.SecurityUtils;
import com.taskflow.service.ActivityLogService;
import com.taskflow.service.TaskService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    public TaskServiceImpl(TaskRepository taskRepository,
                           ProjectRepository projectRepository,
                           UserRepository userRepository,
                           ActivityLogService activityLogService) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.activityLogService = activityLogService;
    }

    @Override
    public Task createTask(TaskRequestDto dto, User creator) {
        Task task = new Task();
        task.setTitle(dto.getTitle().trim());
        task.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : "");
        task.setStatus(dto.getStatus() != null ? dto.getStatus() : TaskStatus.TODO);
        task.setPriority(dto.getPriority() != null ? dto.getPriority() : TaskPriority.MEDIUM);
        task.setDueDate(dto.getDueDate());
        task.setCategory(dto.getCategory() != null && !dto.getCategory().isBlank() ? dto.getCategory().trim() : "General");
        task.setCreator(creator);

        Project project = null;
        if (dto.getProjectId() != null) {
            project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + dto.getProjectId()));
            if (!project.hasMember(creator.getId()) && !SecurityUtils.hasRole("ROLE_ADMIN")) {
                throw new UnauthorizedAccessException("You are not a member of this project");
            }
            task.setProject(project);
        }

        if (dto.getAssigneeId() != null) {
            User assignee = userRepository.findById(dto.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee user not found"));
            task.setAssignee(assignee);
        } else if (project == null) {
            // Self-assign personal tasks by default
            task.setAssignee(creator);
        }

        if (task.getStatus() == TaskStatus.COMPLETED) {
            task.setCompletedAt(LocalDateTime.now());
        }

        Task savedTask = taskRepository.save(task);

        activityLogService.logActivity(
                ActivityAction.TASK_CREATED,
                "created task \"" + savedTask.getTitle() + "\"",
                "TASK",
                savedTask.getId(),
                savedTask.getProject(),
                creator
        );

        if (savedTask.getAssignee() != null && !savedTask.getAssignee().getId().equals(creator.getId())) {
            activityLogService.logActivity(
                    ActivityAction.TASK_ASSIGNED,
                    "assigned task \"" + savedTask.getTitle() + "\" to " + savedTask.getAssignee().getFullName(),
                    "TASK",
                    savedTask.getId(),
                    savedTask.getProject(),
                    creator
            );
        }

        return savedTask;
    }

    @Override
    public Task updateTask(Long taskId, TaskRequestDto dto, Long currentUserId) {
        Task task = getTaskById(taskId, currentUserId);
        User currentUser = userRepository.findById(currentUserId).orElse(null);

        task.setTitle(dto.getTitle().trim());
        task.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : "");
        task.setPriority(dto.getPriority() != null ? dto.getPriority() : task.getPriority());
        task.setDueDate(dto.getDueDate());
        if (dto.getCategory() != null && !dto.getCategory().isBlank()) {
            task.setCategory(dto.getCategory().trim());
        }

        TaskStatus oldStatus = task.getStatus();
        if (dto.getStatus() != null && dto.getStatus() != oldStatus) {
            task.setStatus(dto.getStatus());
            if (dto.getStatus() == TaskStatus.COMPLETED) {
                task.setCompletedAt(LocalDateTime.now());
                activityLogService.logActivity(
                        ActivityAction.TASK_COMPLETED,
                        "marked task \"" + task.getTitle() + "\" as completed",
                        "TASK",
                        task.getId(),
                        task.getProject(),
                        currentUser
                );
            }
        }

        // Project change
        if (dto.getProjectId() != null) {
            if (task.getProject() == null || !task.getProject().getId().equals(dto.getProjectId())) {
                Project newProject = projectRepository.findById(dto.getProjectId())
                        .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + dto.getProjectId()));
                if (!newProject.hasMember(currentUserId) && !SecurityUtils.hasRole("ROLE_ADMIN")) {
                    throw new UnauthorizedAccessException("You are not a member of the selected project");
                }
                task.setProject(newProject);
            }
        } else {
            task.setProject(null);
        }

        // Assignee change
        User oldAssignee = task.getAssignee();
        if (dto.getAssigneeId() != null) {
            if (oldAssignee == null || !oldAssignee.getId().equals(dto.getAssigneeId())) {
                User newAssignee = userRepository.findById(dto.getAssigneeId())
                        .orElseThrow(() -> new ResourceNotFoundException("Assignee user not found"));
                task.setAssignee(newAssignee);

                activityLogService.logActivity(
                        ActivityAction.TASK_ASSIGNED,
                        "reassigned task \"" + task.getTitle() + "\" to " + newAssignee.getFullName(),
                        "TASK",
                        task.getId(),
                        task.getProject(),
                        currentUser
                );
            }
        } else {
            task.setAssignee(null);
        }

        Task updatedTask = taskRepository.save(task);

        activityLogService.logActivity(
                ActivityAction.TASK_UPDATED,
                "updated task \"" + updatedTask.getTitle() + "\"",
                "TASK",
                updatedTask.getId(),
                updatedTask.getProject(),
                currentUser
        );

        return updatedTask;
    }

    @Override
    public void deleteTask(Long taskId, Long currentUserId) {
        Task task = getTaskById(taskId, currentUserId);
        boolean isCreator = task.getCreator().getId().equals(currentUserId);
        boolean isProjectOwner = task.getProject() != null && task.getProject().getOwner().getId().equals(currentUserId);
        boolean isAdmin = SecurityUtils.hasRole("ROLE_ADMIN");

        if (!isCreator && !isProjectOwner && !isAdmin) {
            throw new UnauthorizedAccessException("Only task creator or project owner can delete this task");
        }

        User currentUser = userRepository.findById(currentUserId).orElse(null);
        activityLogService.logActivity(
                ActivityAction.TASK_DELETED,
                "deleted task \"" + task.getTitle() + "\"",
                "TASK",
                taskId,
                task.getProject(),
                currentUser
        );

        taskRepository.delete(task);
    }

    @Override
    @Transactional(readOnly = true)
    public Task getTaskById(Long taskId, Long currentUserId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        if (!isUserAuthorizedForTask(task, currentUserId)) {
            throw new UnauthorizedAccessException("You are not authorized to view this task");
        }
        return task;
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponseDto getTaskDtoById(Long taskId, Long currentUserId) {
        return TaskResponseDto.fromEntity(getTaskById(taskId, currentUserId));
    }

    @Override
    public Task updateTaskStatus(Long taskId, TaskStatus status, Long currentUserId) {
        Task task = getTaskById(taskId, currentUserId);
        User currentUser = userRepository.findById(currentUserId).orElse(null);

        if (task.getStatus() != status) {
            task.setStatus(status);
            if (status == TaskStatus.COMPLETED) {
                task.setCompletedAt(LocalDateTime.now());
                activityLogService.logActivity(
                        ActivityAction.TASK_COMPLETED,
                        "completed task \"" + task.getTitle() + "\"",
                        "TASK",
                        task.getId(),
                        task.getProject(),
                        currentUser
                );
            } else {
                task.setCompletedAt(null);
                activityLogService.logActivity(
                        ActivityAction.TASK_UPDATED,
                        "moved task \"" + task.getTitle() + "\" to " + status.getDisplayName(),
                        "TASK",
                        task.getId(),
                        task.getProject(),
                        currentUser
                );
            }
        }
        return taskRepository.save(task);
    }

    @Override
    public Task toggleTaskComplete(Long taskId, Long currentUserId) {
        Task task = getTaskById(taskId, currentUserId);
        TaskStatus nextStatus = (task.getStatus() == TaskStatus.COMPLETED) ? TaskStatus.TODO : TaskStatus.COMPLETED;
        return updateTaskStatus(taskId, nextStatus, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Task> getFilteredTasks(Long userId, TaskStatus status, TaskPriority priority, Long projectId, String keyword, String sortBy, String sortDir) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String property = "createdAt";
        if ("dueDate".equalsIgnoreCase(sortBy)) {
            property = "dueDate";
        } else if ("priority".equalsIgnoreCase(sortBy)) {
            property = "priority";
        } else if ("title".equalsIgnoreCase(sortBy)) {
            property = "title";
        } else if ("status".equalsIgnoreCase(sortBy)) {
            property = "status";
        }

        Sort sort = Sort.by(direction, property);
        return taskRepository.filterTasks(userId, status, priority, projectId, keyword, sort);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponseDto> getFilteredTaskDtos(Long userId, TaskStatus status, TaskPriority priority, Long projectId, String keyword, String sortBy, String sortDir) {
        return getFilteredTasks(userId, status, priority, projectId, keyword, sortBy, sortDir).stream()
                .map(TaskResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<KanbanColumnDto> getKanbanBoard(Long userId, Long projectId) {
        List<Task> allAccessible = taskRepository.findByStatusAndProjectForUser(userId, projectId, TaskStatus.TODO);
        List<Task> inProgress = taskRepository.findByStatusAndProjectForUser(userId, projectId, TaskStatus.IN_PROGRESS);
        List<Task> completed = taskRepository.findByStatusAndProjectForUser(userId, projectId, TaskStatus.COMPLETED);

        return Arrays.asList(
                new KanbanColumnDto(TaskStatus.TODO, "To Do", "secondary", allAccessible),
                new KanbanColumnDto(TaskStatus.IN_PROGRESS, "In Progress", "primary", inProgress),
                new KanbanColumnDto(TaskStatus.COMPLETED, "Completed", "success", completed)
        );
    }

    private boolean isUserAuthorizedForTask(Task task, Long userId) {
        if (SecurityUtils.hasRole("ROLE_ADMIN")) {
            return true;
        }
        if (task.getCreator().getId().equals(userId)) {
            return true;
        }
        if (task.getAssignee() != null && task.getAssignee().getId().equals(userId)) {
            return true;
        }
        if (task.getProject() != null) {
            return task.getProject().hasMember(userId);
        }
        return false;
    }
}
