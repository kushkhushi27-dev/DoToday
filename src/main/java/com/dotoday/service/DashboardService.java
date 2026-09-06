package com.dotoday.service;

import com.dotoday.dto.DashboardStatsDto;

public interface DashboardService {
    DashboardStatsDto getDashboardStats(Long userId);
}
