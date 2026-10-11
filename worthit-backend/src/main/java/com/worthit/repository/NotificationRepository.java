package com.worthit.repository;

import com.worthit.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Repository for the 'notifications' table.
 *
 * Notifications are always fetched for the currently logged-in user.
 * The frontend shows an unread badge using countByUserIdAndIsRead.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // All notifications for a user, newest first
    List<Notification> findByUserIdOrderBySentAtDesc(Long userId);

    // Only unread notifications
    List<Notification> findByUserIdAndIsReadFalseOrderBySentAtDesc(Long userId);

    // Count unread — used for the notification badge on the navbar
    long countByUserIdAndIsReadFalse(Long userId);

    // Mark all notifications as read for a user
    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId")
    int markAllAsRead(@Param("userId") Long userId);
}
