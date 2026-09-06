package com.dotoday.service.impl;

import com.dotoday.dto.DashboardStatsDto;
import com.dotoday.entity.ActivityLog;
import com.dotoday.entity.Task;
import com.dotoday.repository.ActivityLogRepository;
import com.dotoday.repository.TaskRepository;
import com.dotoday.service.DashboardService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final TaskRepository taskRepository;
    private final ActivityLogRepository activityLogRepository;

    public DashboardServiceImpl(TaskRepository taskRepository, ActivityLogRepository activityLogRepository) {
        this.taskRepository = taskRepository;
        this.activityLogRepository = activityLogRepository;
    }

    @Override
    public DashboardStatsDto getDashboardStats(Long userId) {
        LocalDate today = LocalDate.now();

        long total = taskRepository.countTotalTasksForUser(userId);
        long completed = taskRepository.countCompletedTasksForUser(userId);
        long pending = taskRepository.countPendingTasksForUser(userId);
        long overdue = taskRepository.countOverdueTasksForUser(userId, today);
        long highPriority = taskRepository.countHighPriorityTasksForUser(userId);
        long dueToday = taskRepository.countDueTodayTasksForUser(userId, today);

        int completionRate = total > 0 ? (int) Math.round((completed * 100.0) / total) : 0;

        List<ActivityLog> recentActivities = activityLogRepository.findRecentActivityForUser(userId, PageRequest.of(0, 10));
        List<Task> dueTodayList = taskRepository.findDueTodayTasksForUser(userId, today);
        List<Task> highPriorityList = taskRepository.findHighPriorityTasksForUser(userId);

        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalTasks(total);
        stats.setCompletedTasks(completed);
        stats.setPendingTasks(pending);
        stats.setOverdueTasks(overdue);
        stats.setHighPriorityTasks(highPriority);
        stats.setDueTodayTasks(dueToday);
        stats.setCompletionPercentage(completionRate);
        stats.setRecentActivities(recentActivities);
        stats.setDueTodayTaskList(dueTodayList);
        stats.setHighPriorityTaskList(highPriorityList);

        return stats;
    }
}
