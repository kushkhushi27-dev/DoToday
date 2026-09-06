package com.dotoday.dto;

import com.dotoday.entity.ActivityLog;
import com.dotoday.entity.Task;

import java.util.ArrayList;
import java.util.List;

public class DashboardStatsDto {
    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long overdueTasks;
    private long highPriorityTasks;
    private long dueTodayTasks;
    private int completionPercentage;
    private List<ActivityLog> recentActivities = new ArrayList<>();
    private List<Task> dueTodayTaskList = new ArrayList<>();
    private List<Task> highPriorityTaskList = new ArrayList<>();

    public DashboardStatsDto() {
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public long getOverdueTasks() {
        return overdueTasks;
    }

    public void setOverdueTasks(long overdueTasks) {
        this.overdueTasks = overdueTasks;
    }

    public long getHighPriorityTasks() {
        return highPriorityTasks;
    }

    public void setHighPriorityTasks(long highPriorityTasks) {
        this.highPriorityTasks = highPriorityTasks;
    }

    public long getDueTodayTasks() {
        return dueTodayTasks;
    }

    public void setDueTodayTasks(long dueTodayTasks) {
        this.dueTodayTasks = dueTodayTasks;
    }

    public int getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(int completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public List<ActivityLog> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<ActivityLog> recentActivities) {
        this.recentActivities = recentActivities;
    }

    public List<Task> getDueTodayTaskList() {
        return dueTodayTaskList;
    }

    public void setDueTodayTaskList(List<Task> dueTodayTaskList) {
        this.dueTodayTaskList = dueTodayTaskList;
    }

    public List<Task> getHighPriorityTaskList() {
        return highPriorityTaskList;
    }

    public void setHighPriorityTaskList(List<Task> highPriorityTaskList) {
        this.highPriorityTaskList = highPriorityTaskList;
    }
}
