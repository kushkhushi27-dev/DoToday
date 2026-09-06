package com.taskflow.service;

import com.taskflow.dto.TaskRequestDto;
import com.taskflow.entity.*;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ActivityLogService activityLogService;

    @InjectMocks
    private TaskServiceImpl taskService;

    private User testUser;
    private Project testProject;
    private Task testTask;

    @BeforeEach
    void setUp() {
        testUser = new User("testuser", "test@example.com", "password", "Test User");
        testUser.setId(1L);

        testProject = new Project("Test Project", "Description", "#3B82F6", testUser);
        testProject.setId(10L);

        testTask = new Task();
        testTask.setId(100L);
        testTask.setTitle("Test Task Title");
        testTask.setStatus(TaskStatus.TODO);
        testTask.setPriority(TaskPriority.HIGH);
        testTask.setCreator(testUser);
        testTask.setAssignee(testUser);
        testTask.setProject(testProject);
        testTask.setDueDate(LocalDate.now().plusDays(3));
    }

    @Test
    @DisplayName("Should create task successfully for creator")
    void testCreateTask() {
        TaskRequestDto dto = new TaskRequestDto();
        dto.setTitle("Implement JUnit Tests");
        dto.setDescription("Testing service layer");
        dto.setStatus(TaskStatus.TODO);
        dto.setPriority(TaskPriority.HIGH);
        dto.setDueDate(LocalDate.now().plusDays(2));
        dto.setCategory("Testing");

        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task t = invocation.getArgument(0);
            t.setId(101L);
            return t;
        });

        Task result = taskService.createTask(dto, testUser);

        assertNotNull(result);
        assertEquals("Implement JUnit Tests", result.getTitle());
        assertEquals(TaskPriority.HIGH, result.getPriority());
        assertEquals(TaskStatus.TODO, result.getStatus());
        verify(taskRepository, times(1)).save(any(Task.class));
        verify(activityLogService, times(1)).logActivity(eq(ActivityAction.TASK_CREATED), anyString(), eq("TASK"), anyLong(), any(), eq(testUser));
    }

    @Test
    @DisplayName("Should get task by id when user is creator")
    void testGetTaskByIdAuthorized() {
        when(taskRepository.findById(100L)).thenReturn(Optional.of(testTask));

        Task result = taskService.getTaskById(100L, testUser.getId());

        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertEquals("Test Task Title", result.getTitle());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when task id does not exist")
    void testGetTaskByIdNotFound() {
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            taskService.getTaskById(999L, testUser.getId());
        });
    }

    @Test
    @DisplayName("Should update task status to COMPLETED and set completedAt")
    void testUpdateTaskStatusToCompleted() {
        when(taskRepository.findById(100L)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Task updated = taskService.updateTaskStatus(100L, TaskStatus.COMPLETED, testUser.getId());

        assertEquals(TaskStatus.COMPLETED, updated.getStatus());
        assertNotNull(updated.getCompletedAt());
        verify(activityLogService).logActivity(eq(ActivityAction.TASK_COMPLETED), anyString(), eq("TASK"), eq(100L), any(), any());
    }
}
