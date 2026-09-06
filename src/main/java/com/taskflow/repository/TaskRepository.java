package com.taskflow.repository;

import com.taskflow.entity.Task;
import com.taskflow.entity.TaskPriority;
import com.taskflow.entity.TaskStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT DISTINCT t FROM Task t " +
           "LEFT JOIN t.project p " +
           "LEFT JOIN p.members m " +
           "WHERE (t.creator.id = :userId OR t.assignee.id = :userId OR p.owner.id = :userId OR m.user.id = :userId)")
    List<Task> findAllAccessibleTasks(@Param("userId") Long userId, Sort sort);

    @Query("SELECT DISTINCT t FROM Task t " +
           "LEFT JOIN t.project p " +
           "LEFT JOIN p.members m " +
           "WHERE (t.creator.id = :userId OR t.assignee.id = :userId OR p.owner.id = :userId OR m.user.id = :userId) " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:priority IS NULL OR t.priority = :priority) " +
           "AND (:projectId IS NULL OR p.id = :projectId) " +
           "AND (:keyword IS NULL OR :keyword = '' OR " +
           "     LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "     LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "     LOWER(t.category) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Task> filterTasks(@Param("userId") Long userId,
                           @Param("status") TaskStatus status,
                           @Param("priority") TaskPriority priority,
                           @Param("projectId") Long projectId,
                           @Param("keyword") String keyword,
                           Sort sort);

    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId ORDER BY t.createdAt DESC")
    List<Task> findByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT DISTINCT t FROM Task t " +
           "LEFT JOIN t.project p " +
           "LEFT JOIN p.members m " +
           "WHERE (t.creator.id = :userId OR t.assignee.id = :userId OR p.owner.id = :userId OR m.user.id = :userId) " +
           "AND t.status = :status")
    List<Task> findByStatusForUser(@Param("userId") Long userId, @Param("status") TaskStatus status);

    @Query("SELECT DISTINCT t FROM Task t " +
           "LEFT JOIN t.project p " +
           "LEFT JOIN p.members m " +
           "WHERE (t.creator.id = :userId OR t.assignee.id = :userId OR p.owner.id = :userId OR m.user.id = :userId) " +
           "AND (:projectId IS NULL OR p.id = :projectId) " +
           "AND t.status = :status")
    List<Task> findByStatusAndProjectForUser(@Param("userId") Long userId,
                                            @Param("projectId") Long projectId,
                                            @Param("status") TaskStatus status);

    @Query("SELECT COUNT(DISTINCT t) FROM Task t " +
           "LEFT JOIN t.project p " +
           "LEFT JOIN p.members m " +
           "WHERE (t.creator.id = :userId OR t.assignee.id = :userId OR p.owner.id = :userId OR m.user.id = :userId)")
    long countTotalTasksForUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(DISTINCT t) FROM Task t " +
           "LEFT JOIN t.project p " +
           "LEFT JOIN p.members m " +
           "WHERE (t.creator.id = :userId OR t.assignee.id = :userId OR p.owner.id = :userId OR m.user.id = :userId) " +
           "AND t.status = 'COMPLETED'")
    long countCompletedTasksForUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(DISTINCT t) FROM Task t " +
           "LEFT JOIN t.project p " +
           "LEFT JOIN p.members m " +
           "WHERE (t.creator.id = :userId OR t.assignee.id = :userId OR p.owner.id = :userId OR m.user.id = :userId) " +
           "AND t.status != 'COMPLETED'")
    long countPendingTasksForUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(DISTINCT t) FROM Task t " +
           "LEFT JOIN t.project p " +
           "LEFT JOIN p.members m " +
           "WHERE (t.creator.id = :userId OR t.assignee.id = :userId OR p.owner.id = :userId OR m.user.id = :userId) " +
           "AND t.dueDate < :today AND t.status != 'COMPLETED'")
    long countOverdueTasksForUser(@Param("userId") Long userId, @Param("today") LocalDate today);

    @Query("SELECT COUNT(DISTINCT t) FROM Task t " +
           "LEFT JOIN t.project p " +
           "LEFT JOIN p.members m " +
           "WHERE (t.creator.id = :userId OR t.assignee.id = :userId OR p.owner.id = :userId OR m.user.id = :userId) " +
           "AND t.priority = 'HIGH' AND t.status != 'COMPLETED'")
    long countHighPriorityTasksForUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(DISTINCT t) FROM Task t " +
           "LEFT JOIN t.project p " +
           "LEFT JOIN p.members m " +
           "WHERE (t.creator.id = :userId OR t.assignee.id = :userId OR p.owner.id = :userId OR m.user.id = :userId) " +
           "AND t.dueDate = :today AND t.status != 'COMPLETED'")
    long countDueTodayTasksForUser(@Param("userId") Long userId, @Param("today") LocalDate today);

    @Query("SELECT DISTINCT t FROM Task t " +
           "LEFT JOIN t.project p " +
           "LEFT JOIN p.members m " +
           "WHERE (t.creator.id = :userId OR t.assignee.id = :userId OR p.owner.id = :userId OR m.user.id = :userId) " +
           "AND t.dueDate = :today AND t.status != 'COMPLETED' ORDER BY t.priority DESC")
    List<Task> findDueTodayTasksForUser(@Param("userId") Long userId, @Param("today") LocalDate today);

    @Query("SELECT DISTINCT t FROM Task t " +
           "LEFT JOIN t.project p " +
           "LEFT JOIN p.members m " +
           "WHERE (t.creator.id = :userId OR t.assignee.id = :userId OR p.owner.id = :userId OR m.user.id = :userId) " +
           "AND t.priority = 'HIGH' AND t.status != 'COMPLETED' ORDER BY t.dueDate ASC")
    List<Task> findHighPriorityTasksForUser(@Param("userId") Long userId);
}
