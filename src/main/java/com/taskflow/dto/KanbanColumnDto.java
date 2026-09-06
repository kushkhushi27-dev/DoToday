package com.taskflow.dto;

import com.taskflow.entity.Task;
import com.taskflow.entity.TaskStatus;

import java.util.ArrayList;
import java.util.List;

public class KanbanColumnDto {
    private TaskStatus status;
    private String title;
    private String badgeClass;
    private List<Task> tasks = new ArrayList<>();

    public KanbanColumnDto(TaskStatus status, String title, String badgeClass, List<Task> tasks) {
        this.status = status;
        this.title = title;
        this.badgeClass = badgeClass;
        this.tasks = tasks != null ? tasks : new ArrayList<>();
    }

    public TaskStatus getStatus() {
        return status;
    }

    public String getTitle() {
        return title;
    }

    public String getBadgeClass() {
        return badgeClass;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public int getCount() {
        return tasks.size();
    }
}
