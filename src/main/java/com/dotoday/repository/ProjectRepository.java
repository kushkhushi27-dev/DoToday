package com.dotoday.repository;

import com.dotoday.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members m WHERE p.owner.id = :userId OR m.user.id = :userId ORDER BY p.updatedAt DESC")
    List<Project> findAllAccessibleProjects(@Param("userId") Long userId);

    @Query("SELECT p FROM Project p WHERE p.owner.id = :userId ORDER BY p.updatedAt DESC")
    List<Project> findByOwnerId(@Param("userId") Long userId);
}
