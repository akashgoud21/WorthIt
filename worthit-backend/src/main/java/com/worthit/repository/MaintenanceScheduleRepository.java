package com.worthit.repository;

import com.worthit.model.MaintenanceSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for the 'maintenance_schedules' table.
 *
 * The scheduler queries overdue and upcoming schedules daily to
 * create SERVICE_DUE notifications.
 */
@Repository
public interface MaintenanceScheduleRepository extends JpaRepository<MaintenanceSchedule, Long> {

    // All schedules for a product
    List<MaintenanceSchedule> findByProductId(Long productId);

    // All schedules for a user (via product → user join)
    @Query("SELECT ms FROM MaintenanceSchedule ms WHERE ms.product.user.id = :userId " +
           "ORDER BY ms.dueDate ASC")
    List<MaintenanceSchedule> findAllByUserId(@Param("userId") Long userId);

    // Schedules due today or overdue, where reminder hasn't been sent yet
    // Used by the daily @Scheduled job
    @Query("SELECT ms FROM MaintenanceSchedule ms " +
           "WHERE ms.dueDate <= :today AND ms.reminderSent = false")
    List<MaintenanceSchedule> findDueSchedules(@Param("today") LocalDate today);

    // Schedules due within the next N days (for upcoming reminders)
    @Query("SELECT ms FROM MaintenanceSchedule ms " +
           "WHERE ms.product.user.id = :userId " +
           "AND ms.dueDate BETWEEN :from AND :to " +
           "ORDER BY ms.dueDate ASC")
    List<MaintenanceSchedule> findUpcoming(@Param("userId") Long userId,
                                          @Param("from") LocalDate from,
                                          @Param("to") LocalDate to);
}
