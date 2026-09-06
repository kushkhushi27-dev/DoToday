package com.dotoday.repository;

import com.dotoday.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId);
    List<ProjectMember> findByProjectId(Long projectId);
    boolean existsByProjectIdAndUserId(Long projectId, Long userId);
    void deleteByProjectIdAndUserId(Long projectId, Long userId);
}
