package com.taskflow.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.controller.rest.TaskRestController;
import com.taskflow.dto.TaskRequestDto;
import com.taskflow.dto.TaskResponseDto;
import com.taskflow.entity.Task;
import com.taskflow.entity.TaskPriority;
import com.taskflow.entity.TaskStatus;
import com.taskflow.entity.User;
import com.taskflow.security.CustomUserDetails;
import com.taskflow.service.CommentService;
import com.taskflow.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskRestController.class)
@AutoConfigureMockMvc(addFilters = false)
public class TaskRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TaskService taskService;

    @MockBean
    private CommentService commentService;

    private User testUser;

    @BeforeEach
    void setupSecurity() {
        testUser = new User("tester", "tester@taskflow.com", "pass", "Test User");
        testUser.setId(1L);

        CustomUserDetails userDetails = new CustomUserDetails(testUser);
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    @DisplayName("GET /api/tasks returns 200 OK and task list")
    void testGetAllTasks() throws Exception {
        TaskResponseDto dto = new TaskResponseDto();
        dto.setId(1L);
        dto.setTitle("Sample Task");
        dto.setStatus(TaskStatus.TODO);
        dto.setPriority(TaskPriority.HIGH);

        when(taskService.getFilteredTaskDtos(anyLong(), any(), any(), any(), any(), anyString(), anyString()))
                .thenReturn(Collections.singletonList(dto));

        mockMvc.perform(get("/api/tasks")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].title").value("Sample Task"))
                .andExpect(jsonPath("$[0].priority").value("HIGH"));
    }

    @Test
    @DisplayName("POST /api/tasks creates task and returns 201 CREATED")
    void testCreateTask() throws Exception {
        TaskRequestDto request = new TaskRequestDto();
        request.setTitle("Build Microservice");
        request.setDescription("Spring Boot task");
        request.setStatus(TaskStatus.TODO);
        request.setPriority(TaskPriority.MEDIUM);
        request.setDueDate(LocalDate.now().plusDays(5));

        Task createdTask = new Task();
        createdTask.setId(50L);
        createdTask.setTitle("Build Microservice");
        createdTask.setStatus(TaskStatus.TODO);
        createdTask.setPriority(TaskPriority.MEDIUM);
        createdTask.setCreator(testUser);

        when(taskService.createTask(any(TaskRequestDto.class), any(User.class)))
                .thenReturn(createdTask);

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(50L))
                .andExpect(jsonPath("$.title").value("Build Microservice"));
    }
}
