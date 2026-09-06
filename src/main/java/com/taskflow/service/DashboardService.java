package com.taskflow.service;

import com.taskflow.dto.DashboardStatsDto;

public interface DashboardService {
    DashboardStatsDto getDashboardStats(Long userId);
}
