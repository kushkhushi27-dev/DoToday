package com.taskflow.service.impl;

import com.taskflow.entity.ActivityAction;
import com.taskflow.entity.ActivityLog;
import com.taskflow.entity.Project;
import com.taskflow.entity.User;
import com.taskflow.repository.ActivityLogRepository;
import com.taskflow.service.ActivityLogService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogServiceImpl(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    @Override
    public ActivityLog logActivity(ActivityAction action, String description, String entityType, Long entityId, Project project, User user) {
        ActivityLog log = new ActivityLog(action, description, entityType, entityId, project, user);
        return activityLogRepository.save(log);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityLog> getRecentActivitiesForUser(Long userId, int limit) {
        return activityLogRepository.findRecentActivityForUser(userId, PageRequest.of(0, limit));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityLog> getProjectActivities(Long projectId, int limit) {
        return activityLogRepository.findByProjectId(projectId, PageRequest.of(0, limit));
    }
}
