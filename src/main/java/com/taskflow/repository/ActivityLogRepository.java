package com.taskflow.repository;

import com.taskflow.entity.ActivityLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    @Query("SELECT DISTINCT a FROM ActivityLog a " +
           "LEFT JOIN a.project p " +
           "LEFT JOIN p.members m " +
           "WHERE a.user.id = :userId OR p.owner.id = :userId OR m.user.id = :userId " +
           "ORDER BY a.createdAt DESC")
    List<ActivityLog> findRecentActivityForUser(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT a FROM ActivityLog a WHERE a.project.id = :projectId ORDER BY a.createdAt DESC")
    List<ActivityLog> findByProjectId(@Param("projectId") Long projectId, Pageable pageable);
}
