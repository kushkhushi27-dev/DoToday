package com.dotoday.service;

import com.dotoday.entity.ActivityAction;
import com.dotoday.entity.ActivityLog;
import com.dotoday.entity.Project;
import com.dotoday.entity.User;

import java.util.List;

public interface ActivityLogService {
    ActivityLog logActivity(ActivityAction action, String description, String entityType, Long entityId, Project project, User user);
    List<ActivityLog> getRecentActivitiesForUser(Long userId, int limit);
    List<ActivityLog> getProjectActivities(Long projectId, int limit);
}
