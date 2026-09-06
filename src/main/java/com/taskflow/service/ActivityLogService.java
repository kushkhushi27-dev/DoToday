package com.taskflow.service;

import com.taskflow.entity.ActivityAction;
import com.taskflow.entity.ActivityLog;
import com.taskflow.entity.Project;
import com.taskflow.entity.User;

import java.util.List;

public interface ActivityLogService {
    ActivityLog logActivity(ActivityAction action, String description, String entityType, Long entityId, Project project, User user);
    List<ActivityLog> getRecentActivitiesForUser(Long userId, int limit);
    List<ActivityLog> getProjectActivities(Long projectId, int limit);
}
